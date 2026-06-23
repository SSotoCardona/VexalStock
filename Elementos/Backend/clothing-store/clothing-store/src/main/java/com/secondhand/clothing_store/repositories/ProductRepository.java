package com.secondhand.clothing_store.repositories;

import com.secondhand.clothing_store.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySubcategoryId(Long subcategoryId);
    List<Product> findByNameContainingIgnoreCase(String name);
    // Para filtrar por rango de precio (muy útil en frontend)
    List<Product> findByPriceBetween(Double min, Double max);
}
