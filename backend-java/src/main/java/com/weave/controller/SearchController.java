package com.weave.controller;

import com.weave.dto.SearchResultDTO;
import com.weave.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        List<SearchResultDTO> results = searchService.search(q);
        
        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        response.put("query", q);
        response.put("total", results.size());
        
        return ResponseEntity.ok(response);
    }
}


