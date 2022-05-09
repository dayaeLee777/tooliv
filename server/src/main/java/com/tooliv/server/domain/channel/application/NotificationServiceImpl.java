package com.tooliv.server.domain.channel.application;

import com.tooliv.server.domain.channel.application.dto.response.DirectInfoDTO;
import com.tooliv.server.domain.channel.application.dto.response.DirectListResponseDTO;
import com.tooliv.server.domain.channel.application.dto.response.NotificationInfoDTO;
import com.tooliv.server.domain.channel.application.dto.response.NotificationListResponseDTO;
import com.tooliv.server.domain.channel.domain.Channel;
import com.tooliv.server.domain.channel.domain.ChannelMembers;
import com.tooliv.server.domain.channel.domain.DirectChatNotification;
import com.tooliv.server.domain.channel.domain.DirectChatRoom;
import com.tooliv.server.domain.channel.domain.DirectChatRoomMembers;
import com.tooliv.server.domain.channel.domain.repository.ChannelMembersRepository;
import com.tooliv.server.domain.channel.domain.repository.DirectChatNotificationRepository;
import com.tooliv.server.domain.channel.domain.repository.DirectChatRoomMembersRepository;
import com.tooliv.server.domain.user.domain.User;
import com.tooliv.server.domain.user.domain.repository.UserRepository;
import com.tooliv.server.global.common.AwsS3Service;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final DirectChatNotificationRepository directChatNotificationRepository;

    private final UserRepository userRepository;

    private final ChannelMembersRepository channelMembersRepository;

    private final DirectChatRoomMembersRepository directChatRoomMembersRepository;

    private final AwsS3Service awsS3Service;

    @Override
    public NotificationListResponseDTO getNotificationList(String email) {
        User user = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        List<ChannelMembers> channelMembers = channelMembersRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("채널 정보가 존재하지 않습니다."));
        List<NotificationInfoDTO> notificationInfoDTOList = new ArrayList<>();
        for (int i = 0; i < channelMembers.size(); i++) {
            notificationInfoDTOList.add(
                new NotificationInfoDTO(channelMembers.get(i).getChannel().getId(), channelMembers.get(i).getChannel().getWorkspace().getId(),
                    checkNotification(channelMembers.get(i), channelMembers.get(i).getChannel())));
        }
        return new NotificationListResponseDTO(notificationInfoDTOList);
    }

    @Override
    public DirectListResponseDTO getDirectNotificationList(String email) {
        User user = userRepository.findByEmailAndDeletedAt(SecurityContextHolder.getContext().getAuthentication().getName(), null)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));
        List<DirectChatRoomMembers> directChatRoomMembersList = directChatRoomMembersRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("메시지 정보가 존재하지 않습니다."));
        List<DirectInfoDTO> directInfoDTOList = new ArrayList<>();
        for (int i = 0; i < directChatRoomMembersList.size(); i++) {
            List<DirectChatRoomMembers> directChatRoomMembers = directChatRoomMembersRepository.findByDirectChatRoom(directChatRoomMembersList.get(i).getDirectChatRoom())
                .orElseThrow(() -> new IllegalArgumentException("다이렉트 룸 정보가 존재하지 않습니다."));
            for (int j = 0; j < directChatRoomMembers.size(); j++) {
                if (!directChatRoomMembers.get(j).getUser().getId().equals(user.getId())) {
                    User receiver = directChatRoomMembers.get(j).getUser();
                    String imageUrl = awsS3Service.getFilePath(receiver.getProfileImage());
                    directInfoDTOList.add(new DirectInfoDTO(imageUrl, receiver.getNickname(), directChatRoomMembersList.get(i).getDirectChatRoom().getId(),
                        checkDirectNotification(directChatRoomMembersList.get(i), directChatRoomMembersList.get(i).getDirectChatRoom())));
                }
            }
        }
        return new DirectListResponseDTO(directInfoDTOList);
    }

    @Override
    public void createDirectChatNotification(User user, DirectChatRoom directChatRoom) {// 개인 메시지지 알람 생성
        DirectChatNotification directChatNotification = DirectChatNotification.builder().directChatRoom(directChatRoom).user(user).build();
        directChatNotificationRepository.save((directChatNotification));
    }

    @Override
    public void readDirectChatNotification(User user, DirectChatRoom directChatRoom) {
        DirectChatNotification directChatNotification = directChatNotificationRepository.findByDirectChatRoomAndUserAndNotificationYn(directChatRoom, user, false).orElse(null);
        directChatNotification.updateRead(true);
        directChatNotificationRepository.save(directChatNotification);
    }

    boolean checkNotification(ChannelMembers channelMembers, Channel channel) {
        if (channelMembers.getLoggedAt() == null) {// 멤버가 로그인한적 없는 경우
            return false;
        }
        if (channel.getWroteAt() == null) {// 채널에 글이 써진적이 없는 경우
            return true;
        }
        if (channelMembers.getLoggedAt().isBefore(channel.getWroteAt())) {// 멤버가 로그인한 시간이 채널 업데이트시간보다 이전인 경우
            return false;
        } else {
            return true;
        }
    }

    boolean checkDirectNotification(DirectChatRoomMembers directChatRoomMembers, DirectChatRoom directChatRoom) {
        if (directChatRoomMembers.getLoggedAt() == null) {// 멤버가 로그인한적 없는 경우
            return false;
        }
        if (directChatRoom.getWroteAt() == null) {// 채널에 글이 써진적이 없는 경우
            return true;
        }
        if (directChatRoomMembers.getLoggedAt().isBefore(directChatRoom.getWroteAt())) {// 멤버가 로그인한 시간이 채널 업데이트시간보다 이전인 경우
            return false;
        } else {
            return true;
        }
    }
}
