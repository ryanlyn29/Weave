package com.weave.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntityMetadataDTO {
    private final String date;
    private final String time;
    private final List<String> participants;
    private final String location;
    private final String priority;
    private final List<String> tags;

    public EntityMetadataDTO(String date, String time, List<String> participants, String location, String priority, List<String> tags) {
        this.date = date;
        this.time = time;
        this.participants = participants;
        this.location = location;
        this.priority = priority;
        this.tags = tags;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public String getLocation() {
        return location;
    }

    public String getPriority() {
        return priority;
    }

    public List<String> getTags() {
        return tags;
    }
}
