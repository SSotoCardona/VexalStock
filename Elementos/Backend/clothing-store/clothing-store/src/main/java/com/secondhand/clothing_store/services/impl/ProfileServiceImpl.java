package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Profile;
import com.secondhand.clothing_store.repositories.ProfileRepository;
import com.secondhand.clothing_store.services.IProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements IProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public Profile getByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
    }

    @Override
    public Profile updateProfile(Long userId, Profile updatedProfile) {
        Profile existing = getByUserId(userId);
        existing.setFirstName(updatedProfile.getFirstName());
        existing.setLastName(updatedProfile.getLastName());
        existing.setAddress(updatedProfile.getAddress());
        existing.setPhoneNumber(updatedProfile.getPhoneNumber());
        return profileRepository.save(existing);
    }
}
