package com.weave.repository;

import com.weave.model.ExtractedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExtractedEntityRepository extends JpaRepository<ExtractedEntity, UUID> {
    List<ExtractedEntity> findByThreadId(UUID threadId);
    List<ExtractedEntity> findByMessageId(UUID messageId);
    
    @Query("SELECT DISTINCT e FROM ExtractedEntity e LEFT JOIN FETCH e.owner LEFT JOIN FETCH e.thread LEFT JOIN FETCH e.message WHERE e.owner.id = :ownerId")
    List<ExtractedEntity> findByOwnerId(@Param("ownerId") UUID ownerId);
    
    @Query("SELECT e FROM ExtractedEntity e WHERE e.thread.id = :threadId AND e.type = :type")
    List<ExtractedEntity> findByThreadIdAndType(@Param("threadId") UUID threadId, @Param("type") ExtractedEntity.EntityType type);
    
    @Query("SELECT e FROM ExtractedEntity e WHERE e.thread.id = :threadId AND e.status = :status")
    List<ExtractedEntity> findByThreadIdAndStatus(@Param("threadId") UUID threadId, @Param("status") ExtractedEntity.EntityStatus status);
    
    @Query("SELECT COUNT(e) FROM ExtractedEntity e WHERE e.thread.id = :threadId AND e.status NOT IN ('RESOLVED', 'DONE')")
    Long countUnresolvedByThreadId(@Param("threadId") UUID threadId);
    
    @Query("SELECT e FROM ExtractedEntity e WHERE e.createdAt >= :from AND e.createdAt <= :to")
    List<ExtractedEntity> findByTimeframe(@Param("from") Instant from, @Param("to") Instant to);
}


