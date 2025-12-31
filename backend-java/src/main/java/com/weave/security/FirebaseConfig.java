package com.weave.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    
    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);
    private static boolean initialized = false;
    
    private static final String CREDENTIALS_RESOURCE_PATH = "firebase-service-account.json";
    
    /**
     * Initialize Firebase Admin SDK ONCE at application startup.
     * This MUST run before any filters or controllers try to use FirebaseAuth.
     */
    @PostConstruct
    public void initializeFirebaseAdmin() {
        if (initialized) {
            log.debug("[FirebaseAdmin] Already initialized, skipping");
            return;
        }
        
        synchronized (FirebaseConfig.class) {
            if (initialized) {
                return;
            }
            
            try {
                // Check if already initialized
                if (!FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp defaultApp = FirebaseApp.getInstance();
                    log.info("[FirebaseAdmin] Firebase Admin already initialized with app: {}", defaultApp.getName());
                    initialized = true;
                    return;
                }
                
                log.info("[FirebaseAdmin] Initializing Firebase Admin SDK...");
                log.info("[FirebaseAdmin] Loading credentials from classpath: {}", CREDENTIALS_RESOURCE_PATH);
                
                // Load service account credentials from classpath
                ClassPathResource resource = new ClassPathResource(CREDENTIALS_RESOURCE_PATH);
                if (!resource.exists()) {
                    log.error("[FirebaseAdmin] CRITICAL: Firebase service account file not found at classpath:{}", CREDENTIALS_RESOURCE_PATH);
                    log.error("[FirebaseAdmin] Expected location: src/main/resources/{}", CREDENTIALS_RESOURCE_PATH);
                    throw new RuntimeException("Firebase Admin SDK initialization failed: Service account file not found at classpath:" + CREDENTIALS_RESOURCE_PATH);
                }
                
                try (InputStream serviceAccount = resource.getInputStream()) {
                    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
                    
                    // Build Firebase options
                    FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();
                    
                    // Initialize the DEFAULT app
                    FirebaseApp defaultApp = FirebaseApp.initializeApp(options);
                    
                    log.info("[FirebaseAdmin] Firebase Admin initialized successfully");
                    log.info("[FirebaseAdmin] App name: {}", defaultApp.getName());
                    log.info("[FirebaseAdmin] Project ID: {}", defaultApp.getOptions().getProjectId());
                    
                    // Verify initialization
                    int appCount = FirebaseApp.getApps().size();
                    log.info("[FirebaseAdmin] Total Firebase apps: {}", appCount);
                    FirebaseApp.getApps().forEach(app -> 
                        log.info("[FirebaseAdmin] - App: {}", app.getName())
                    );
                    
                    initialized = true;
                }
                
            } catch (IOException e) {
                log.error("[FirebaseAdmin] CRITICAL: Failed to initialize Firebase Admin SDK", e);
                log.error("[FirebaseAdmin] Error loading credentials from classpath:{}", CREDENTIALS_RESOURCE_PATH);
                log.error("[FirebaseAdmin] Error: {}", e.getMessage());
                throw new RuntimeException("Firebase Admin SDK initialization failed. Cannot verify tokens.", e);
            } catch (IllegalStateException e) {
                // App already exists - this is fine
                FirebaseApp defaultApp = FirebaseApp.getInstance();
                log.info("[FirebaseAdmin] Firebase Admin already initialized (app: {})", defaultApp.getName());
                initialized = true;
            } catch (Exception e) {
                log.error("[FirebaseAdmin] CRITICAL: Unexpected error initializing Firebase Admin SDK", e);
                throw new RuntimeException("Firebase Admin SDK initialization failed", e);
            }
        }
    }
    
    /**
     * Get the initialized Firebase App instance.
     * This should only be called after initialization.
     */
    public static FirebaseApp getFirebaseApp() {
        if (!initialized) {
            throw new IllegalStateException("Firebase Admin SDK not initialized. Call initializeFirebaseAdmin() first.");
        }
        
        try {
            return FirebaseApp.getInstance();
        } catch (IllegalStateException e) {
            log.error("[FirebaseAdmin] DEFAULT app not found. Available apps: {}", 
                FirebaseApp.getApps().stream().map(FirebaseApp::getName).toList());
            throw new IllegalStateException("Firebase DEFAULT app not initialized", e);
        }
    }
    
    /**
     * Check if Firebase Admin is initialized.
     */
    public static boolean isInitialized() {
        return initialized && !FirebaseApp.getApps().isEmpty();
    }
}
