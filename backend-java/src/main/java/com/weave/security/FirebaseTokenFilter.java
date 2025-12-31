package com.weave.security;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.weave.model.User;
import com.weave.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenFilter.class);
    
    private final FirebaseTokenVerifier tokenVerifier;
    private final UserService userService;

    public FirebaseTokenFilter(FirebaseTokenVerifier tokenVerifier, UserService userService) {
        this.tokenVerifier = tokenVerifier;
        this.userService = userService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                // Verify token using pre-initialized FirebaseAuth
                FirebaseToken firebaseToken = tokenVerifier.verify(token);
                
                // Extract user information from Firebase token
                String firebaseUid = firebaseToken.getUid();
                String email = firebaseToken.getEmail();
                String name = firebaseToken.getName();
                String photoUrl = firebaseToken.getPicture();
                
                // Get or create user using service layer
                User user = userService.getOrCreateUser(firebaseUid, email, name, photoUrl);
                
                // Set user context for downstream use
                SecurityContextHolder.getContext().setAuthentication(
                    new FirebaseAuthentication(user)
                );
                log.debug("Authentication set for userId={}, firebaseUid={}", user.getId(), user.getFirebaseUid());
            } catch (FirebaseAuthException e) {
                log.warn("Invalid Firebase token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Invalid authentication token\"}");
                return;
            } catch (IllegalArgumentException e) {
                log.error("Invalid argument processing Firebase token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"Invalid request: " + e.getMessage() + "\"}");
                return;
            } catch (RuntimeException e) {
                log.error("Error processing Firebase token: {}", e.getMessage(), e);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\":\"Internal server error\"}");
                return;
            }
        }
        
        chain.doFilter(request, response);
    }
}


