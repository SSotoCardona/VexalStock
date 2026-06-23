package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Image;
import com.secondhand.clothing_store.models.Payment;
import com.secondhand.clothing_store.models.Shipping;
import com.secondhand.clothing_store.services.IImageService;
import com.secondhand.clothing_store.services.IPaymentService;
import com.secondhand.clothing_store.services.IShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logistics")
public class LogisticsController {
    @Autowired
    private IPaymentService paymentService;
    @Autowired
    private IShippingService shippingService;
    @Autowired
    private IImageService imageService;

    // 17. Procesar pago
    @PostMapping("/pay")
    public ResponseEntity<Payment> pay(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.processPayment(payment));
    }

    // 18. Actualizar estado de envío (Admin/Courier)
    @PatchMapping("/shipping/{id}")
    public ResponseEntity<Shipping> updateShipping(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(shippingService.updateStatus(id, status));
    }

    // 19. Añadir imagen a producto
    @PostMapping("/products/images")
    public ResponseEntity<Image> uploadImage(@RequestBody Image img) {
        return ResponseEntity.ok(imageService.addImageToProduct(img));
    }

}
