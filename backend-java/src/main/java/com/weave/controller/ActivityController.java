package com.weave.controller;

import com.weave.dto.ActivityItemDTO;
import com.weave.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/activity")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getActivity(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String importance,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) UUID person) {
        
        List<ActivityItemDTO> activities = activityService.getActivity(type, importance, state, person);
        
        Map<String, Object> response = new HashMap<>();
        response.put("activities", activities);
        response.put("total", activities.size());
        
        return ResponseEntity.ok(response);
    }
}


