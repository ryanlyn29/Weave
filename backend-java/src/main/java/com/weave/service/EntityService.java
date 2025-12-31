package com.weave.service;

import com.weave.dto.EntityMetadataDTO;
import com.weave.dto.ExtractedEntityDTO;
import com.weave.model.EntityMetadata;
import com.weave.model.ExtractedEntity;
import com.weave.model.Message;
import com.weave.model.Thread;
import com.weave.model.User;
import com.weave.repository.ExtractedEntityRepository;
import com.weave.repository.MessageRepository;
import com.weave.repository.ThreadRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class EntityService {
    private final ExtractedEntityRepository entityRepository;
    private final MessageRepository messageRepository;
    private final ThreadRepository threadRepository;

    public EntityService(ExtractedEntityRepository entityRepository, MessageRepository messageRepository, ThreadRepository threadRepository) {
        this.entityRepository = entityRepository;
        this.messageRepository = messageRepository;
        this.threadRepository = threadRepository;
    }
    
    @Transactional
    public List<ExtractedEntityDTO> extractFromMessage(UUID messageId, String content) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        List<ExtractedEntity> entities = new ArrayList<>();
        
        // Simple ML stub - extract plans, decisions, promises
        // In production, this would call actual ML service
        
        // Extract plans (dates, times, locations)
        Pattern planPattern = Pattern.compile("(?:meet|go|plan|trip|visit|hiking|dinner|lunch|breakfast).*?(?:at|on|this|next|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday)", Pattern.CASE_INSENSITIVE);
        if (planPattern.matcher(content).find()) {
            ExtractedEntity entity = createEntity(
                ExtractedEntity.EntityType.PLAN,
                extractTitle(content, "plan"),
                content,
                message,
                0.75
            );
            entities.add(entityRepository.save(entity));
        }
        
        // Extract decisions
        Pattern decisionPattern = Pattern.compile("(?:decide|decision|choose|use|should|will use|agreed)", Pattern.CASE_INSENSITIVE);
        if (decisionPattern.matcher(content).find()) {
            ExtractedEntity entity = createEntity(
                ExtractedEntity.EntityType.DECISION,
                extractTitle(content, "decision"),
                content,
                message,
                0.85
            );
            entities.add(entityRepository.save(entity));
        }
        
        // Extract promises
        Pattern promisePattern = Pattern.compile("(?:i'll|i will|promise|bring|do|make sure)", Pattern.CASE_INSENSITIVE);
        if (promisePattern.matcher(content).find()) {
            ExtractedEntity entity = createEntity(
                ExtractedEntity.EntityType.PROMISE,
                extractTitle(content, "promise"),
                content,
                message,
                0.70
            );
            entities.add(entityRepository.save(entity));
        }
        
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }
    
    private ExtractedEntity createEntity(ExtractedEntity.EntityType type, String title, String description, Message message, double importance) {
        ExtractedEntity entity = new ExtractedEntity();
        entity.setType(type);
        entity.setTitle(title);
        entity.setDescription(description.length() > 200 ? description.substring(0, 200) : description);
        entity.setStatus(ExtractedEntity.EntityStatus.PROPOSED);
        entity.setOwner(message.getSender());
        entity.setThread(message.getThread());
        entity.setMessage(message);
        entity.setImportanceScore(importance);
        return entity;
    }
    
    private String extractTitle(String content, String type) {
        // Simple title extraction - first 50 chars
        String title = content.length() > 50 ? content.substring(0, 50) + "..." : content;
        return title.trim();
    }
    
    public ExtractedEntityDTO toDTO(ExtractedEntity entity) {
        EntityMetadataDTO metadataDTO = null;
        if (entity.getMetadata() != null) {
            EntityMetadata meta = entity.getMetadata();
            metadataDTO = new EntityMetadataDTO(
                meta.getDate(),
                meta.getTime(),
                meta.getParticipants(),
                meta.getLocation(),
                meta.getPriority() != null ? meta.getPriority().name().toLowerCase() : null,
                meta.getTags()
            );
        }
        
        return new ExtractedEntityDTO(
            entity.getId(),
            entity.getType().name().toLowerCase(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getStatus().name().toLowerCase(),
            entity.getOwner().getId(),
            entity.getThread().getId(),
            entity.getMessage().getId(),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getLastTouchedBy() != null ? entity.getLastTouchedBy().getId() : null,
            metadataDTO,
            entity.getImportanceScore(),
            entity.getVoiceSummaryUrl()
        );
    }
    
    public List<ExtractedEntityDTO> getEntitiesByThread(UUID threadId) {
        return entityRepository.findByThreadId(threadId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public ExtractedEntityDTO updateEntityStatus(UUID entityId, ExtractedEntity.EntityStatus status) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));
        
        entity.setStatus(status);
        entity.setLastTouchedBy(currentUser);
        
        entity = entityRepository.save(entity);
        return toDTO(entity);
    }

    @Transactional
    public ExtractedEntityDTO markAsDecision(UUID entityId) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));
        
        entity.setType(ExtractedEntity.EntityType.DECISION);
        entity.setStatus(ExtractedEntity.EntityStatus.CONFIRMED);
        entity.setLastTouchedBy(currentUser);
        
        entity = entityRepository.save(entity);
        return toDTO(entity);
    }

    @Transactional
    public ExtractedEntityDTO saveEntity(UUID entityId) {
        // Save = confirm the entity (mark as confirmed/resolved)
        return updateEntityStatus(entityId, ExtractedEntity.EntityStatus.CONFIRMED);
    }

    @Transactional
    public ExtractedEntityDTO addToLibrary(UUID entityId) {
        // Add to library = mark as confirmed (available in library)
        return updateEntityStatus(entityId, ExtractedEntity.EntityStatus.CONFIRMED);
    }

    public ExtractedEntityDTO getEntity(UUID entityId) {
        ExtractedEntity entity = entityRepository.findById(entityId)
            .orElseThrow(() -> new RuntimeException("Entity not found: " + entityId));
        return toDTO(entity);
    }
}

