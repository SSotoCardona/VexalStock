package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Order;
import com.secondhand.clothing_store.services.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private IOrderService orderService;

    // 10. Crear pedido desde el carrito
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<Order> checkout(@PathVariable Long userId) {
        return new ResponseEntity<>(orderService.createOrderFromCart(userId), HttpStatus.CREATED);
    }

    // 11. Historial de pedidos del usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getHistoryByUser(userId));
    }

    // 12. Detalle de un pedido específico
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
