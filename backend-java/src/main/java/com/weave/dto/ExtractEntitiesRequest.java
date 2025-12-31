package com.weave.dto;

import java.util.UUID;

public class ExtractEntitiesRequest {
    private UUID messageId;
    private UUID threadId;
    private String content;

    public ExtractEntitiesRequest() {
    }

    public ExtractEntitiesRequest(UUID messageId, UUID threadId, String content) {
        this.messageId = messageId;
        this.threadId = threadId;
        this.content = content;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public UUID getThreadId() {
        return threadId;
    }

    public String getContent() {
        return content;
    }
}
