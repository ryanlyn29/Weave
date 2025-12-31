package com.weave.model;

import java.util.UUID;

public class FileAttachment {
    private String url;
    private String filename;
    private Long size;
    private String type;

    public FileAttachment() {
    }

    public FileAttachment(String url, String filename, Long size, String type) {
        this.url = url;
        this.filename = filename;
        this.size = size;
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
