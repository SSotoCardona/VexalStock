package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Review;
import com.vexalstock.backend.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void findByProductIdShouldReturnReviews() {
        Review review = new Review();
        review.setProductId(99L);

        when(reviewRepository.findByProductId(99L)).thenReturn(List.of(review));

        List<Review> result = reviewService.findByProductId(99L);

        assertEquals(1, result.size());
        assertEquals(99L, result.get(0).getProductId());
        verify(reviewRepository, times(1)).findByProductId(99L);
    }

    @Test
    void saveShouldDelegateToRepository() {
        Review review = new Review();
        review.setProductId(99L);

        when(reviewRepository.save(review)).thenReturn(review);

        Review saved = reviewService.save(review);

        assertNotNull(saved);
        assertEquals(99L, saved.getProductId());
        verify(reviewRepository, times(1)).save(review);
    }

    @Test
    void deleteShouldRemoveReviewById() {
        reviewService.delete(42L);

        verify(reviewRepository, times(1)).deleteById(42L);
    }
}
