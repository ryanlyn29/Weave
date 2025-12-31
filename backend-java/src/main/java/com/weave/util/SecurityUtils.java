package com.weave.util;

import com.weave.model.User;
import com.weave.security.FirebaseAuthentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SecurityUtils {
    public static Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof FirebaseAuthentication) {
            return Optional.ofNullable(((FirebaseAuthentication) authentication).getUser());
        }
        return Optional.empty();
    }
}

