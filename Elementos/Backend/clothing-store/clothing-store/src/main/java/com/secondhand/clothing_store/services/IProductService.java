package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Product;

import java.util.List;

public interface IProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product saveProduct(Product product);
    void deleteProduct(Long id);
    List<Product> getProductsBySubcategory(Long subId);
}
