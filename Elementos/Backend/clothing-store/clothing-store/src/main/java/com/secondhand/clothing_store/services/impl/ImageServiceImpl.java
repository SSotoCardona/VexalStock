package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Image;
import com.secondhand.clothing_store.repositories.ImageRepository;
import com.secondhand.clothing_store.services.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageServiceImpl implements IImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image addImageToProduct(Image image) {
        // Aquí podrías agregar lógica para limitar el número de fotos por prenda
        return imageRepository.save(image);
    }

    @Override
    public List<Image> getByProductId(Long productId) {
        return List.of();
    }
}
