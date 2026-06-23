package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Shipping;

public interface IShippingService {
    Shipping updateStatus(Long shippingId, String status);
    Shipping getByOrderId(Long orderId);
}
