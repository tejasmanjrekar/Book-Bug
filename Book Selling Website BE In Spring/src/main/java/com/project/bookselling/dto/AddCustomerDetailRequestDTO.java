package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class AddCustomerDetailRequestDTO {
    private boolean isUpdate;
    private int userID;
    private String userName;
    private String fullName;
    private String emailID;
    private String mobileNumber;
}
