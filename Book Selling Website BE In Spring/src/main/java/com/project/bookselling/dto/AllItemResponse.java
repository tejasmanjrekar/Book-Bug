package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllItemResponse<T> {
    private Boolean IsSuccess;
    private String Message;
    private Long CurrentPage;
    private Double TotalRecords;
    private Integer TotalPage;
    private List<T> data;

    public AllItemResponse(Boolean isSuccess, String message, List<T> data) {
        IsSuccess = isSuccess;
        Message = message;
        this.data = data;
        this.CurrentPage = 1L;
        this.TotalPage = 1;
        this.TotalRecords = Double.valueOf(data.stream().count());
    }
}

