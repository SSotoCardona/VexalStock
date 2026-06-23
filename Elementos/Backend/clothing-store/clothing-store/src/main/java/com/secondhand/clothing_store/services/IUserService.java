package com.secondhand.clothing_store.services;

import com.secondhand.clothing_store.models.Profile;
import com.secondhand.clothing_store.models.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public interface IUserService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

    User registerUser(User user);
    Optional<User> findByEmail(String email);
    User findById(Long id);

}
