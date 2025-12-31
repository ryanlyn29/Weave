package com.weave.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Embeddable;

import java.util.List;

@Embeddable
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntityMetadata {
    private String date;
    private String time;
    private List<String> participants;
    private String location;
    private Priority priority;
    private List<String> tags;

    public EntityMetadata() {
    }

    public EntityMetadata(String date, String time, List<String> participants, String location, Priority priority, List<String> tags) {
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

    public Priority getPriority() {
        return priority;
    }

    public List<String> getTags() {
        return tags;
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}
