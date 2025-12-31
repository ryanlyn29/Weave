package com.weave.service;

import com.weave.dto.GroupDTO;
import com.weave.model.Group;
import com.weave.model.GroupMember;
import com.weave.model.User;
import com.weave.repository.GroupRepository;
import com.weave.repository.GroupMemberRepository;
import com.weave.repository.UserRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GroupDTO createGroup(String name) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Group group = new Group();
        group.setName(name);
        group = groupRepository.save(group);

        // Add creator as owner
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(currentUser);
        member.setRole(GroupMember.MemberRole.OWNER);
        groupMemberRepository.save(member);

        return toDTO(group);
    }

    public List<GroupDTO> getUserGroups() {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        return groupMemberRepository.findByUserId(currentUser.getId())
            .stream()
            .map(GroupMember::getGroup)
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public GroupDTO getGroup(UUID id) {
        Group group = groupRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Group not found: " + id));

        // Verify user is a member
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        boolean isMember = groupMemberRepository.findByGroupIdAndUserId(id, currentUser.getId())
            .isPresent();

        if (!isMember) {
            throw new RuntimeException("Access denied: Not a member of this group");
        }

        return toDTO(group);
    }

    @Transactional
    public GroupDTO updateGroup(UUID id, String name) {
        Group group = groupRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Group not found: " + id));

        // Verify user is owner
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(id, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Access denied: Not a member of this group"));

        if (member.getRole() != GroupMember.MemberRole.OWNER) {
            throw new RuntimeException("Access denied: Only owners can rename groups");
        }

        group.setName(name);
        group = groupRepository.save(group);

        return toDTO(group);
    }

    @Transactional
    public void addMember(UUID groupId, UUID userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));

        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        // Verify current user is a member (can invite others)
        groupMemberRepository.findByGroupIdAndUserId(groupId, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Access denied: Not a member of this group"));

        User userToAdd = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Check if already a member
        if (groupMemberRepository.findByGroupIdAndUserId(groupId, userId).isPresent()) {
            return; // Already a member
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(userToAdd);
        member.setRole(GroupMember.MemberRole.MEMBER);
        groupMemberRepository.save(member);
    }

    @Transactional
    public void removeMember(UUID groupId, UUID userId) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        // Verify current user is owner or removing themselves
        GroupMember currentMember = groupMemberRepository.findByGroupIdAndUserId(groupId, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Access denied: Not a member of this group"));

        GroupMember memberToRemove = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
            .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!currentUser.getId().equals(userId) && currentMember.getRole() != GroupMember.MemberRole.OWNER) {
            throw new RuntimeException("Access denied: Only owners can remove members");
        }

        groupMemberRepository.delete(memberToRemove);
    }

    @Transactional
    public void leaveGroup(UUID groupId) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, currentUser.getId())
            .orElseThrow(() -> new RuntimeException("Not a member of this group"));

        // Cannot leave if you're the only owner
        if (member.getRole() == GroupMember.MemberRole.OWNER) {
            long ownerCount = groupMemberRepository.findByGroupId(groupId)
                .stream()
                .filter(m -> m.getRole() == GroupMember.MemberRole.OWNER)
                .count();

            if (ownerCount == 1) {
                throw new RuntimeException("Cannot leave: You are the only owner. Transfer ownership or delete the group.");
            }
        }

        groupMemberRepository.delete(member);
    }

    private GroupDTO toDTO(Group group) {
        List<GroupMember> members = groupMemberRepository.findByGroupId(group.getId());
        List<UUID> memberIds = members.stream()
            .map(m -> m.getUser().getId())
            .collect(Collectors.toList());

        return new GroupDTO(
            group.getId(),
            group.getName(),
            memberIds,
            group.getCreatedAt()
        );
    }
}
