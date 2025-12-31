package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_firebase_uid", columnList = "firebase_uid")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = true)
    private String email; // Nullable to handle phone auth users

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "voice_enabled", nullable = false)
    private Boolean voiceEnabled = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "firebase_uid", unique = true, nullable = false)
    private String firebaseUid;

    public User() {
    }

    public User(UUID id, String name, String email, String avatar, Boolean voiceEnabled, Instant createdAt, String firebaseUid) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.voiceEnabled = voiceEnabled;
        this.createdAt = createdAt;
        this.firebaseUid = firebaseUid;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatar() {
        return avatar;
    }

    public Boolean getVoiceEnabled() {
        return voiceEnabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setVoiceEnabled(Boolean voiceEnabled) {
        this.voiceEnabled = voiceEnabled;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
