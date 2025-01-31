package com.src.backend.dto;

import com.src.backend.model.Role;
import java.time.LocalDateTime;

public class ClientResponse {
    private Long idClient;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private LocalDateTime createdAt;
    private String roleName; // ✅ Affiche uniquement le nom du rôle

    // Constructeur avec `Client`
    public ClientResponse(Long idClient, String nom, String prenom, String email, String telephone, String adresse, LocalDateTime createdAt, Role role) {
        this.idClient = idClient;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.adresse = adresse;
        this.createdAt = createdAt;
        this.roleName = role != null ? role.getNomRole() : "Inconnu"; // ✅ Evite un `NullPointerException`
    }

    // Getters uniquement (pas de setters pour éviter les modifications)
    public Long getIdClient() { return idClient; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getTelephone() { return telephone; }
    public String getAdresse() { return adresse; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getRoleName() { return roleName; }
}
