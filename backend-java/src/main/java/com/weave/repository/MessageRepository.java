package com.weave.repository;

import com.weave.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByThreadIdOrderByTimestampAsc(UUID threadId);
    
    @Query("SELECT m FROM Message m WHERE m.thread.id = :threadId AND m.content ILIKE %:query% ORDER BY m.timestamp DESC")
    List<Message> searchInThread(@Param("threadId") UUID threadId, @Param("query") String query);
}


