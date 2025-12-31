package com.weave.repository;

import com.weave.model.EntityRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntityRelationshipRepository extends JpaRepository<EntityRelationship, UUID> {
    /**
     * Find all relationships where the given entity is the source
     * Uses LEFT JOIN FETCH to eagerly load target entity
     */
    @Query("SELECT DISTINCT r FROM EntityRelationship r " +
           "LEFT JOIN FETCH r.targetEntity " +
           "WHERE r.sourceEntity.id = :entityId")
    List<EntityRelationship> findBySourceEntityId(@Param("entityId") UUID entityId);

    /**
     * Find all relationships where the given entity is the target
     * Uses LEFT JOIN FETCH to eagerly load source entity
     */
    @Query("SELECT DISTINCT r FROM EntityRelationship r " +
           "LEFT JOIN FETCH r.sourceEntity " +
           "WHERE r.targetEntity.id = :entityId")
    List<EntityRelationship> findByTargetEntityId(@Param("entityId") UUID entityId);

    /**
     * Find all relationships involving the given entity (as source or target)
     */
    @Query("SELECT r FROM EntityRelationship r WHERE r.sourceEntity.id = :entityId OR r.targetEntity.id = :entityId")
    List<EntityRelationship> findByEntityId(@Param("entityId") UUID entityId);

    /**
     * Check if a relationship exists between two entities with a specific type
     */
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM EntityRelationship r " +
           "WHERE r.sourceEntity.id = :sourceId AND r.targetEntity.id = :targetId AND r.linkType = :linkType")
    boolean existsBySourceAndTargetAndType(@Param("sourceId") UUID sourceId, 
                                           @Param("targetId") UUID targetId,
                                           @Param("linkType") EntityRelationship.LinkType linkType);

    /**
     * Find relationship between two entities with specific type
     */
    @Query("SELECT r FROM EntityRelationship r WHERE r.sourceEntity.id = :sourceId AND r.targetEntity.id = :targetId AND r.linkType = :linkType")
    List<EntityRelationship> findBySourceAndTargetAndType(@Param("sourceId") UUID sourceId,
                                                           @Param("targetId") UUID targetId,
                                                           @Param("linkType") EntityRelationship.LinkType linkType);
}
