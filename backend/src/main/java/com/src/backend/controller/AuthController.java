package com.src.backend.controller;

import com.src.backend.dto.LoginRequest;
import com.src.backend.dto.LoginResponse;
import com.src.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise Angular
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 🎯 Endpoint de connexion : `/api/auth/login`
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody(required = true) LoginRequest loginRequest) {
        System.out.println("📡 Tentative de connexion pour : " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            System.out.println("❌ Erreur: Corps de requête invalide !");
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email et mot de passe requis", "", ""));
        }

        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }
}
