package com.project.bookselling.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data  @NoArgsConstructor
public class BasicResponse {
    public boolean isSuccess;
    public String message;

    public BasicResponse(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
