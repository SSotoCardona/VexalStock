package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Cart;
import com.secondhand.clothing_store.models.Cart_item;
import com.secondhand.clothing_store.models.Product;
import com.secondhand.clothing_store.repositories.CartRepository;
import com.secondhand.clothing_store.repositories.ProductRepository;
import com.secondhand.clothing_store.services.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class CartServiceImpl implements ICartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart getCartByUserId(Long userId) {
        return null;
    }

    @Override
    public Cart addProductToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Lógica para actualizar ítem existente o crear uno nuevo
        Optional<Cart_item> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            Cart_item newItem = new Cart_item();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {

    }
}
