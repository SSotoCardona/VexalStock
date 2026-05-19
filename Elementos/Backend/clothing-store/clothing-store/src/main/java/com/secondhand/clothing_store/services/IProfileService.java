package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Profile;

public interface IProfileService {
    Profile getByUserId(Long userId);
    Profile updateProfile(Long userId, Profile updatedProfile);
}
