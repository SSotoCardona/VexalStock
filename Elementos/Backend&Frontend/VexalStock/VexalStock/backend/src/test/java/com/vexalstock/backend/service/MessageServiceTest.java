package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Message;
import com.vexalstock.backend.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageService messageService;

    @Test
    void saveShouldInitializeIsReadFalseWhenNull() {
        Message message = new Message();
        message.setSenderEmail("sender@example.com");
        message.setReceiverEmail("receiver@example.com");
        message.setIsRead(null);

        when(messageRepository.save(message)).thenReturn(message);

        Message saved = messageService.save(message);

        assertNotNull(saved);
        assertFalse(saved.getIsRead());
        verify(messageRepository, times(1)).save(message);
    }

    @Test
    void findUnreadByReceiverEmailShouldReturnUnreadMessages() {
        Message unread = new Message();
        unread.setReceiverEmail("receiver@example.com");
        unread.setIsRead(false);

        when(messageRepository.findByReceiverEmailAndIsReadFalse("receiver@example.com")).thenReturn(List.of(unread));

        List<Message> result = messageService.findUnreadByReceiverEmail("receiver@example.com");

        assertEquals(1, result.size());
        assertFalse(result.get(0).getIsRead());
        verify(messageRepository, times(1)).findByReceiverEmailAndIsReadFalse("receiver@example.com");
    }

    @Test
    void findByIdShouldReturnMessageWhenPresent() {
        Message message = new Message();
        message.setId(5L);

        when(messageRepository.findById(5L)).thenReturn(Optional.of(message));

        Optional<Message> result = messageService.findById(5L);

        assertTrue(result.isPresent());
        assertEquals(5L, result.get().getId());
        verify(messageRepository, times(1)).findById(5L);
    }
}
