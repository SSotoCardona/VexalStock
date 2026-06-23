package com.vexalstock.backend.repository;

import com.vexalstock.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerEmail(String buyerEmail);
    List<Order> findBySellerEmail(String sellerEmail);
}
