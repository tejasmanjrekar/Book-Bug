package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String ProductName;
    private String ProductType;
    private String ProductPrice;
    private String ProductDetails;
    private String ProductCompany;
    private Long Quantity;
    private MultipartFile File;
}
