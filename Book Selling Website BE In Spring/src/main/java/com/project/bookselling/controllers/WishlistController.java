package com.project.bookselling.controllers;

import com.project.bookselling.dto.*;
import com.project.bookselling.models.Cart;
import com.project.bookselling.models.Product;
import com.project.bookselling.models.WishList;
import com.project.bookselling.repositories.CartRepository;
import com.project.bookselling.repositories.ProductRepository;
import com.project.bookselling.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/WishList")
public class WishlistController {
    @Autowired
    WishlistRepository wishlistRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @PostMapping("/GetAllWishListDetails")
    public ResponseEntity<AllItemResponse<GetAllWishListProductDTO>> getAllWishlist(@RequestBody PaginationUserDTO page) {
        List<WishList> lists = wishlistRepository.findAllByUserId(page.getUserID());
        List<GetAllWishListProductDTO> result = new ArrayList<>();
        lists.forEach(wishList -> {
            Product product = productRepository.getProductByProductIDAndIsActive(wishList.getProductID(), true);
            result.add(
              new GetAllWishListProductDTO(
                   wishList.getWishListID(),
                   wishList.getProductID(),
                   "",
                   product.getProductName(),
                   product.getProductType(),
                   product.getProductPrice(),
                   product.getProductDetails(),
                   product.getProductCompany(),
                   product.getQuantity(),
                   product.getProductImageUrl(),
                   product.getPublicId(),
                   product.getIsArchive(),
                   product.getIsActive()
              )
            );
        });
        return new ResponseEntity<>(new AllItemResponse<>(true, "Fetch All Wishlist Product", result), HttpStatus.OK);
    }

    @PostMapping("/AddToWishList")
    public ResponseEntity<BasicDataResponseDTO<WishList>> addToWishlist(@RequestBody ProductUserRequestDTO req) {
        WishList wishList = new WishList();
        wishList.setIsActive(true);
        wishList.setProductID(req.getProductID());
        wishList.setUserId(req.getUserID());
        wishlistRepository.save(wishList);
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Add Product In Wishlist", wishList), HttpStatus.OK);
    }

    @DeleteMapping("/RemoveWishListProduct")
    public ResponseEntity<BasicDataResponseDTO<?>> deleteFeedback( @RequestBody WishlistDeleteDTO wishlist) {
        wishlistRepository.deleteById(wishlist.getWishListID());
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Delete Wishlist Product", null), HttpStatus.OK);
    }

    @PostMapping("/MoveToCard")
    public ResponseEntity<BasicDataResponseDTO<?>> MoveToCard( @RequestBody WishlistMoveToCartReqDTO req) {
        Cart cart = new Cart();
        cart.setInsertionDate(new Date());
        cart.setIsActive(true);
        cart.setIsOrder(false);
        cart.setUserId(req.getUserID());
        cart.setProductID(req.getProductID());
        cartRepository.save(cart);
        wishlistRepository.deleteById(req.getWishListID());
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Product moved Wishlist To Cart", null), HttpStatus.OK);
    }
}
