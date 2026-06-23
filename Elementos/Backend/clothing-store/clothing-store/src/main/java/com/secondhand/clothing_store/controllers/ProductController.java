package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Product;
import com.secondhand.clothing_store.services.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*") // Permite peticiones desde tu frontend
public class ProductController {
    @Autowired
    private IProductService productService;

    // 1. Listar todos
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 2. Detalle de producto
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 3. Filtrar por subcategoría
    @GetMapping("/subcategory/{subId}")
    public ResponseEntity<List<Product>> getBySubcategory(@PathVariable Long subId) {
        return ResponseEntity.ok(productService.getProductsBySubcategory(subId));
    }

    // 4. Crear (Para el panel de vendedor/admin)
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return new ResponseEntity<>(productService.saveProduct(product), HttpStatus.CREATED);
    }
}
