package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Category;

import java.util.List;

public interface ICategoryService{
    List<Category> getAll();
    Category save(Category category);
}
