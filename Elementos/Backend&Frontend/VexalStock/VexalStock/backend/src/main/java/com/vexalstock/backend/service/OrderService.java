package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Order;
import com.vexalstock.backend.repository.OrderRepository;

import org.springframework.lang.NonNull;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public List<Order> findByBuyerEmail(String buyerEmail) {
        return orderRepository.findByBuyerEmail(buyerEmail);
    }

    public List<Order> findBySellerEmail(String sellerEmail) {
        return orderRepository.findBySellerEmail(sellerEmail);
    }

    public Optional<Order> findById(@NonNull Long id) {
        return orderRepository.findById(id);
    }

    public Order save(Order order) {
        if (order.getStatus() == null) {
            order.setStatus("pendiente");
        }
        return orderRepository.save(order);
    }

    public void delete(@NonNull Long id) {
        orderRepository.deleteById(id);
    }
}
