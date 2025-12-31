package com.weave.controller;

import com.weave.model.Group;
import com.weave.model.GroupMember;
import com.weave.model.User;
import com.weave.repository.GroupMemberRepository;
import com.weave.repository.GroupRepository;
import com.weave.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/onboarding")
public class OnboardingController {
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    public OnboardingController(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }
    
    @PostMapping("/complete")
    @Transactional
    public ResponseEntity<Map<String, Object>> completeOnboarding(@RequestBody Map<String, Object> body) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        String groupName = (String) body.get("groupName");
        String relationshipType = (String) body.get("relationshipType");
        String memorySensitivity = (String) body.get("memorySensitivity");
        Boolean voiceEnabled = (Boolean) body.getOrDefault("voiceEnabled", false);
        
        // Create group
        Group group = new Group();
        group.setName(groupName);
        group = groupRepository.save(group);
        
        // Add user as owner
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(currentUser);
        member.setRole(GroupMember.MemberRole.OWNER);
        groupMemberRepository.save(member);
        
        // Update user voice setting
        currentUser.setVoiceEnabled(voiceEnabled);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("groupId", group.getId());
        response.put("userId", currentUser.getId());
        response.put("onboardingComplete", true);
        
        return ResponseEntity.ok(response);
    }
}

