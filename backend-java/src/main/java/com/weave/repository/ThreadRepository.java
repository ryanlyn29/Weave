package com.weave.repository;

import com.weave.model.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, UUID> {
    List<Thread> findByGroupIdOrderByLastActivityDesc(UUID groupId);
    
    @Query("SELECT t FROM Thread t JOIN ThreadParticipant tp ON t.id = tp.thread.id WHERE tp.user.id = :userId ORDER BY t.lastActivity DESC")
    List<Thread> findByParticipantUserId(@Param("userId") UUID userId);
}


