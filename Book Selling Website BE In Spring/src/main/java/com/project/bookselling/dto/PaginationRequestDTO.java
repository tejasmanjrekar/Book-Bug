package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class PaginationRequestDTO {
    private int pageNumber;
    private int numberOfRecordPerPage;
}
