package com.weave.service;

import com.weave.model.User;
import com.weave.repository.UserRepository;
import com.weave.util.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Get the current authenticated user.
     * This should never return null if called from an authenticated endpoint,
     * as FirebaseTokenFilter should have already created the user.
     */
    public User getCurrentUser() {
        return SecurityUtils.getCurrentUser()
            .orElseThrow(() -> {
                log.error("getCurrentUser() called but no user in security context");
                return new RuntimeException("User not authenticated");
            });
    }
    
    /**
     * Get or create a user by Firebase UID.
     * This is the main method for user auto-provisioning.
     * 
     * @param firebaseUid The Firebase user UID (required)
     * @param email The user's email (nullable for phone auth users)
     * @param name The user's display name (nullable)
     * @param avatar The user's avatar URL (nullable)
     * @return The existing or newly created User
     */
    @Transactional
    public User getOrCreateUser(String firebaseUid, String email, String name, String avatar) {
        if (firebaseUid == null || firebaseUid.isEmpty()) {
            throw new IllegalArgumentException("firebaseUid cannot be null or empty");
        }
        
        // Try to find existing user
        Optional<User> existingUser = userRepository.findByFirebaseUid(firebaseUid);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            log.debug("Found existing user for firebaseUid={}, userId={}", firebaseUid, user.getId());
            
            // Update user fields if they've changed (e.g., name, email, avatar)
            boolean updated = false;
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
                updated = true;
            }
            if (name != null && !name.equals(user.getName())) {
                user.setName(name);
                updated = true;
            }
            if (avatar != null && !avatar.equals(user.getAvatar())) {
                user.setAvatar(avatar);
                updated = true;
            }
            if (updated) {
                log.debug("Updating user fields for firebaseUid={}", firebaseUid);
                return userRepository.save(user);
            }
            return user;
        }
        
        // Auto-provision new user
        log.info("Creating new user for firebaseUid={}", firebaseUid);
        User newUser = new User();
        newUser.setFirebaseUid(firebaseUid);
        
        // Set email - use fallback if not provided (phone auth users)
        if (email == null || email.isEmpty()) {
            email = firebaseUid + "@firebase.local";
            log.debug("Firebase token missing email for firebaseUid={}, using fallback email", firebaseUid);
        }
        newUser.setEmail(email);
        
        // Set name - use email prefix or UID as fallback
        if (name == null || name.isEmpty()) {
            name = email.contains("@") ? email.substring(0, email.indexOf("@")) : firebaseUid;
        }
        newUser.setName(name);
        
        // Set avatar if provided
        if (avatar != null && !avatar.isEmpty()) {
            newUser.setAvatar(avatar);
        }
        
        newUser.setVoiceEnabled(false);
        
        User savedUser = userRepository.save(newUser);
        log.info("Successfully created user for firebaseUid={}, userId={}, email={}", 
            firebaseUid, savedUser.getId(), email);
        return savedUser;
    }
    
    public User getUserById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}

