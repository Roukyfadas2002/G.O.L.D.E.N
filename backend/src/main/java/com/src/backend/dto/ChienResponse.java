package com.src.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ChienResponse {
    private Long id;
    private String nom;
    private String race;
    private LocalDate dateNaissance; // ✅ Remplace l'âge par la date de naissance
    private Integer age; // ✅ Calculé dans le DTO
    private Long idPere;
    private Long idMere;
    private LocalDateTime createdAt;

    public ChienResponse(Long id, String nom, String race, LocalDate dateNaissance, Long idPere, Long idMere, LocalDateTime createdAt) {
        this.id = id;
        this.nom = nom;
        this.race = race;
        this.dateNaissance = dateNaissance;
        this.age = (dateNaissance != null) ? LocalDate.now().getYear() - dateNaissance.getYear() : null;
        this.idPere = idPere;
        this.idMere = idMere;
        this.createdAt = createdAt;
    }

    // ✅ Getters
    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getRace() { return race; }
    public LocalDate getDateNaissance() { return dateNaissance; }
    public Integer getAge() { return age; }
    public Long getIdPere() { return idPere; }
    public Long getIdMere() { return idMere; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
