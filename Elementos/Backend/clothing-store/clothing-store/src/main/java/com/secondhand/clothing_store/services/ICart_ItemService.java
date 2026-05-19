package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Cart_item;

public interface ICart_ItemService {
    void removeItem(Long cartItemId);
    Cart_item updateQuantity(Long cartItemId, Integer quantity);
}
