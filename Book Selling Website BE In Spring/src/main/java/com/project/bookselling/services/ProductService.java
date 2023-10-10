package com.project.bookselling.services;

import com.project.bookselling.models.Product;

public interface ProductService {
    void saveProduct(Product product);
    Product getProductById(Long productId);
    Product getProductByIdForTrashRestore(Long productId);
    Product getProductByName(String productName);

    void deleteProduct(Product product);
}
