package com.secondhand.clothing_store.services.impl;

import com.secondhand.clothing_store.models.Profile;
import com.secondhand.clothing_store.models.User;
import com.secondhand.clothing_store.repositories.ProfileRepository;
import com.secondhand.clothing_store.repositories.UserRepository;
import com.secondhand.clothing_store.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService, UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole()) // Asegúrate de que no sea null
                .build();
    }
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional // Importante: O se crean ambos o ninguno
    @Override
    public User registerUser(User user) {
        // Encriptamos antes de persistir
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Crear perfil automáticamente (como ya lo teníamos)
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profileRepository.save(profile);

        return savedUser;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public User findById(Long id) {
        return null;
    }
}
