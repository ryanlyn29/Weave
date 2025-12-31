package com.weave.controller;

import com.weave.service.LibraryService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/library")
public class LibraryController {
    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<LibraryService.LibraryQueryResponse> queryLibrary(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID ownerId,
            @RequestParam(required = false, defaultValue = "all") String timeframe) {
        
        // Parse filters
        List<String> types = type != null ? List.of(type.split(",")) : List.of();
        List<String> statuses = status != null ? List.of(status.split(",")) : List.of();
        
        LibraryService.LibraryQueryResponse response = libraryService.queryLibrary(types, statuses, ownerId, timeframe);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportLibrary(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID ownerId,
            @RequestParam(required = false, defaultValue = "all") String timeframe) {
        
        // Parse filters
        List<String> types = type != null ? List.of(type.split(",")) : List.of();
        List<String> statuses = status != null ? List.of(status.split(",")) : List.of();
        
        String csv = libraryService.exportToCSV(types, statuses, ownerId, timeframe);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "weave-library-export.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
    }
}
