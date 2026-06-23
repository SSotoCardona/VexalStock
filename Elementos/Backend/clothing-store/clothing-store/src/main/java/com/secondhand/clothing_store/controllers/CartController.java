package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Cart;
import com.secondhand.clothing_store.services.ICartService;
import com.secondhand.clothing_store.services.ICart_ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private ICartService cartService;
    @Autowired
    private ICart_ItemService cartItemService;

    // 5. Ver carrito
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // 6. Añadir al carrito
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestParam Long userId,
                                          @RequestParam Long productId,
                                          @RequestParam Integer qty) {
        return ResponseEntity.ok(cartService.addProductToCart(userId, productId, qty));
    }

    // 7. Eliminar item
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartItemService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
