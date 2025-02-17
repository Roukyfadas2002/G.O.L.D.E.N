package com.src.backend.service;

import com.src.backend.dto.LoginRequest;
import com.src.backend.dto.LoginResponse;
import com.src.backend.model.Client;
import com.src.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final ClientRepository clientRepository;

    public AuthService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * 🔐 Vérifie les identifiants et retourne une réponse adaptée.
     */
    public LoginResponse authenticate(LoginRequest loginRequest) {
        Optional<Client> clientOpt = clientRepository.findByEmail(loginRequest.getEmail());

        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();

            // ✅ Vérifie le mot de passe (non hashé pour l’instant)
            if (client.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse(
                    true, 
                    "Connexion réussie", 
                    client.getRole().getNomRole(), // ✅ Rôle depuis la relation `role`
                    client.getEmail()
                );
            }
        }

        return new LoginResponse(false, "Email ou mot de passe incorrect", "", "");
    }

    public Optional<Client> getClientByEmail(String email) {
        String cleanedEmail = email.trim().toLowerCase(); // 🔥 Normalisation
        return clientRepository.findByEmail(cleanedEmail);
    }
}
