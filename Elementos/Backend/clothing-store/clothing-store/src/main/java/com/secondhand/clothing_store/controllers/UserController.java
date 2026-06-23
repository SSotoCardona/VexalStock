package com.secondhand.clothing_store.controllers;

import com.secondhand.clothing_store.models.Profile;
import com.secondhand.clothing_store.models.User;
import com.secondhand.clothing_store.services.IProfileService;
import com.secondhand.clothing_store.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private IUserService userService;
    @Autowired
    private IProfileService profileService;

    // 8. Registro
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
    }

    // 9. Ver Perfil
    @GetMapping("/{userId}/profile")
    public ResponseEntity<Profile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getByUserId(userId));
    }
}
