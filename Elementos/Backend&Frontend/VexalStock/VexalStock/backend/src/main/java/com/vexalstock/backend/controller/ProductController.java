package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.Product;
import com.vexalstock.backend.service.ProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String status,
                                     @RequestParam(required = false) String category,
                                     @RequestParam(required = false) String sellerEmail) {
        if (sellerEmail != null) {
            return productService.findBySellerEmail(sellerEmail);
        }
        if (status != null && category != null) {
            return productService.findByCategory(category).stream()
                    .filter(p -> status.equals(p.getStatus()))
                    .toList();
        }
        if (status != null) {
            return productService.findByStatus(status);
        }
        if (category != null) {
            return productService.findByCategory(category);
        }
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable @NonNull Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (!isValidProduct(product)) {
            return ResponseEntity.badRequest().build();
        }
        Product saved = productService.save(product);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProduct(@ModelAttribute Product product,
                                                 @RequestParam(value = "imageFiles", required = false) List<MultipartFile> images) throws IOException {
        if (!isValidProduct(product)) {
            return ResponseEntity.badRequest().build();
        }
        if (images != null && !images.isEmpty()) {
            product.setImages(saveUploadedFiles(images));
        }
        Product saved = productService.save(product);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/cleanup-empty")
    public ResponseEntity<Void> cleanupEmptyProducts() {
        productService.deleteEmptyProducts();
        return ResponseEntity.noContent().build();
    }

    private boolean isValidProduct(Product product) {
        return product != null
                && product.getTitle() != null && !product.getTitle().isBlank()
                && product.getPrice() != null
                && product.getCategory() != null && !product.getCategory().isBlank()
                && product.getSize() != null && !product.getSize().isBlank()
                && product.getCondition() != null && !product.getCondition().isBlank()
                && product.getSellerEmail() != null && !product.getSellerEmail().isBlank();
    }

    private List<String> saveUploadedFiles(List<MultipartFile> files) throws IOException {
        Path uploadDir = Paths.get("uploads");
        Files.createDirectories(uploadDir);

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> {
                    String originalFilename = Path.of(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename()).getFileName().toString();
                    String extension = "";
                    int dotIndex = originalFilename.lastIndexOf('.');
                    if (dotIndex >= 0) {
                        extension = originalFilename.substring(dotIndex);
                    }
                    String savedFilename = System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;
                    Path targetPath = uploadDir.resolve(savedFilename);
                    try {
                        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                        return "http://localhost:8080/uploads/" + savedFilename;
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file " + originalFilename, e);
                    }
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable @NonNull Long id, @RequestBody @NonNull Product product) {
        return productService.findById(id)
                .map(existing -> {
                    product.setId(existing.getId());
                    return ResponseEntity.ok(productService.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable @NonNull Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
