package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Order;

import java.util.List;

public interface IOrderService {
    Order createOrderFromCart(Long userId);
    List<Order> getHistoryByUser(Long userId);
    Order getOrderById(Long id);
}
