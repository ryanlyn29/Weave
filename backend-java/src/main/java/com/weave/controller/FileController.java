package com.weave.controller;

import com.weave.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/files")
public class FileController {
    private final S3Service s3Service;

    public FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    /**
     * Upload a file to S3
     * POST /v1/files/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            byte[] fileData = file.getBytes();
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
            String url = s3Service.uploadFile(fileData, contentType, file.getOriginalFilename());

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", file.getOriginalFilename());
            response.put("size", String.valueOf(file.getSize()));
            response.put("type", contentType);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
