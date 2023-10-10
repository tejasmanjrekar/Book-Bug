package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AddressRequestDTO {
    private Boolean isUpdate;
    private Long userID;
    private String address1;
    private String address2;
    private String city;
    private String distict;
    private String state;
    private String country;
    private String pincode;
}
