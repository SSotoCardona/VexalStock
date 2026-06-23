package com.vexalstock.backend.service;

import com.vexalstock.backend.model.CartItem;
import com.vexalstock.backend.repository.CartItemRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> findByUserEmail(String userEmail) {
        return cartItemRepository.findByUserEmail(userEmail);
    }

    public CartItem save(@NonNull CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void delete(@NonNull Long id) {
        cartItemRepository.deleteById(id);
    }

    public void deleteByUserEmailAndProductId(String userEmail, Long productId) {
        cartItemRepository.deleteByUserEmailAndProductId(userEmail, productId);
    }
}
