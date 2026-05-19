package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Category;
import com.secondhand.clothing_store.repositories.CategoryRepository;
import com.secondhand.clothing_store.services.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements ICategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }
}
