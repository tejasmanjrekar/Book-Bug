package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllWishListProductDTO {
    private Long WishListID;
    private Long ProductID;
    private String InsertionDate;
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
}
