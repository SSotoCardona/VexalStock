package com.vexalstock.backend.repository;

import com.vexalstock.backend.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserEmail(String userEmail);
    List<Favorite> findByProductId(Long productId);
}
