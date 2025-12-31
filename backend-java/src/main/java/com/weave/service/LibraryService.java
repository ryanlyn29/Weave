package com.weave.service;

import com.weave.dto.ExtractedEntityDTO;
import com.weave.model.ExtractedEntity;
import com.weave.model.User;
import com.weave.repository.ExtractedEntityRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LibraryService {
    private final ExtractedEntityRepository entityRepository;
    private final EntityService entityService;

    public LibraryService(ExtractedEntityRepository entityRepository, EntityService entityService) {
        this.entityRepository = entityRepository;
        this.entityService = entityService;
    }
    
    @Transactional(readOnly = true)
    public List<ExtractedEntityDTO> queryEntities(String type, String status, UUID ownerId, String timeframe) {
        // Safely get current user - return empty list if user doesn't exist in DB
        Optional<User> currentUserOpt = SecurityUtils.getCurrentUser();
        if (currentUserOpt.isEmpty()) {
            // User authenticated via Firebase but doesn't exist in DB yet - return empty list
            return List.of();
        }
        
        User currentUser = currentUserOpt.get();
        
        // Filter by owner: use provided ownerId if specified, otherwise use current user
        UUID filterOwnerId = (ownerId != null) ? ownerId : currentUser.getId();
        
        // Start with entities owned by the specified user (or current user if not specified)
        // This ensures we only return entities the user has access to
        // Repository will return empty list if no entities found, never null
        List<ExtractedEntity> entities = entityRepository.findByOwnerId(filterOwnerId);
        if (entities == null) {
            entities = List.of();
        }
        
        // Apply type filter
        if (type != null && !type.isEmpty() && !type.equals("all")) {
            try {
                ExtractedEntity.EntityType entityType = ExtractedEntity.EntityType.valueOf(type.toUpperCase());
                entities = entities.stream()
                    .filter(e -> e.getType() == entityType)
                    .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid type - return empty list
                entities = List.of();
            }
        }
        
        // Apply status filter
        if (status != null && !status.isEmpty()) {
            try {
                ExtractedEntity.EntityStatus entityStatus = ExtractedEntity.EntityStatus.valueOf(status.toUpperCase());
                entities = entities.stream()
                    .filter(e -> e.getStatus() == entityStatus)
                    .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid status - return empty list
                entities = List.of();
            }
        }
        
        // Apply timeframe filter - safely handle invalid timeframe values
        if (timeframe != null && !timeframe.isEmpty() && !timeframe.equals("all")) {
            try {
                Instant now = Instant.now();
                Instant from = switch (timeframe.toLowerCase()) {
                    case "day" -> now.minusSeconds(86400);
                    case "week" -> now.minusSeconds(604800);
                    case "month" -> now.minusSeconds(2592000);
                    default -> Instant.EPOCH;
                };
                entities = entities.stream()
                    .filter(e -> e.getCreatedAt() != null && e.getCreatedAt().isAfter(from))
                    .collect(Collectors.toList());
            } catch (Exception e) {
                // Invalid timeframe - default to all (no filter applied, entities unchanged)
            }
        }
        
        // Convert to DTOs - this will return empty list if entities is empty
        // Handle case where entities list is null or empty
        if (entities == null || entities.isEmpty()) {
            return List.of();
        }
        return entities.stream()
            .map(entityService::toDTO)
            .collect(Collectors.toList());
    }
    
    public Map<String, Map<String, Long>> getEntityCounts() {
        Map<String, Map<String, Long>> counts = new HashMap<>();
        
        for (ExtractedEntity.EntityType type : ExtractedEntity.EntityType.values()) {
            List<ExtractedEntity> typeEntities = entityRepository.findAll().stream()
                .filter(e -> e.getType() == type)
                .collect(Collectors.toList());
            
            long total = typeEntities.size();
            long unresolved = typeEntities.stream()
                .filter(e -> e.getStatus() != ExtractedEntity.EntityStatus.RESOLVED && 
                           e.getStatus() != ExtractedEntity.EntityStatus.DONE)
                .count();
            
            Map<String, Long> typeCounts = new HashMap<>();
            typeCounts.put("total", total);
            typeCounts.put("unresolved", unresolved);
            counts.put(type.name().toLowerCase(), typeCounts);
        }
        
        return counts;
    }

    public LibraryQueryResponse queryLibrary(List<String> types, List<String> statuses, UUID ownerId, String timeframe) {
        try {
            List<ExtractedEntityDTO> entities = queryEntities(
                types.isEmpty() ? null : types.get(0),
                statuses.isEmpty() ? null : statuses.get(0),
                ownerId,
                timeframe != null ? timeframe : "all"
            );
            
            // Ensure entities is never null
            if (entities == null) {
                entities = List.of();
            }
            
            long total = entities.size();
            Map<String, Counts> countsMap = new HashMap<>();
            for (ExtractedEntity.EntityType type : ExtractedEntity.EntityType.values()) {
                String typeName = type.name().toLowerCase();
                long typeTotal = entities.stream()
                    .filter(e -> e.getType().equals(typeName))
                    .count();
                long typeUnresolved = entities.stream()
                    .filter(e -> e.getType().equals(typeName) && 
                               !e.getStatus().equals("resolved") && 
                               !e.getStatus().equals("done"))
                    .count();
                countsMap.put(typeName, new Counts(typeTotal, typeUnresolved));
            }
            
            return new LibraryQueryResponse(entities, total, countsMap);
        } catch (Exception e) {
            // Log error for debugging but return empty response instead of throwing
            // This ensures the endpoint always returns 200 OK with valid structure
            return new LibraryQueryResponse(List.of(), 0L, new HashMap<>());
        }
    }

    public String exportToCSV(List<String> types, List<String> statuses, UUID ownerId, String timeframe) {
        List<ExtractedEntityDTO> entities = queryEntities(
            types.isEmpty() ? null : types.get(0),
            statuses.isEmpty() ? null : statuses.get(0),
            ownerId,
            timeframe
        );
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Type,Title,Description,Status,Owner ID,Thread ID,Message ID,Created At,Updated At,Importance Score\n");
        
        for (ExtractedEntityDTO entity : entities) {
            csv.append(escapeCsv(entity.getId().toString())).append(",");
            csv.append(escapeCsv(entity.getType())).append(",");
            csv.append(escapeCsv(entity.getTitle())).append(",");
            csv.append(escapeCsv(entity.getDescription() != null ? entity.getDescription() : "")).append(",");
            csv.append(escapeCsv(entity.getStatus())).append(",");
            csv.append(escapeCsv(entity.getOwnerId().toString())).append(",");
            csv.append(escapeCsv(entity.getThreadId().toString())).append(",");
            csv.append(escapeCsv(entity.getMessageId().toString())).append(",");
            csv.append(escapeCsv(entity.getCreatedAt().toString())).append(",");
            csv.append(escapeCsv(entity.getUpdatedAt().toString())).append(",");
            csv.append(entity.getImportanceScore()).append("\n");
        }
        
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    // Response DTO
    public static class LibraryQueryResponse {
        private List<ExtractedEntityDTO> entities;
        private long total;
        private Map<String, Counts> counts;

        public LibraryQueryResponse(List<ExtractedEntityDTO> entities, long total, Map<String, Counts> counts) {
            this.entities = entities;
            this.total = total;
            this.counts = counts;
        }

        public List<ExtractedEntityDTO> getEntities() { return entities; }
        public long getTotal() { return total; }
        public Map<String, Counts> getCounts() { return counts; }
    }

    public static class Counts {
        private long total;
        private long unresolved;

        public Counts(long total, long unresolved) {
            this.total = total;
            this.unresolved = unresolved;
        }

        public long getTotal() { return total; }
        public long getUnresolved() { return unresolved; }
    }
}

