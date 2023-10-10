package com.project.bookselling.controllers;

import com.project.bookselling.dto.*;
import com.project.bookselling.models.Cart;
import com.project.bookselling.models.CustomerDetails;
import com.project.bookselling.models.Product;
import com.project.bookselling.repositories.CartRepository;

import com.project.bookselling.repositories.CustomerDetailsRepository;
import com.project.bookselling.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/Card")
public class CartController {
    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CustomerDetailsRepository customerDetailsRepository;


    @PostMapping("/AddToCard")
    public ResponseEntity<BasicResponse> createAddToCart(@RequestBody ProductUserRequestDTO productIdRequestDTO){
        Cart cart = new Cart();
        cart.setInsertionDate(new Date());
        cart.setIsActive(true);
        cart.setIsOrder(false);
        cart.setIsPayment(false);
        cart.setUserId(productIdRequestDTO.getUserID());
        cart.setProductID(productIdRequestDTO.getProductID());

        cartRepository.save(cart);
        return new ResponseEntity<>(new BasicResponse(true, "Added to cart"), HttpStatus.OK);
    }

    @PostMapping("/GetAllCardDetails")
    public ResponseEntity<AllItemResponse<GetAllCardDetailsDTO>> getAllCart(@RequestBody PaginationUserDTO userPagination){
        List<GetAllCardDetailsDTO> result = new ArrayList<>();
        List<Cart> carts = cartRepository.findAllByUserId(userPagination.getUserID());
        carts.forEach(cart -> {
            //Product p = productRepository.getProductByProductIDAndIsActive(cart.getProductID().longValue(), true);
            Optional<Product> _p = productRepository
                    .findAll()
                    .stream()
                    .filter(x->x.getProductID()==cart.getProductID() && x.getIsActive())
                    .findFirst();
            Product p = _p.get();
            Optional<CustomerDetails> c = customerDetailsRepository.getCustomerDetailsByUserID(cart.getUserId().longValue());

                result.add(
                        new GetAllCardDetailsDTO(
                                cart.getCardID(),
                                cart.getProductID(),
                                "",
                                "",
                                p.getProductName(),
                                p.getProductType(),
                                p.getProductPrice(),
                                p.getProductDetails(),
                                p.getProductCompany(),
                                p.getQuantity(),
                                p.getProductImageUrl(),
                                p.getPublicId(),
                                p.getIsArchive(),
                                p.getIsActive(),
                                cart.getIsOrder(),
                                cart.getIsPayment(),
                                cart.getRating()
                        )
                );


        });
        return new ResponseEntity<>(new AllItemResponse<>(true, "data", result), HttpStatus.OK);
    }

    @DeleteMapping("/RemoveCartProduct")
    public ResponseEntity<BasicDataResponseDTO<List<Cart>>> removeCart(@RequestBody CartIdRequest cart){
        cartRepository.deleteById(cart.getCartID());
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Deleted", null), HttpStatus.OK);
    }

    @PostMapping("/OrderProduct")
    public ResponseEntity<BasicDataResponseDTO<List<Cart>>> orderProduct(@RequestBody CartProductDTO cart){
        Optional<Cart> ca = cartRepository.findById(cart.getCartID());
        if(ca.isPresent()) {
            Cart _ca = ca.get();
            _ca.setIsOrder(true);

            Optional<Product> product = productRepository.findById(cart.getProductID());
            if(product.isPresent()) {
                Product _product = product.get();
                _product.setQuantity(_product.getQuantity() - 1);
                productRepository.save(_product);
                cartRepository.save(_ca);
                return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Product Ordered Successfully.", null), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(new BasicDataResponseDTO<>(false, "Product Not Found", null), HttpStatus.OK);
    }

    @PostMapping("/GetOrderProduct")
    public ResponseEntity<AllItemResponse<GetAllCardDetailsDTO>> getOrderProduct(@RequestBody PaginationUserDTO userPagination){
        List<GetAllCardDetailsDTO> result = new ArrayList<>();
        List<Cart> carts = cartRepository.findAllByUserIdAndIsOrder(userPagination.getUserID(), true);
        carts.forEach(cart -> {
            Product p = productRepository.getProductByProductIDAndIsActive(cart.getProductID().longValue(), true);
            Optional<CustomerDetails> c = customerDetailsRepository.getCustomerDetailsByUserID(cart.getUserId());
            if(c.isPresent()){
                CustomerDetails _c = c.get();
                result.add(
                        new GetAllCardDetailsDTO(
                                cart.getCardID(),
                                cart.getProductID(),
                                "",
                                _c.getFullName(),
                                p.getProductName(),
                                p.getProductType(),
                                p.getProductPrice(),
                                p.getProductDetails(),
                                p.getProductCompany(),
                                p.getQuantity(),
                                p.getProductImageUrl(),
                                p.getPublicId(),
                                p.getIsArchive(),
                                p.getIsActive(),
                                cart.getIsOrder(),
                                cart.getIsPayment(),
                                cart.getRating()
                                )
                );
            }

        });
        return new ResponseEntity<>(new AllItemResponse<>(true, result.stream().count()==0?"CustomerDetailError":"Order List Found", result), HttpStatus.OK);
    }

    @PostMapping("/GetAllOrderProduct")
    public ResponseEntity<AllItemResponse<GetAllCardDetailsDTO>> getAllOrderProduct(@RequestBody PaginationUserDTO userPagination){
        List<GetAllCardDetailsDTO> result = new ArrayList<>();
        List<Cart> carts = cartRepository.findAll();
        carts.forEach(cart -> {
            Product p = productRepository.getProductByProductIDAndIsActive(cart.getProductID().longValue(), true);
            if(p!=null) {
                Optional<CustomerDetails> c = customerDetailsRepository.getCustomerDetailsByUserID(cart.getUserId());
                if (c.isPresent()) {
                    CustomerDetails _c = c.get();
                    result.add(
                            new GetAllCardDetailsDTO(
                                    cart.getCardID(),
                                    cart.getProductID(),
                                    "",
                                    _c.getFullName(),
                                    p.getProductName(),
                                    p.getProductType(),
                                    p.getProductPrice(),
                                    p.getProductDetails(),
                                    p.getProductCompany(),
                                    p.getQuantity(),
                                    p.getProductImageUrl(),
                                    p.getPublicId(),
                                    p.getIsArchive(),
                                    p.getIsActive(),
                                    cart.getIsOrder(),
                                    cart.getIsPayment(),
                                    cart.getRating()
                            )
                    );
                }
            }
        });
        return new ResponseEntity<>(new AllItemResponse<>(true, result.stream().count()==0?"No Order Purchased":"Order List Found", result), HttpStatus.OK);
    }


    @PatchMapping("/CancleOrder")
    public ResponseEntity<BasicDataResponseDTO<List<Product>>> cancelOrder(@RequestBody CartProductDTO req){
        Product p = productRepository.getProductByProductIDAndIsActive(req.getProductID(), true);
        p.setQuantity(p.getQuantity()+1);
        productRepository.save(p);
        cartRepository.deleteById(req.getCartID());
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Order Cancel Successfully.", null), HttpStatus.OK);
    }

    @PatchMapping("/Rating")
    public ResponseEntity<BasicDataResponseDTO<Boolean>> Rating(@RequestBody RatingRequestDTO req){
        Cart data = cartRepository.getReferenceById(req.getCardID());
        data.setRating(req.getRating());
        cartRepository.save(data);
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Send Rating Successfully", true), HttpStatus.OK);
    }

    @PatchMapping("/PaymentGetway")
    public ResponseEntity<BasicDataResponseDTO<Boolean>> PaymentGetway(@RequestBody PaymentGetwayRequestDTO req){
        Cart data = cartRepository.getReferenceById(req.getCartNo());
        data.setIsPayment(true);
        data.setPaymentType(req.getPaymentType());
        data.setUpiId(req.getUPIId());
        data.setCardNo(req.getCardNo());
        cartRepository.save(data);
        return new ResponseEntity<>(new BasicDataResponseDTO<>(true, "Payment Successfully", true), HttpStatus.OK);
    }

}
