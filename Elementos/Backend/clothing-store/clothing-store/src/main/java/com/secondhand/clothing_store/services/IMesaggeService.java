package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Mesagge;

import java.util.List;

public interface IMesaggeService {
    Mesagge sendMessage(Mesagge message);
    List<Mesagge> getChatHistory(Long user1, Long user2);
}
