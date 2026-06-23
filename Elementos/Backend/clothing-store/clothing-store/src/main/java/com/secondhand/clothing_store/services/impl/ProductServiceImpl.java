package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Product;
import com.secondhand.clothing_store.repositories.ProductRepository;
import com.secondhand.clothing_store.services.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements IProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return null;
    }

    @Override
    public Product saveProduct(Product product) {
        // Regla de negocio: No permitir productos con stock negativo
        if (product.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {

    }

    @Override
    public List<Product> getProductsBySubcategory(Long subId) {
        return productRepository.findBySubcategoryId(subId);
    }

}
