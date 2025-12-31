package com.weave.service;

import com.weave.dto.ActivityItemDTO;
import com.weave.model.ActivityItem;
import com.weave.model.User;
import com.weave.repository.ActivityItemRepository;
import com.weave.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ActivityService {
    private final ActivityItemRepository activityRepository;

    public ActivityService(ActivityItemRepository activityRepository) {
        this.activityRepository = activityRepository;
    }
    
    public List<ActivityItemDTO> getActivity(String type, String importance, String state, UUID person) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        List<ActivityItem> activities = activityRepository.findByUserGroups(currentUser.getId());
        
        // Apply filters
        if (type != null) {
            ActivityItem.ActivityType activityType = ActivityItem.ActivityType.valueOf(type.toUpperCase());
            activities = activities.stream()
                .filter(a -> a.getType() == activityType)
                .collect(Collectors.toList());
        }
        
        if (importance != null) {
            double threshold = switch (importance) {
                case "high" -> 0.8;
                case "medium" -> 0.5;
                default -> 0.0;
            };
            final double finalThreshold = threshold;
            activities = activities.stream()
                .filter(a -> {
                    if (importance.equals("high")) return a.getImportance() >= 0.8;
                    if (importance.equals("medium")) return a.getImportance() >= 0.5 && a.getImportance() < 0.8;
                    return a.getImportance() < 0.5;
                })
                .collect(Collectors.toList());
        }
        
        if (person != null) {
            activities = activities.stream()
                .filter(a -> a.getUser().getId().equals(person))
                .collect(Collectors.toList());
        }
        
        return activities.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public ActivityItemDTO toDTO(ActivityItem activity) {
        return new ActivityItemDTO(
            activity.getId(),
            activity.getType().name().toLowerCase(),
            activity.getEntity() != null ? activity.getEntity().getId() : null,
            activity.getThread().getId(),
            activity.getMessage() != null ? activity.getMessage().getId() : null,
            activity.getUser().getId(),
            activity.getDescription(),
            activity.getTimestamp(),
            activity.getImportance()
        );
    }
}

