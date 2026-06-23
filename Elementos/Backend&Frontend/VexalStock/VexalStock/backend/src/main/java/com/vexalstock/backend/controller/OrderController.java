package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.Order;
import com.vexalstock.backend.service.OrderService;

import org.springframework.lang.NonNull;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrders(@RequestParam(required = false) String buyerEmail,
                                 @RequestParam(required = false) String sellerEmail) {
        if (buyerEmail != null) {
            return orderService.findByBuyerEmail(buyerEmail);
        }
        if (sellerEmail != null) {
            return orderService.findBySellerEmail(sellerEmail);
        }
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable @NonNull Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.save(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable @NonNull Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
