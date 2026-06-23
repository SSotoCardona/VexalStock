package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Subcategory;

import java.util.List;

public interface ISubcategoryService {
    List<Subcategory> getByCategoryId(Long categoryId);
}
