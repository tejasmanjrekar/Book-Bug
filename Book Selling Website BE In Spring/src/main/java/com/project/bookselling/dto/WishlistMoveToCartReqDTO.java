package com.project.bookselling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class WishlistMoveToCartReqDTO {
    private Long productID;
    private Long userID;
    private Long wishListID;
}
