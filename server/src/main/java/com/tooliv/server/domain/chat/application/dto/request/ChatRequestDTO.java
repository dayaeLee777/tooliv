package com.tooliv.server.domain.chat.application.dto.request;

import com.tooliv.server.domain.chat.domain.ChatMessage;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@ApiModel("ChatRequestDTO")
@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor
public class ChatRequestDTO implements Serializable {

    @ApiModelProperty(name = "채팅방 ID")
    private String roomId;

    @ApiModelProperty(name = "보낸사람 name")
    private String sender;

    @ApiModelProperty(name = "내용")
    private String contents;

    @ApiModelProperty(name = "메시지 타입")
    private ChatMessage.MessageType type;

    @ApiModelProperty(name = "파일")
    private List<String> files;
}
