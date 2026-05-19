package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Mesagge;
import com.secondhand.clothing_store.services.IMesaggeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesagges")
public class MesaggeController {
    @Autowired
    private IMesaggeService mesaggeService;

    // 15. Enviar mensaje
    @PostMapping
    public ResponseEntity<Mesagge> send(@RequestBody Mesagge message) {
        return ResponseEntity.ok(mesaggeService.sendMessage(message));
    }

    // 16. Ver chat entre dos usuarios
    @GetMapping("/chat")
    public ResponseEntity<List<Mesagge>> getChat(@RequestParam Long u1, @RequestParam Long u2) {
        return ResponseEntity.ok(mesaggeService.getChatHistory(u1, u2));
    }

}
