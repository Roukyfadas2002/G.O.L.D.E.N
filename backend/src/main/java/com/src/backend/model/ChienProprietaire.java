package com.src.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chien_proprietaire")
public class ChienProprietaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_chien", nullable = false)
    private Chien chien;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChienProprietaire() {}

    public ChienProprietaire(Chien chien, Client client) {
        this.chien = chien;
        this.client = client;
    }

    public Long getId() { return id; }
    public Chien getChien() { return chien; }
    public Client getClient() { return client; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setChien(Chien chien) { this.chien = chien; }
    public void setClient(Client client) { this.client = client; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
