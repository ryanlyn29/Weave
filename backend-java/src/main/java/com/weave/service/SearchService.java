package com.weave.service;

import com.weave.dto.SearchResultDTO;
import com.weave.model.ExtractedEntity;
import com.weave.model.Message;
import com.weave.repository.ExtractedEntityRepository;
import com.weave.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {
    private final ExtractedEntityRepository entityRepository;
    private final MessageRepository messageRepository;

    public SearchService(ExtractedEntityRepository entityRepository, MessageRepository messageRepository) {
        this.entityRepository = entityRepository;
        this.messageRepository = messageRepository;
    }
    
    public List<SearchResultDTO> search(String query) {
        String lowerQuery = query.toLowerCase();
        List<SearchResultDTO> results = new ArrayList<>();
        
        // Search entities
        List<ExtractedEntity> entities = entityRepository.findAll();
        for (ExtractedEntity entity : entities) {
            if (entity.getTitle().toLowerCase().contains(lowerQuery) ||
                (entity.getDescription() != null && entity.getDescription().toLowerCase().contains(lowerQuery))) {
                results.add(new SearchResultDTO(
                    entity.getId(),
                    "entity",
                    entity.getTitle(),
                    entity.getDescription() != null ? entity.getDescription() : entity.getTitle(),
                    0.85,
                    "Entity matches query: \"" + query + "\"",
                    entity.getThread().getId(),
                    null,
                    entity.getId(),
                    entity.getCreatedAt()
                ));
            }
        }
        
        // Search messages
        List<Message> messages = messageRepository.findAll();
        for (Message message : messages) {
            if (message.getContent().toLowerCase().contains(lowerQuery)) {
                results.add(new SearchResultDTO(
                    message.getId(),
                    "message",
                    "Message",
                    message.getContent(),
                    0.75,
                    "Message content contains: \"" + query + "\"",
                    message.getThread().getId(),
                    message.getId(),
                    null,
                    message.getTimestamp()
                ));
            }
        }
        
        // Sort by confidence
        results.sort((a, b) -> Double.compare(b.getConfidence(), a.getConfidence()));
        
        return results;
    }
}


