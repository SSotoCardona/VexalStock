package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Product;
import com.vexalstock.backend.repository.ProductRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByStatus(String status) {
        return productRepository.findByStatus(status);
    }

    public List<Product> findAvailable() {
        return findByStatus("disponible");
    }

    public Optional<Product> findById(@NonNull Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        if (product.getViews() == null) {
            product.setViews(0);
        }
        if (product.getStatus() == null) {
            product.setStatus("disponible");
        }
        return productRepository.save(product);
    }

    public void deleteEmptyProducts() {
        List<Product> invalidProducts = productRepository.findAll().stream()
                .filter(product -> product.getTitle() == null || product.getTitle().isBlank()
                        || product.getSellerEmail() == null || product.getSellerEmail().isBlank())
                .toList();
        if (!invalidProducts.isEmpty()) {
            productRepository.deleteAll(invalidProducts);
        }
    }

    public void delete(@NonNull Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> findBySellerEmail(String sellerEmail) {
        return productRepository.findBySellerEmail(sellerEmail);
    }
}
