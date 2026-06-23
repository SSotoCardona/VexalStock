package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Favorite;
import com.vexalstock.backend.repository.FavoriteRepository;
import org.springframework.lang.NonNull;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public List<Favorite> findByUserEmail(String userEmail) {
        return favoriteRepository.findByUserEmail(userEmail);
    }

    public Favorite save(@NonNull Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    public void delete(@NonNull Long id) {
        favoriteRepository.deleteById(id);
    }
}
