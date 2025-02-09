package com.src.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chambre")
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chambre")
    private Long idChambre;

    private String nom;
    private String type;

    @Column(name = "prix_par_nuit")
    private BigDecimal prixParNuit;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Chambre() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getIdChambre() { return idChambre; }
    public void setIdChambre(Long idChambre) { this.idChambre = idChambre; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getPrixParNuit() { return prixParNuit; }
    public void setPrixParNuit(BigDecimal prixParNuit) { this.prixParNuit = prixParNuit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
