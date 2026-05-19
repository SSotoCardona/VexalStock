package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Subcategory;
import com.secondhand.clothing_store.repositories.SubcategoryRepository;
import com.secondhand.clothing_store.services.ISubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SubcategoryServiceImpl implements ISubcategoryService {
    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Override
    public List<Subcategory> getByCategoryId(Long categoryId) {
        return subcategoryRepository.findByCategory_Id(categoryId);
    }
}
