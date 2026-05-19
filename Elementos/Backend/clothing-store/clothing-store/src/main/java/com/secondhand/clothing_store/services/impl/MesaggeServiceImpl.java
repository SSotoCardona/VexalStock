package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Mesagge;
import com.secondhand.clothing_store.repositories.MesaggeRepository;
import com.secondhand.clothing_store.services.IMesaggeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaggeServiceImpl implements IMesaggeService {
    @Autowired
    private MesaggeRepository messageRepository;

    @Override
    public Mesagge sendMessage(Mesagge message) {
        return null;
    }

    @Override
    public List<Mesagge> getChatHistory(Long user1, Long user2) {
        return messageRepository.findAll();
    }
}
