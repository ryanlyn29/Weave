package com.weave.dto;

import java.util.List;

public class SendMessageResponse {
    private final MessageDTO message;
    private final List<ExtractedEntityDTO> extractedEntities;
    private final ThreadDTO updatedThread;

    public SendMessageResponse(MessageDTO message, List<ExtractedEntityDTO> extractedEntities, ThreadDTO updatedThread) {
        this.message = message;
        this.extractedEntities = extractedEntities;
        this.updatedThread = updatedThread;
    }

    public MessageDTO getMessage() {
        return message;
    }

    public List<ExtractedEntityDTO> getExtractedEntities() {
        return extractedEntities;
    }

    public ThreadDTO getUpdatedThread() {
        return updatedThread;
    }
}
