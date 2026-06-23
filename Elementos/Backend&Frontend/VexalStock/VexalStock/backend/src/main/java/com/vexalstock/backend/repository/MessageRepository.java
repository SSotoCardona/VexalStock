package com.vexalstock.backend.repository;

import com.vexalstock.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverEmail(String receiverEmail);
    List<Message> findByReceiverEmailAndIsReadFalse(String receiverEmail);
    List<Message> findBySenderEmail(String senderEmail);
}
