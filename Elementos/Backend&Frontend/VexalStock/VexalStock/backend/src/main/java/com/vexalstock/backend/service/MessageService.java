package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Message;
import com.vexalstock.backend.repository.MessageRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> findByReceiverEmail(String receiverEmail) {
        return messageRepository.findByReceiverEmail(receiverEmail);
    }

    public List<Message> findUnreadByReceiverEmail(String receiverEmail) {
        return messageRepository.findByReceiverEmailAndIsReadFalse(receiverEmail);
    }

    public List<Message> findBySenderEmail(String senderEmail) {
        return messageRepository.findBySenderEmail(senderEmail);
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Optional<Message> findById(@NonNull Long id) {
        return messageRepository.findById(id);
    }

    public Message save(@NonNull Message message) {
        if (message.getIsRead() == null) {
            message.setIsRead(false);
        }
        return messageRepository.save(message);
    }

    public void delete(@NonNull Long id) {
        messageRepository.deleteById(id);
    }
}
