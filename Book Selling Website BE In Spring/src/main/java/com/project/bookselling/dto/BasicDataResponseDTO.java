package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class BasicDataResponseDTO<T> {
    private Boolean IsSuccess;
    private String Message;
    private T data;


}
