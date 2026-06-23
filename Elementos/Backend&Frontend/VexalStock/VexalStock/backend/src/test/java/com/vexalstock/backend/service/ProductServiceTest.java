package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Product;
import com.vexalstock.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void saveShouldInitializeViewsAndStatusWhenNull() {
        Product product = new Product();
        product.setTitle("Camisa");
        product.setSellerEmail("vendedor@example.com");
        product.setViews(null);
        product.setStatus(null);

        when(productRepository.save(product)).thenReturn(product);

        Product saved = productService.save(product);

        assertNotNull(saved);
        assertEquals(0, saved.getViews());
        assertEquals("disponible", saved.getStatus());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void findAvailableShouldUseStatusFilter() {
        Product available = new Product();
        available.setStatus("disponible");

        when(productRepository.findByStatus("disponible")).thenReturn(List.of(available));

        List<Product> result = productService.findAvailable();

        assertEquals(1, result.size());
        assertEquals("disponible", result.get(0).getStatus());
        verify(productRepository, times(1)).findByStatus("disponible");
    }

    @SuppressWarnings("null")
    @Test
    void deleteEmptyProductsShouldRemoveInvalidProducts() {
        Product valid = new Product();
        valid.setTitle("Correcto");
        valid.setSellerEmail("seller@example.com");

        Product invalid = new Product();
        invalid.setTitle("  ");
        invalid.setSellerEmail("");

        when(productRepository.findAll()).thenReturn(List.of(valid, invalid));

        productService.deleteEmptyProducts();

        List<Product> invalidProducts = Collections.singletonList(invalid);
        verify(productRepository, times(1)).findAll();
        verify(productRepository, times(1)).deleteAll(invalidProducts);
    }

    @Test
    void findByIdShouldReturnProductWhenFound() {
        Product product = new Product();
        product.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<Product> result = productService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(productRepository, times(1)).findById(1L);
    }
}
