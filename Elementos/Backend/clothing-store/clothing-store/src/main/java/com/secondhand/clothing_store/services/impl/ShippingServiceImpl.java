package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Shipping;
import com.secondhand.clothing_store.repositories.ShippingRepository;
import com.secondhand.clothing_store.services.IShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShippingServiceImpl implements IShippingService {
    @Autowired
    private ShippingRepository shippingRepository;

    @Override
    public Shipping updateStatus(Long shippingId, String status) {
        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new RuntimeException("Shipping record not found"));
        shipping.setStatus(status);
        return shippingRepository.save(shipping);
    }

    @Override
    public Shipping getByOrderId(Long orderId) {
        return null;
    }


}
