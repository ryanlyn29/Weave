package com.weave.security;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@DependsOn("firebaseConfig")
public class FirebaseTokenVerifier {
    
    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenVerifier.class);
    private FirebaseAuth firebaseAuth;
    
    /**
     * Initialize FirebaseAuth after Firebase Admin SDK is initialized.
     * This ensures we use the DEFAULT app that was initialized at startup.
     */
    @PostConstruct
    public void initialize() {
        try {
            // Wait for Firebase Admin to be initialized
            // FirebaseConfig.initializeFirebaseAdmin() runs first due to @PostConstruct order
            FirebaseApp app = FirebaseApp.getInstance();
            this.firebaseAuth = FirebaseAuth.getInstance(app);
            log.info("[FirebaseTokenVerifier] Initialized with app: {}", app.getName());
        } catch (IllegalStateException e) {
            log.error("[FirebaseTokenVerifier] CRITICAL: Firebase Admin not initialized. Cannot verify tokens.");
            log.error("[FirebaseTokenVerifier] Error: {}", e.getMessage());
            throw new RuntimeException("Firebase Admin SDK not initialized. Cannot create FirebaseAuth instance.", e);
        }
    }
    
    /**
     * Verify a Firebase ID token.
     * Uses the FirebaseAuth instance initialized at startup.
     */
    public FirebaseToken verify(String idToken) throws FirebaseAuthException {
        if (firebaseAuth == null) {
            log.error("[FirebaseTokenVerifier] FirebaseAuth not initialized");
            throw new IllegalStateException("FirebaseAuth not initialized. Firebase Admin SDK may not have started.");
        }
        
        try {
            // Verify using the pre-initialized FirebaseAuth instance
            FirebaseToken token = firebaseAuth.verifyIdToken(idToken);
            log.debug("[FirebaseTokenVerifier] Token verified for UID: {}", token.getUid());
            return token;
        } catch (FirebaseAuthException e) {
            log.error("[FirebaseTokenVerifier] Token verification failed: {}", e.getMessage());
            throw e;
        } catch (IllegalStateException e) {
            log.error("[FirebaseTokenVerifier] FirebaseApp not found. Available apps: {}", 
                FirebaseApp.getApps().stream().map(FirebaseApp::getName).toList());
            throw new IllegalStateException("Firebase DEFAULT app not available for token verification", e);
        }
    }
}
