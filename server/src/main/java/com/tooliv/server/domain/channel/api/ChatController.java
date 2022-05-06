package com.tooliv.server.domain.channel.api;

import com.tooliv.server.domain.channel.application.chatService.ChatService;
import com.tooliv.server.domain.channel.application.chatService.RedisPublisher;
import com.tooliv.server.domain.channel.application.chatService.RedisUserPublisher;
import com.tooliv.server.domain.channel.application.dto.request.ChatDirectDTO;
import com.tooliv.server.domain.channel.application.dto.request.ChatRequestDTO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@Api(value = "Chat API", tags = {"Chat"})
@RequiredArgsConstructor
public class ChatController {

    private final RedisPublisher redisPublisher;
    private final RedisUserPublisher redisUserPublisher;
    private final ChatService chatService;

    // websocket "/pub/chat/message"로 들어오는 메시지
    @MessageMapping("/chat/message")
    @ApiOperation(value = "채팅방 메시지", notes = "메시지")
    public void message(ChatRequestDTO chatRequestDTO) {
        try {
            // 로그인 회원 정보로 대화명 설정
            chatService.setChatInfoValue(chatRequestDTO.getChannelId(), chatRequestDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Websocket에 발행된 메시지를 redis로 발행(publish)
        redisPublisher.publish(chatService.getTopic(chatRequestDTO.getChannelId()), chatRequestDTO);
    }

    @MessageMapping("/chat/directMessage")
    @ApiOperation(value = "개인 메시지", notes = "메시지")
    public void directMessage(ChatDirectDTO chatDirectDTO) {
        try {
            // 로그인 회원 정보로 대화명 설정
            chatService.setDirectChatInfoValue(chatDirectDTO.getChannelId(), chatDirectDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Websocket에 발행된 메시지를 redis로 발행(publish)
        redisUserPublisher.userPublish(chatService.getTopic(chatDirectDTO.getChannelId()), chatDirectDTO);
    }

    // websocket "/pub/chat/enter"로 들어오는 메시지
    @MessageMapping("/chat/enter")
    @ApiOperation(value = "채팅방 참여")
    public void enterChat(String channelId) {
        // 채팅방 참여
        try {
            chatService.enterChatRoom(channelId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
