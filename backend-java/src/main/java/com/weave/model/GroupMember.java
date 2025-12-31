package com.weave.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "group_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"group_id", "user_id"})
})
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role = MemberRole.MEMBER;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    public GroupMember() {
    }

    public GroupMember(UUID id, Group group, User user, MemberRole role, Instant createdAt) {
        this.id = id;
        this.group = group;
        this.user = user;
        this.role = role;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public Group getGroup() {
        return group;
    }

    public User getUser() {
        return user;
    }

    public MemberRole getRole() {
        return role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setRole(MemberRole role) {
        this.role = role;
    }

    public enum MemberRole {
        OWNER, MEMBER
    }
}
