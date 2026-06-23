package com.vexalstock.backend.service;

import com.vexalstock.backend.model.Review;
import com.vexalstock.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> findByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> findBySellerEmail(String sellerEmail) {
        return reviewRepository.findBySellerEmail(sellerEmail);
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public Optional<Review> findById(@NonNull Long id) {
        return reviewRepository.findById(id);
    }

    public Review save(@NonNull Review review) {
        return reviewRepository.save(review);
    }

    public void delete(@NonNull Long id) {
        reviewRepository.deleteById(id);
    }
}
