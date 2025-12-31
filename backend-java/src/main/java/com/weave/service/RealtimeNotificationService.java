package com.weave.service;

import com.weave.model.ThreadParticipant;
import com.weave.model.User;
import com.weave.repository.ThreadParticipantRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service for managing Server-Sent Events (SSE) connections for real-time updates.
 * Maintains active SSE connections per user and broadcasts events to connected clients.
 */
@Service
public class RealtimeNotificationService {
    // Map of userId -> SseEmitter for active connections
    private final Map<UUID, SseEmitter> activeConnections = new ConcurrentHashMap<>();
    
    private final ThreadParticipantRepository threadParticipantRepository;
    
    // Default timeout: 30 minutes (matches typical session timeout)
    private static final long DEFAULT_TIMEOUT = 30 * 60 * 1000L;
    
    public RealtimeNotificationService(ThreadParticipantRepository threadParticipantRepository) {
        this.threadParticipantRepository = threadParticipantRepository;
    }
    
    /**
     * Creates a new SSE connection for the current user.
     * @return SseEmitter that the client can subscribe to
     */
    public SseEmitter createConnection() {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        UUID userId = currentUser.getId();
        
        // Remove any existing connection for this user
        SseEmitter existing = activeConnections.remove(userId);
        if (existing != null) {
            try {
                existing.complete();
            } catch (Exception e) {
                // Ignore errors when cleaning up old connection
            }
        }
        
        // Create new SSE emitter with timeout
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        
        // Handle completion (client disconnected)
        emitter.onCompletion(() -> {
            activeConnections.remove(userId);
        });
        
        // Handle timeout
        emitter.onTimeout(() -> {
            activeConnections.remove(userId);
            try {
                emitter.complete();
            } catch (Exception e) {
                // Ignore
            }
        });
        
        // Handle error
        emitter.onError((ex) -> {
            activeConnections.remove(userId);
            try {
                emitter.completeWithError(ex);
            } catch (Exception e) {
                // Ignore
            }
        });
        
        activeConnections.put(userId, emitter);
        
        // Send initial connection event
        try {
            emitter.send(SseEmitter.event()
                .name("connected")
                .data(Map.of("status", "connected", "userId", userId.toString())));
        } catch (IOException e) {
            activeConnections.remove(userId);
            emitter.completeWithError(e);
            throw new RuntimeException("Failed to send initial SSE event", e);
        }
        
        return emitter;
    }
    
    /**
     * Sends an event to a specific user.
     * @param userId The user ID to send the event to
     * @param eventName The name of the event
     * @param data The data to send (will be serialized as JSON)
     */
    public void sendEvent(UUID userId, String eventName, Object data) {
        SseEmitter emitter = activeConnections.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
            } catch (IOException e) {
                // Connection closed, remove it
                activeConnections.remove(userId);
                try {
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                    // Ignore
                }
            }
        }
    }
    
    /**
     * Sends an event to all connected users in a thread.
     * @param threadId The thread ID
     * @param eventName The name of the event
     * @param data The data to send
     * Note: This method should be called from within a transactional context to ensure
     * LAZY-loaded relationships (e.g., ThreadParticipant.getUser()) are accessible.
     */
    public void sendEventToThreadParticipants(UUID threadId, String eventName, Object data) {
        // Get all participant IDs for this thread
        // Note: This method is typically called from an already transactional context (MessageService)
        List<ThreadParticipant> participants = threadParticipantRepository.findByThreadId(threadId);
        List<UUID> participantIds = participants.stream()
            .map(participant -> participant.getUser().getId())
            .collect(Collectors.toList());
        
        // Send event to each connected participant
        participantIds.forEach(userId -> sendEvent(userId, eventName, data));
    }
    
    /**
     * Broadcasts an event to all connected users.
     * @param eventName The name of the event
     * @param data The data to send
     */
    public void broadcastEvent(String eventName, Object data) {
        activeConnections.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
            } catch (IOException e) {
                // Connection closed, remove it
                activeConnections.remove(userId);
                try {
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                    // Ignore
                }
            }
        });
    }
    
    /**
     * Closes a connection for a specific user.
     * @param userId The user ID
     */
    public void closeConnection(UUID userId) {
        SseEmitter emitter = activeConnections.remove(userId);
        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception e) {
                // Ignore
            }
        }
    }
    
    /**
     * Gets the number of active connections.
     * @return Number of active SSE connections
     */
    public int getActiveConnectionCount() {
        return activeConnections.size();
    }
}
