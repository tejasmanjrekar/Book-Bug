package com.project.bookselling.controllers;

import com.project.bookselling.dto.*;
import com.project.bookselling.models.Product;
import com.project.bookselling.repositories.ProductRepository;
import com.project.bookselling.services.FileUploadService;
import com.project.bookselling.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin
@RestController @RequiredArgsConstructor
@RequestMapping("/api/Product")
public class ProductController {

    private final FileUploadService fileUploadService;
    private final ProductService productService;

    @Autowired
    ProductRepository productRepository;

    @RequestMapping(value = "/AddProduct", method = RequestMethod.POST, consumes="multipart/form-data")
    public ResponseEntity<BasicResponse> createProduct(@ModelAttribute ProductRequest productReq) throws IOException {

        Product product = new Product();
        product.setProductCompany(productReq.getProductCompany());
        product.setProductName(productReq.getProductName());
        product.setProductPrice(productReq.getProductPrice());
        product.setProductType(productReq.getProductType());
        product.setProductDetails(productReq.getProductDetails());
        product.setProductImageUrl(fileUploadService.uploadFile(productReq.getFile()));
        product.setPublicId(UUID.randomUUID().toString());
        product.setQuantity(productReq.getQuantity());
        product.setIsActive(true);
        product.setIsArchive(false);
        product.setInsertionDate(new Date());
        product.setUpdateDate(new Date());
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicResponse(true, "Add Product Successfully"), HttpStatus.OK);
    }

    @PostMapping("/GetAllProduct")
    public ResponseEntity<AllProductResponseDTO> getAllProducts(@RequestBody PaginationRequestDTO pagination) {
        Double ProductCount = Double.valueOf( productRepository.findAll().stream().count());
        List<Product> products =  productRepository.findAll();
        return new ResponseEntity<>( new AllProductResponseDTO( true, "Fetch All Product", Long.valueOf(pagination.getPageNumber()),  ProductCount, pagination.getNumberOfRecordPerPage(), products ),HttpStatus.OK);
    }

    @PostMapping("/GetArchiveProduct")
    public ResponseEntity<AllProductResponseDTO> getAllArchiveProducts(@RequestBody PaginationRequestDTO pagination) {
        List<Product> products = productRepository.findAllByIsArchive(true, PageRequest.of((pagination.getPageNumber() - 1) , pagination.getNumberOfRecordPerPage()));
        return new ResponseEntity<>( new AllProductResponseDTO( true, "Fetch Archive Product", 1L,  Double.valueOf(products.stream().count()), 1, products ),HttpStatus.OK);
    }

    @PostMapping("/GetTrashProduct")
    public ResponseEntity<AllProductResponseDTO> getAllTrashProducts(@RequestBody PaginationRequestDTO pagination) {
        List<Product> products = productRepository.findAllByIsActive(false, PageRequest.of((pagination.getPageNumber() - 1) , pagination.getNumberOfRecordPerPage()));
        return new ResponseEntity<>( new AllProductResponseDTO( true, "Fetch Trash Product", 1L,  Double.valueOf(products.stream().count()), 1, products ),HttpStatus.OK);
    }

    @GetMapping("/GetProductByID")
    public ResponseEntity<BasicDataResponseDTO<Product>> getProduct(@RequestParam Long productId)  {
        Product product =  productService.getProductById(productId);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Fetch Product Successfully", product), HttpStatus.OK);
    }

    @GetMapping("/GetProductByName")
    public ResponseEntity<BasicDataResponseDTO<Product>> getProductByName(@RequestParam String productName) {
        Product product =  productService.getProductByName(productName);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Fetch Product Successfully", product), HttpStatus.OK);
    }

    //@PutMapping("/UpdateProduct")
    @RequestMapping(value = "/UpdateProduct", method = RequestMethod.PUT, consumes="multipart/form-data")
    public ResponseEntity<BasicDataResponseDTO<Product>> updateProduct(@ModelAttribute UpdateProductRequestDTo productRes) throws IOException {
        Product product =  productService.getProductById(productRes.getProductID());
        product.setProductName(productRes.getProductName());
        product.setProductType(productRes.getProductType());
        product.setProductPrice(productRes.getProductPrice());
        product.setProductDetails(productRes.getProductDetails());
        product.setProductCompany(productRes.getProductCompany());
        product.setQuantity(productRes.getQuantity());
        if (productRes.getIsImageEdit().equalsIgnoreCase("TRUE")) {
            product.setProductImageUrl(fileUploadService.uploadFile(productRes.getFile()));
        }
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Update Product Successfully", product), HttpStatus.OK);
    }

    @PatchMapping("/ProductMoveToArchive")
    public ResponseEntity<BasicDataResponseDTO<Product>> moveProductToArchive(@RequestBody ProductIdRequestDTO req) {
        Product product =  productService.getProductById(req.getProductID());
        product.setIsArchive(true);
        product.setIsActive(true);
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Product Move To Archive", product), HttpStatus.OK);
    }

    @PatchMapping("/ProductMoveToTrash")
    public ResponseEntity<BasicDataResponseDTO<Product>> moveProductToTrash(@RequestBody ProductIdRequestDTO req) {
        Product product =  productService.getProductById(req.getProductID());
        product.setIsActive(false);
        product.setIsArchive(false);
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Product Move To Trash", product), HttpStatus.OK);
    }

    @DeleteMapping("/ProductDeletePermenently")
    public ResponseEntity<BasicDataResponseDTO<Product>> deleteProduct(@RequestBody ProductIdRequestDTO req) {
        BasicDataResponseDTO responseDTO = new BasicDataResponseDTO();
        responseDTO.setIsSuccess(true);
        responseDTO.setMessage("Delete Product Permanently");
        //Product product =  productService.getProductByIdForTrashRestore(req.getProductID());
        //productService.deleteProduct(product);
        try{

            Optional<Product> _product = productRepository.findAll()
                    .stream()
                    .filter(x->x.getProductID()==req.getProductID())
                    .findFirst();

            if(!_product.isPresent()){
                responseDTO.setIsSuccess(false);
                responseDTO.setMessage("Product Not Present In System");
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            }

            productRepository.delete(_product.get());

        }catch (Exception ex){
            responseDTO.setIsSuccess(false);
            responseDTO.setMessage("Exception Message : "+ex.getMessage());
        }
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Delete Product Permanently", null), HttpStatus.OK);
    }

    @PatchMapping("/ProductRestore")
    public ResponseEntity<BasicDataResponseDTO<Product>> restoreProduct(@RequestBody ProductIdRequestDTO req) {

        Product product =  productService.getProductById(req.getProductID());
        product.setIsArchive(false);
        product.setIsActive(true);
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Product Restored Successfully", product), HttpStatus.OK);
    }

    @PatchMapping("/TrashProductRestore")
    public ResponseEntity<BasicDataResponseDTO<Product>> TrashProductRestore(@RequestBody ProductIdRequestDTO req) {

        Product product =  productService.getProductByIdForTrashRestore(req.getProductID());
        product.setIsArchive(false);
        product.setIsActive(true);
        productService.saveProduct(product);
        return new ResponseEntity<>(new BasicDataResponseDTO<Product>(true, "Restored Product Successfully", product), HttpStatus.OK);
    }

}
