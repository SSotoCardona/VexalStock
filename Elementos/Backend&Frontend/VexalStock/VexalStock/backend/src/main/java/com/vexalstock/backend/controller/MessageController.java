package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.Message;
import com.vexalstock.backend.service.MessageService;

import org.springframework.lang.NonNull;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<Message> getMessages(@RequestParam(required = false) String receiverEmail,
                                     @RequestParam(required = false) String senderEmail,
                                     @RequestParam(required = false) Boolean unreadOnly) {
        if (receiverEmail != null && Boolean.TRUE.equals(unreadOnly)) {
            return messageService.findUnreadByReceiverEmail(receiverEmail);
        }
        if (receiverEmail != null) {
            return messageService.findByReceiverEmail(receiverEmail);
        }
        if (senderEmail != null) {
            return messageService.findBySenderEmail(senderEmail);
        }
        return messageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessage(@PathVariable @NonNull Long id) {
        return messageService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Message sendMessage(@RequestBody @NonNull Message message) {
        return messageService.save(message);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable @NonNull Long id, @RequestBody @NonNull Message message) {
        return messageService.findById(id)
                .map(existing -> {
                    existing.setIsRead(message.getIsRead());
                    return ResponseEntity.ok(messageService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable @NonNull Long id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
