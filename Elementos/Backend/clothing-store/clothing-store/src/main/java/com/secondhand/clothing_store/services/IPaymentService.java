package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Payment;

public  interface IPaymentService  {
    Payment processPayment(Payment payment);
}
