package com.weave.service;

import com.weave.dto.NotificationDTO;
import com.weave.model.Notification;
import com.weave.model.User;
import com.weave.repository.NotificationRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    public List<NotificationDTO> getNotifications() {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void markAllAsRead() {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        notificationRepository.markAllAsRead(currentUser.getId(), Instant.now());
    }
    
    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setRead(true);
        notification.setReadAt(Instant.now());
        notificationRepository.save(notification);
    }
    
    public NotificationDTO toDTO(Notification notification) {
        return new NotificationDTO(
            notification.getId(),
            notification.getType().name().toLowerCase(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getThread() != null ? notification.getThread().getId() : null,
            notification.getEntity() != null ? notification.getEntity().getId() : null,
            notification.getCreatedAt(),
            notification.getRead()
        );
    }
}

