package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class GetAllCardDetailsDTO {
    private Long CartID;
    private Long ProductID;
    private String InsertionDate;
    private String FullName;
    private String ProductName;
    private String ProductType;
    private String ProductPrice;
    private String ProductDetails;
    private String ProductCompany;
    private Long Quantity;
    private String ProductImageUrl;
    private String privateID;
    private Boolean IsArchive;
    private Boolean IsActive;
    private Boolean IsOrder;
    private Boolean IsPayment;
    private double Rating;
}
