package com.secondhand.clothing_store.repositories;

import com.secondhand.clothing_store.models.Cart_item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Cart_itemRepository extends JpaRepository<Cart_item, Long> {}

