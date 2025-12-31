package com.weave.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

/**
 * Service for uploading files to AWS S3
 */
@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucketName;
    private final String region;

    public S3Service(
            @Value("${aws.s3.bucket-name:weave-uploads}") String bucketName,
            @Value("${aws.s3.region:us-east-1}") String region) {
        this.bucketName = bucketName;
        this.region = region;
        this.s3Client = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();
    }

    /**
     * Upload a file to S3
     * @param fileData The file data as bytes
     * @param contentType The content type (e.g., "image/jpeg", "application/pdf")
     * @param originalFilename The original filename
     * @return The S3 URL of the uploaded file
     */
    public String uploadFile(byte[] fileData, String contentType, String originalFilename) {
        // Generate unique key
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String key = "uploads/" + UUID.randomUUID() + extension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(contentType)
            .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileData));

        // Return the S3 URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
}
