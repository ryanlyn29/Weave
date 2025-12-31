package com.weave.controller;

import com.weave.service.RealtimeNotificationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

/**
 * Controller for Server-Sent Events (SSE) real-time updates.
 * Clients connect to /v1/stream to receive real-time events.
 */
@RestController
@RequestMapping("/v1/stream")
public class SSEController {
    private final RealtimeNotificationService notificationService;
    
    public SSEController(RealtimeNotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * Establishes an SSE connection for the authenticated user.
     * The client should connect to this endpoint and listen for events.
     * 
     * Events:
     * - "connected": Sent immediately upon connection
     * - "message_created": Sent when a new message is created in a thread
     * - "entity_extracted": Sent when an entity is extracted from a message
     * - "thread_updated": Sent when a thread is updated (e.g., read status, title)
     * 
     * @return SseEmitter for the SSE connection
     */
    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> stream() {
        SseEmitter emitter = notificationService.createConnection();
        
        // Set CORS headers if needed (should be handled by SecurityConfig, but ensure SSE works)
        return ResponseEntity.ok()
            .header("Cache-Control", "no-cache")
            .header("X-Accel-Buffering", "no")
            .body(emitter);
    }
    
    /**
     * Health check endpoint for SSE service.
     * @return Status information about active connections
     */
    @GetMapping("/status")
    public ResponseEntity<?> status() {
        int activeConnections = notificationService.getActiveConnectionCount();
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "activeConnections", activeConnections
        ));
    }
}
