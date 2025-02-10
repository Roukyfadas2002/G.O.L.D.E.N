package com.src.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chien")
public class Chien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idChien;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String race;

    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance; // ✅ Remplacement de `age` par `dateNaissance`

    @ManyToOne
    @JoinColumn(name = "id_pere")
    private Chien pere;

    @ManyToOne
    @JoinColumn(name = "id_mere")
    private Chien mere;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Constructeur par défaut
    public Chien() {}

    // ✅ Getters
    public Long getIdChien() {
        return idChien;
    }

    public String getNom() {
        return nom;
    }

    public String getRace() {
        return race;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public Chien getPere() {
        return pere;
    }

    public Chien getMere() {
        return mere;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ✅ Setters
    public void setIdChien(Long idChien) {
        this.idChien = idChien;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public void setPere(Chien pere) {
        this.pere = pere;
    }

    public void setMere(Chien mere) {
        this.mere = mere;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ✅ Méthode pour calculer l'âge
    public int getAge() {
        return LocalDate.now().getYear() - this.dateNaissance.getYear();
    }
}
