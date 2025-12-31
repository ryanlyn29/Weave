package com.weave.controller;

import com.weave.dto.GroupDTO;
import com.weave.model.Group;
import com.weave.model.User;
import com.weave.repository.GroupRepository;
import com.weave.repository.GroupMemberRepository;
import com.weave.service.GroupService;
import com.weave.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/groups")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getGroups() {
        List<GroupDTO> groups = groupService.getUserGroups();
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@RequestBody CreateGroupRequest request) {
        GroupDTO group = groupService.createGroup(request.getName());
        return ResponseEntity.ok(group);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroup(@PathVariable UUID id) {
        GroupDTO group = groupService.getGroup(id);
        return ResponseEntity.ok(group);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupDTO> updateGroup(@PathVariable UUID id, @RequestBody UpdateGroupRequest request) {
        GroupDTO group = groupService.updateGroup(id, request.getName());
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Void> addMember(@PathVariable UUID id, @RequestBody AddMemberRequest request) {
        groupService.addMember(id, request.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable UUID id, @PathVariable UUID userId) {
        groupService.removeMember(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveGroup(@PathVariable UUID id) {
        groupService.leaveGroup(id);
        return ResponseEntity.ok().build();
    }

    // Request DTOs
    public static class CreateGroupRequest {
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class UpdateGroupRequest {
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class AddMemberRequest {
        private UUID userId;

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
    }
}
