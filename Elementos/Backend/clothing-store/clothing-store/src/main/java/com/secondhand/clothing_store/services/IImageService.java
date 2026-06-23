package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Image;

import java.util.List;

public interface IImageService {
    Image addImageToProduct(Image image);
    List<Image> getByProductId(Long productId);
}
