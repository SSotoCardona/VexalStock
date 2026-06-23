package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Cart;
import com.secondhand.clothing_store.models.Order;
import com.secondhand.clothing_store.models.OrderItem;
import com.secondhand.clothing_store.repositories.OrderRepository;
import com.secondhand.clothing_store.services.ICartService;
import com.secondhand.clothing_store.services.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ICartService cartService; // Para obtener los productos a comprar

    @Transactional
    @Override
    public Order createOrderFromCart(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        // Convertimos CartItems a OrderItems
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            // REGLA DE ORO: Guardamos el precio actual del producto
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Calculamos el total
        Double total = orderItems.stream()
                .mapToDouble(i -> i.getPriceAtPurchase() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getHistoryByUser(Long userId) {
        return List.of();
    }

    @Override
    public Order getOrderById(Long id) {
        return null;
    }
}
