package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.CartItem;
import com.vexalstock.backend.service.CartService;

import org.springframework.lang.NonNull;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCartItems(@RequestParam String userEmail) {
        return cartService.findByUserEmail(userEmail);
    }

    @PostMapping
    public CartItem addCartItem(@RequestBody @NonNull CartItem cartItem) {
        return cartService.save(cartItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable @NonNull Long id) {
        cartService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCartItemByProduct(@RequestParam String userEmail, @RequestParam @NonNull Long productId) {
        cartService.deleteByUserEmailAndProductId(userEmail, productId);
        return ResponseEntity.noContent().build();
    }
}
