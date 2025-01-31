package com.src.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Long idRole;

    @Column(name = "nom_role")
    private String nomRole;

    @Column(name = "description")
    private String description;

    // Getters et Setters
    public Long getIdRole() { return idRole; }
    public void setIdRole(Long idRole) { this.idRole = idRole; }

    public String getNomRole() { return nomRole; }
    public void setNomRole(String nomRole) { this.nomRole = nomRole; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
