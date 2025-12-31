package com.weave.service;

import com.weave.dto.ExtractedEntityDTO;
import com.weave.dto.FileAttachmentDTO;
import com.weave.dto.MessageDTO;
import com.weave.dto.SendMessageRequest;
import com.weave.dto.SendMessageResponse;
import com.weave.model.FileAttachment;
import com.weave.model.Message;
import com.weave.model.Thread;
import com.weave.model.User;
import com.weave.repository.MessageRepository;
import com.weave.repository.ThreadRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ThreadRepository threadRepository;
    private final ThreadService threadService;
    private final EntityService entityService;
    private final RealtimeNotificationService notificationService;

    public MessageService(MessageRepository messageRepository, ThreadRepository threadRepository, ThreadService threadService, EntityService entityService, RealtimeNotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.threadRepository = threadRepository;
        this.threadService = threadService;
        this.entityService = entityService;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public SendMessageResponse sendMessage(SendMessageRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        Thread thread = threadRepository.findById(request.getThreadId())
            .orElseThrow(() -> new RuntimeException("Thread not found: " + request.getThreadId()));
        
        Message message = new Message();
        message.setThread(thread);
        message.setSender(currentUser);
        message.setType(Message.MessageType.valueOf(request.getType().toUpperCase()));
        message.setContent(request.getContent() != null ? request.getContent() : "");
        message.setAudioUrl(request.getAudioUrl());
        
        // Convert file attachments
        if (request.getFileAttachments() != null && !request.getFileAttachments().isEmpty()) {
            List<FileAttachment> attachments = request.getFileAttachments().stream()
                .map(dto -> new FileAttachment(dto.getUrl(), dto.getFilename(), dto.getSize(), dto.getType()))
                .collect(Collectors.toList());
            message.setFileAttachments(attachments);
        }
        
        message.setTimestamp(Instant.now());
        
        message = messageRepository.save(message);
        
        thread.setLastActivity(Instant.now());
        threadRepository.save(thread);
        threadService.updateThreadActivity(thread.getId());
        
        List<ExtractedEntityDTO> extractedEntities = new ArrayList<>();
        if (request.getContent() != null && !request.getContent().isEmpty()) {
            extractedEntities = entityService.extractFromMessage(message.getId(), request.getContent());
        }
        
        MessageDTO messageDTO = toDTO(message);
        var updatedThreadDTO = threadService.toDTO(thread);
        
        try {
            Map<String, Object> messageEvent = Map.of(
                "message", messageDTO,
                "threadId", thread.getId().toString()
            );
            notificationService.sendEventToThreadParticipants(thread.getId(), "message_created", messageEvent);
            
            if (!extractedEntities.isEmpty()) {
                Map<String, Object> entityEvent = Map.of(
                    "entities", extractedEntities,
                    "messageId", message.getId().toString(),
                    "threadId", thread.getId().toString()
                );
                notificationService.sendEventToThreadParticipants(thread.getId(), "entity_extracted", entityEvent);
            }
            
            Map<String, Object> threadEvent = Map.of(
                "thread", updatedThreadDTO,
                "threadId", thread.getId().toString()
            );
            notificationService.sendEventToThreadParticipants(thread.getId(), "thread_updated", threadEvent);
        } catch (Exception e) {
            System.err.println("Failed to send SSE event: " + e.getMessage());
        }
        
        return new SendMessageResponse(
            messageDTO,
            extractedEntities,
            updatedThreadDTO
        );
    }
    
    public List<MessageDTO> getMessagesByThread(UUID threadId) {
        return messageRepository.findByThreadIdOrderByTimestampAsc(threadId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public MessageDTO toDTO(Message message) {
        List<FileAttachmentDTO> fileAttachmentDTOs = null;
        if (message.getFileAttachments() != null) {
            fileAttachmentDTOs = message.getFileAttachments().stream()
                .map(att -> new FileAttachmentDTO(att.getUrl(), att.getFilename(), att.getSize(), att.getType()))
                .collect(Collectors.toList());
        }
        
        return new MessageDTO(
            message.getId(),
            message.getThread().getId(),
            message.getSender().getId(),
            message.getType().name().toLowerCase(),
            message.getContent(),
            message.getAudioUrl(),
            message.getWaveform(),
            fileAttachmentDTOs,
            message.getTimestamp(),
            message.getEntities().stream()
                .map(e -> e.getId())
                .collect(Collectors.toList())
        );
    }
}

