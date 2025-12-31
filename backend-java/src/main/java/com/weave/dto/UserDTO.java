package com.weave.dto;

import java.time.Instant;
import java.util.UUID;

public class UserDTO {
    private final UUID id;
    private final String name;
    private final String email;
    private final String avatar;
    private final Boolean voiceEnabled;
    private final Instant createdAt;

    public UserDTO(UUID id, String name, String email, String avatar, Boolean voiceEnabled, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.voiceEnabled = voiceEnabled;
        this.createdAt = createdAt;
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
}
