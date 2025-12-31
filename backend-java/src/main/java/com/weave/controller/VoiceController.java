package com.weave.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/voice")
public class VoiceController {
    
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateVoice(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        String style = body.getOrDefault("style", "conversational");
        String voiceId = body.getOrDefault("voiceId", "default");
        
        // Stub implementation - in production, call ElevenLabs
        Map<String, Object> response = new HashMap<>();
        response.put("audioUrl", "/audio/generated-" + System.currentTimeMillis() + ".mp3");
        response.put("duration", Math.ceil(text.length() / 10.0));
        response.put("style", style);
        response.put("voiceId", voiceId);
        
        return ResponseEntity.ok(response);
    }
}


