package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Payment;
import com.secondhand.clothing_store.repositories.PaymentRepository;
import com.secondhand.clothing_store.services.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements IPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    @Override
    public Payment processPayment(Payment payment) {
        // En un escenario real, aquí llamarías a la pasarela de pago
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
}
