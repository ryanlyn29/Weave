package com.weave.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class GroupDTO {
    private final UUID id;
    private final String name;
    private final List<UUID> members;
    private final Instant createdAt;

    public GroupDTO(UUID id, String name, List<UUID> members, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<UUID> getMembers() {
        return members;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
