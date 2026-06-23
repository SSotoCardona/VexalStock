package com.vexalstock.backend.controller;

import com.vexalstock.backend.model.Review;
import com.vexalstock.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<Review> getReviews(@RequestParam(required = false) Long productId,
                                   @RequestParam(required = false) String sellerEmail) {
        if (productId != null) {
            return reviewService.findByProductId(productId);
        }
        if (sellerEmail != null) {
            return reviewService.findBySellerEmail(sellerEmail);
        }
        return reviewService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable @NonNull Long id) {
        return reviewService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Review createReview(@RequestBody @NonNull Review review) {
        return reviewService.save(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable @NonNull Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
