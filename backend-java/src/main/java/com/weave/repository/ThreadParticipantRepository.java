package com.weave.repository;

import com.weave.model.ThreadParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ThreadParticipantRepository extends JpaRepository<ThreadParticipant, UUID> {
    List<ThreadParticipant> findByThreadId(UUID threadId);
    List<ThreadParticipant> findByUserId(UUID userId);
    boolean existsByThreadIdAndUserId(UUID threadId, UUID userId);
}


