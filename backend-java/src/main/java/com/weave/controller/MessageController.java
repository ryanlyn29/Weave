package com.weave.controller;

import com.weave.dto.MessageDTO;
import com.weave.dto.SendMessageRequest;
import com.weave.dto.SendMessageResponse;
import com.weave.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }
    
    @PostMapping("/send")
    public ResponseEntity<SendMessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }
    
    @GetMapping("/thread/{threadId}")
    public ResponseEntity<List<MessageDTO>> getMessagesByThread(@PathVariable UUID threadId) {
        return ResponseEntity.ok(messageService.getMessagesByThread(threadId));
    }
}


