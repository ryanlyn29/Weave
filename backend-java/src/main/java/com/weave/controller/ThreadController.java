package com.weave.controller;

import com.weave.dto.CreateThreadRequest;
import com.weave.dto.SendMessageRequest;
import com.weave.dto.SendMessageResponse;
import com.weave.dto.ThreadDTO;
import com.weave.service.MessageService;
import com.weave.service.ThreadService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/threads")
public class ThreadController {
    private static final Logger log = LoggerFactory.getLogger(ThreadController.class);
    
    private final ThreadService threadService;
    private final MessageService messageService;

    public ThreadController(ThreadService threadService, MessageService messageService) {
        this.threadService = threadService;
        this.messageService = messageService;
    }
    
    @GetMapping
    public ResponseEntity<List<ThreadDTO>> getThreads(@RequestParam(required = false) String sort) {
        return ResponseEntity.ok(threadService.getThreads(sort));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ThreadDTO> getThread(@PathVariable UUID id) {
        return ResponseEntity.ok(threadService.getThread(id));
    }
    
    @PostMapping
    public ResponseEntity<SendMessageResponse> createThread(@Valid @RequestBody CreateThreadRequest request) {
        try {
            log.debug("Creating thread with content: {}", request.getContent());
            
            ThreadDTO threadDTO = threadService.createThread(request);
            log.debug("Thread created successfully: {}", threadDTO.getId());
            
            SendMessageRequest messageRequest = new SendMessageRequest(
                threadDTO.getId(),
                "text",
                request.getContent(),
                null,
                null,
                null,
                null,
                null
            );
            
            SendMessageResponse response = messageService.sendMessage(messageRequest);
            log.debug("Initial message sent to thread: {}", threadDTO.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in createThread endpoint: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markThreadRead(@PathVariable UUID id) {
        threadService.markThreadRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ThreadDTO> updateThreadStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        try {
            com.weave.model.Thread.ThreadStatus threadStatus = 
                com.weave.model.Thread.ThreadStatus.valueOf(status.toUpperCase());
            ThreadDTO updated = threadService.updateThreadStatus(id, threadStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}


