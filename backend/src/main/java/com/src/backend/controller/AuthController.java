package com.src.backend.controller;

import com.src.backend.dto.LoginRequest;
import com.src.backend.dto.LoginResponse;
import com.src.backend.model.Client;
import com.src.backend.repository.ClientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise Angular à accéder au backend
public class AuthController {

    private final ClientRepository clientRepository;

    public AuthController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Tentative de connexion : " + loginRequest.getEmail()); // 🔥 LOG pour vérifier l'entrée

        Optional<Client> client = clientRepository.findByEmailAndPassword(
            loginRequest.getEmail(), loginRequest.getPassword()
        );

        if (client.isPresent()) {
            System.out.println("✅ Connexion réussie pour : " + client.get().getEmail());

            return new LoginResponse(
                true, 
                "Connexion réussie", 
                client.get().getRole().getNomRole(), // ✅ Récupère le rôle depuis la relation `role`
                client.get().getEmail() // ✅ Retourne l'email comme username
            );
        } else {
            System.out.println("❌ Connexion échouée pour : " + loginRequest.getEmail());
            return new LoginResponse(false, "Email ou mot de passe incorrect", "", "");
        }
    }
}
