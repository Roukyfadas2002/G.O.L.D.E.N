package com.src.backend.controller;

import com.src.backend.dto.LoginRequest;
import com.src.backend.dto.LoginResponse;
import com.src.backend.model.Client;
import com.src.backend.service.AuthService;
import com.src.backend.service.LogConnexionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise Angular
public class AuthController {

    private final AuthService authService;
    private final LogConnexionService logConnexionService;

    public AuthController(AuthService authService, LogConnexionService logConnexionService) {
        this.authService = authService;
        this.logConnexionService = logConnexionService;
    }

    /**
     * 🎯 Endpoint de connexion : `/api/auth/login`
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println("📡 Tentative de connexion pour : " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            System.out.println("❌ Erreur: Corps de requête invalide !");
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email et mot de passe requis", "", ""));
        }

        LoginResponse response = authService.authenticate(loginRequest);

        // 🔥 Enregistrer la connexion dans les logs
        Optional<Client> clientOpt = authService.getClientByEmail(loginRequest.getEmail());
        if (response.isSuccess() && clientOpt.isPresent()) {
            logConnexionService.enregistrerLog(clientOpt.get(), "Connexion", request);
        } else {
            logConnexionService.enregistrerLog(null, "Échec", request);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * 🎯 Endpoint de déconnexion : `/api/auth/logout`
     */
    @PostMapping("/logout")
public ResponseEntity<String> logout(@RequestBody Map<String, String> payload, HttpServletRequest request) {
    String email = payload.get("email");
    
    Optional<Client> clientOpt = authService.getClientByEmail(email);

    if (clientOpt.isPresent()) {
        logConnexionService.enregistrerLog(clientOpt.get(), "Déconnexion", request);
        return ResponseEntity.ok("Déconnexion réussie");
    } else {
        System.out.println("❌ Erreur : Client non trouvé pour l'email " + email);
        return ResponseEntity.badRequest().body("Erreur : Client introuvable !");
    }
}

    /**
     * 🎯 Endpoint pour récupérer les logs d'un client
     */
    @GetMapping("/logs/{idClient}")
    public ResponseEntity<?> getClientLogs(@PathVariable Long idClient) {
        return ResponseEntity.ok(logConnexionService.getLogsByClient(idClient));
    }
}