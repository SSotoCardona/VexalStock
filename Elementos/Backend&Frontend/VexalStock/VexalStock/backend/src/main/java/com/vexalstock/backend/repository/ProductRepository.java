package com.vexalstock.backend.repository;

import com.vexalstock.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(String status);
    List<Product> findByCategory(String category);
    List<Product> findBySellerEmail(String sellerEmail);
}
