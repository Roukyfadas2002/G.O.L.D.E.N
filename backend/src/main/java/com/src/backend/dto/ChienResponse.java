package com.src.backend.dto;

import java.time.LocalDateTime;

public class ChienResponse {
    private Long idChien;
    private String nom;
    private String race;
    private int age;
    private Long idPere;
    private Long idMere;
    private LocalDateTime createdAt;

    // ✅ Constructeur
    public ChienResponse(Long idChien, String nom, String race, int age, Long idPere, Long idMere, LocalDateTime createdAt) {
        this.idChien = idChien;
        this.nom = nom;
        this.race = race;
        this.age = age;
        this.idPere = idPere;
        this.idMere = idMere;
        this.createdAt = createdAt;
    }

    // ✅ Getters & Setters
    public Long getIdChien() {
        return idChien;
    }

    public String getNom() {
        return nom;
    }

    public String getRace() {
        return race;
    }

    public int getAge() {
        return age;
    }

    public Long getIdPere() {
        return idPere;
    }

    public Long getIdMere() {
        return idMere;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
