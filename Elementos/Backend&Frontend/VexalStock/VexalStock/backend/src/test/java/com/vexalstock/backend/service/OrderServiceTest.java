package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Order;
import com.vexalstock.backend.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void saveShouldSetDefaultStatusWhenNull() {
        Order order = new Order();
        order.setBuyerEmail("cliente@example.com");
        order.setStatus(null);

        when(orderRepository.save(order)).thenReturn(order);

        Order saved = orderService.save(order);

        assertNotNull(saved);
        assertEquals("pendiente", saved.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void findByBuyerEmailShouldReturnRelevantOrders() {
        Order order = new Order();
        order.setBuyerEmail("cliente@example.com");

        when(orderRepository.findByBuyerEmail("cliente@example.com")).thenReturn(List.of(order));

        List<Order> result = orderService.findByBuyerEmail("cliente@example.com");

        assertEquals(1, result.size());
        assertEquals("cliente@example.com", result.get(0).getBuyerEmail());
        verify(orderRepository, times(1)).findByBuyerEmail("cliente@example.com");
    }

    @Test
    void deleteShouldRemoveOrderById() {
        orderService.delete(10L);

        verify(orderRepository, times(1)).deleteById(10L);
    }
}
