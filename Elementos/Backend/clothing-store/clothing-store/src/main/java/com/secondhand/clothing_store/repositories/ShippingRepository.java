package com.secondhand.clothing_store.repositories;

import com.secondhand.clothing_store.models.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Long> {
    Optional<Shipping> findByTrackingNumber(String trackingNumber);
    List<Shipping> findByStatus(String status);
}
