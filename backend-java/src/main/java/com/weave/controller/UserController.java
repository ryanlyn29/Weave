package com.weave.controller;

import com.weave.dto.UserDTO;
import com.weave.model.User;
import com.weave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            User user = userService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(500).build();
            }
            UserDTO dto = toDTO(user);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            // This should never happen if FirebaseTokenFilter worked correctly
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        UserDTO dto = toDTO(user);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest request) {
        User user = userService.getUserById(id);
        
        // Verify ownership
        User currentUser = userService.getCurrentUser();
        if (!user.getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getVoiceEnabled() != null) {
            user.setVoiceEnabled(request.getVoiceEnabled());
        }

        User updated = userService.updateUser(user);
        return ResponseEntity.ok(toDTO(updated));
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatar(),
            user.getVoiceEnabled(),
            user.getCreatedAt()
        );
    }

    // Request DTO for updates
    public static class UpdateUserRequest {
        private String name;
        private String avatar;
        private Boolean voiceEnabled;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public Boolean getVoiceEnabled() { return voiceEnabled; }
        public void setVoiceEnabled(Boolean voiceEnabled) { this.voiceEnabled = voiceEnabled; }
    }
}
