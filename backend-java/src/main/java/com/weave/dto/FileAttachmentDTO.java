package com.weave.dto;

import java.util.UUID;

public class FileAttachmentDTO {
    private final String url;
    private final String filename;
    private final Long size;
    private final String type;

    public FileAttachmentDTO(String url, String filename, Long size, String type) {
        this.url = url;
        this.filename = filename;
        this.size = size;
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public String getFilename() {
        return filename;
    }

    public Long getSize() {
        return size;
    }

    public String getType() {
        return type;
    }
}
