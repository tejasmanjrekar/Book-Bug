package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class PaginationUserDTO {
    private Long pageNumber;
    private Long numberOfRecordPerPage;
    private Long userID;
}
