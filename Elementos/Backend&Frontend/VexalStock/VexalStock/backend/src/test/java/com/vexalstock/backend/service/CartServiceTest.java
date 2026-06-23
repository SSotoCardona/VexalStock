package com.vexalstock.backend.service;

import com.vexalstock.backend.model.CartItem;
import com.vexalstock.backend.repository.CartItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void findByUserEmailShouldReturnCartItems() {
        CartItem item = new CartItem();
        item.setUserEmail("user@example.com");

        when(cartItemRepository.findByUserEmail("user@example.com")).thenReturn(List.of(item));

        List<CartItem> result = cartService.findByUserEmail("user@example.com");

        assertEquals(1, result.size());
        assertEquals("user@example.com", result.get(0).getUserEmail());
        verify(cartItemRepository, times(1)).findByUserEmail("user@example.com");
    }

    @Test
    void deleteByUserEmailAndProductIdShouldDelegateToRepository() {
        cartService.deleteByUserEmailAndProductId("user@example.com", 12L);

        verify(cartItemRepository, times(1)).deleteByUserEmailAndProductId("user@example.com", 12L);
    }
}
