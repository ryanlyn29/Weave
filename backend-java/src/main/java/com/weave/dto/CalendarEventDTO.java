package com.weave.dto;

public class CalendarEventDTO {
    private String date;
    private String time;
    private String title;

    public CalendarEventDTO() {
    }

    public CalendarEventDTO(String date, String time, String title) {
        this.date = date;
        this.time = time;
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getTitle() {
        return title;
    }
}
