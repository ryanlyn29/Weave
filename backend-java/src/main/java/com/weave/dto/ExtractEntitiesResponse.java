package com.weave.dto;

import java.util.List;

public class ExtractEntitiesResponse {
    private final List<ExtractedEntityDTO> entities;
    private final Double confidence;
    private final String whyExtracted;

    public ExtractEntitiesResponse(List<ExtractedEntityDTO> entities, Double confidence, String whyExtracted) {
        this.entities = entities;
        this.confidence = confidence;
        this.whyExtracted = whyExtracted;
    }

    public List<ExtractedEntityDTO> getEntities() {
        return entities;
    }

    public Double getConfidence() {
        return confidence;
    }

    public String getWhyExtracted() {
        return whyExtracted;
    }
}
