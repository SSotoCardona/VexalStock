package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.Favorite;
import com.vexalstock.backend.service.FavoriteService;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<Favorite> getFavorites(@RequestParam String userEmail) {
        return favoriteService.findByUserEmail(userEmail);
    }

    @PostMapping
    public Favorite addFavorite(@RequestBody @NonNull Favorite favorite) {
        return favoriteService.save(favorite);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable @NonNull Long id) {
        favoriteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
