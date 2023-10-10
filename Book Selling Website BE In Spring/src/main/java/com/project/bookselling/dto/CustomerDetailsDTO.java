package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class CustomerDetailsDTO {
    private Boolean isUpdate;
    private Long userID;
    private String userName;
    private String fullName;
    private String emailID;
    private String mobileNumber;
}
