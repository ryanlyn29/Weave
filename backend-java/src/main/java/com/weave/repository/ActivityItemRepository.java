package com.weave.repository;

import com.weave.model.ActivityItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityItemRepository extends JpaRepository<ActivityItem, UUID> {
    @Query("SELECT a FROM ActivityItem a WHERE a.thread.group.id IN (SELECT gm.group.id FROM GroupMember gm WHERE gm.user.id = :userId) ORDER BY a.timestamp DESC")
    List<ActivityItem> findByUserGroups(@Param("userId") UUID userId);
    
    @Query("SELECT a FROM ActivityItem a WHERE a.type = :type AND a.thread.group.id IN (SELECT gm.group.id FROM GroupMember gm WHERE gm.user.id = :userId) ORDER BY a.timestamp DESC")
    List<ActivityItem> findByTypeAndUserGroups(@Param("type") ActivityItem.ActivityType type, @Param("userId") UUID userId);
}


