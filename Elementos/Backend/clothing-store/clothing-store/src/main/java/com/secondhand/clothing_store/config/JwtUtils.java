package com.secondhand.clothing_store.config;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    // En producción, esto debería venir de una variable de entorno
    private static final String SECRET_KEY = "my_very_secret_and_long_key_for_second_hand_store_project";
    private static final long EXPIRATION_TIME = 86400000; // 24 horas en milisegundos

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 1. Generar el Token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Extraer Usuario del Token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 3. Validar si el Token es correcto y no ha expirado
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Aquí podrías loguear: "Token inválido o expirado"
            return false;
        }
    }

}
