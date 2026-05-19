package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Category;
import com.secondhand.clothing_store.models.Subcategory;
import com.secondhand.clothing_store.services.ICategoryService;
import com.secondhand.clothing_store.services.ISubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private ICategoryService categoryService;
    @Autowired
    private ISubcategoryService subcategoryService;

    // 13. Listar categorías
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    // 14. Listar subcategorías por padre
    @GetMapping("/{catId}/subcategories")
    public ResponseEntity<List<Subcategory>> getSubs(@PathVariable Long catId) {
        return ResponseEntity.ok(subcategoryService.getByCategoryId(catId));
    }
}
