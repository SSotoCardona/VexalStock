package com.secondhand.clothing_store.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shippings")
@Data
public class Shipping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingNumber;
    private String carrier; // e.g., DHL, FedEx
    private String status; // PENDING, SHIPPED, DELIVERED

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
