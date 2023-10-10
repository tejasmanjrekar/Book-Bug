package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data @NoArgsConstructor @AllArgsConstructor
public class UpdateProductRequestDTo {
    public Long productID;
    public String productName;
    public String productType;
    public String productPrice;
    public String productDetails;
    public String productCompany;
    public Long quantity;
    private MultipartFile file;
    private String isImageEdit;
}
