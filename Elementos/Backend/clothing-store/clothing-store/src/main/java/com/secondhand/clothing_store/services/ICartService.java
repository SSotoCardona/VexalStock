package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Cart;

public interface ICartService {
    Cart getCartByUserId(Long userId);
    Cart addProductToCart(Long userId, Long productId, Integer quantity);
    void clearCart(Long userId);
}
