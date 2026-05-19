package com.secondhand.clothing_store.repositories;

import com.secondhand.clothing_store.models.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    List<Subcategory> findByCategory_Id(Long Category_Id);
}
