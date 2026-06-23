package com.vexalstock.backend.config;

import com.vexalstock.backend.model.Product;
import com.vexalstock.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductCleanupRunner implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductCleanupRunner(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        List<Product> invalidProducts = productRepository.findAll().stream()
                .filter(product -> product.getTitle() == null || product.getTitle().isBlank()
                        || product.getSellerEmail() == null || product.getSellerEmail().isBlank())
                .toList();

        if (!invalidProducts.isEmpty()) {
            productRepository.deleteAll(invalidProducts);
        }
    }
}
