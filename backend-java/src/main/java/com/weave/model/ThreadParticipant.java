package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "thread_participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"thread_id", "user_id"})
})
public class ThreadParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    public ThreadParticipant() {
    }

    public ThreadParticipant(UUID id, Thread thread, User user, Instant createdAt) {
        this.id = id;
        this.thread = thread;
        this.user = user;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public Thread getThread() {
        return thread;
    }

    public User getUser() {
        return user;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setThread(Thread thread) {
        this.thread = thread;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
