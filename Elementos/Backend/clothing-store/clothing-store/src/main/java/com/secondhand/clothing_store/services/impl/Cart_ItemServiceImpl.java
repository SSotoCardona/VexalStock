package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Cart_item;
import com.secondhand.clothing_store.repositories.Cart_itemRepository;
import com.secondhand.clothing_store.services.ICart_ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Cart_ItemServiceImpl implements ICart_ItemService {
    @Autowired
    private Cart_itemRepository cartItemRepository;

    @Override
    public void removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public Cart_item updateQuantity(Long cartItemId, Integer quantity) {
        Cart_item item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
}
