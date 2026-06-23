package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Favorite;
import com.vexalstock.backend.repository.FavoriteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void findByUserEmailShouldReturnFavorites() {
        Favorite favorite = new Favorite();
        favorite.setUserEmail("user@example.com");

        when(favoriteRepository.findByUserEmail("user@example.com")).thenReturn(List.of(favorite));

        List<Favorite> result = favoriteService.findByUserEmail("user@example.com");

        assertEquals(1, result.size());
        assertEquals("user@example.com", result.get(0).getUserEmail());
        verify(favoriteRepository, times(1)).findByUserEmail("user@example.com");
    }

    @Test
    void saveShouldDelegateToRepository() {
        Favorite favorite = new Favorite();
        favorite.setUserEmail("user@example.com");

        when(favoriteRepository.save(favorite)).thenReturn(favorite);

        Favorite saved = favoriteService.save(favorite);

        assertNotNull(saved);
        assertEquals("user@example.com", saved.getUserEmail());
        verify(favoriteRepository, times(1)).save(favorite);
    }
}
