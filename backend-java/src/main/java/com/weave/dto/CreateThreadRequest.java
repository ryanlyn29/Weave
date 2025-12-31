package com.weave.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateThreadRequest {
    @NotBlank
    private String content;

    private String title;

    private List<UUID> participantIds; // For group chats, list of user IDs to include (besides current user)

    private Boolean isGroupChat;

    public CreateThreadRequest() {
    }

    public CreateThreadRequest(String content, String title, List<UUID> participantIds, Boolean isGroupChat) {
        this.content = content;
        this.title = title;
        this.participantIds = participantIds;
        this.isGroupChat = isGroupChat;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<UUID> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(List<UUID> participantIds) {
        this.participantIds = participantIds;
    }

    public Boolean getIsGroupChat() {
        return isGroupChat;
    }

    public void setIsGroupChat(Boolean isGroupChat) {
        this.isGroupChat = isGroupChat;
    }
}
