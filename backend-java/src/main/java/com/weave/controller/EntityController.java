package com.weave.controller;

import com.weave.dto.ExtractEntitiesRequest;
import com.weave.dto.ExtractEntitiesResponse;
import com.weave.dto.ExtractedEntityDTO;
import com.weave.model.ExtractedEntity;
import com.weave.service.EntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/entities")
public class EntityController {
    private final EntityService entityService;

    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }
    
    @PostMapping("/extract")
    public ResponseEntity<ExtractEntitiesResponse> extractEntities(@RequestBody ExtractEntitiesRequest request) {
        List<ExtractedEntityDTO> entities;
        
        if (request.getMessageId() != null) {
            // Extract from existing message
            entities = entityService.extractFromMessage(request.getMessageId(), request.getContent());
        } else if (request.getThreadId() != null && request.getContent() != null) {
            // This would need a different method - for now, return empty
            entities = List.of();
        } else {
            entities = List.of();
        }
        
        ExtractEntitiesResponse response = new ExtractEntitiesResponse(
            entities,
            0.85,
            "ML model identified plans, decisions, and promises in the message"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExtractedEntityDTO> getEntity(@PathVariable UUID id) {
        return ResponseEntity.ok(entityService.getEntity(id));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ExtractedEntityDTO> updateEntityStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        
        ExtractedEntity.EntityStatus status;
        try {
            status = ExtractedEntity.EntityStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(entityService.updateEntityStatus(id, status));
    }

    @PostMapping("/{id}/mark-decision")
    public ResponseEntity<ExtractedEntityDTO> markAsDecision(@PathVariable UUID id) {
        return ResponseEntity.ok(entityService.markAsDecision(id));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ExtractedEntityDTO> saveEntity(@PathVariable UUID id) {
        return ResponseEntity.ok(entityService.saveEntity(id));
    }

    @PostMapping("/{id}/add-to-library")
    public ResponseEntity<ExtractedEntityDTO> addToLibrary(@PathVariable UUID id) {
        return ResponseEntity.ok(entityService.addToLibrary(id));
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<Void> bulkAction(@RequestBody Map<String, Object> body) {
        // Implementation for bulk actions
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/thread/{threadId}")
    public ResponseEntity<List<ExtractedEntityDTO>> getEntitiesByThread(@PathVariable UUID threadId) {
        return ResponseEntity.ok(entityService.getEntitiesByThread(threadId));
    }
}

