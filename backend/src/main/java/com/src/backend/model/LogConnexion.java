package com.src.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_connexion") // ✅ Correspond à la table SQL
public class LogConnexion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log") // ✅ Correspondance exacte avec la BDD
    private Long idLog;

    @ManyToOne
    @JoinColumn(name = "id_client", referencedColumnName = "id_client") // ✅ Correction ici
    private Client client;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "ip_adresse")
    private String ipAdresse;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // ✅ Getters et Setters
    public Long getIdLog() { return idLog; }
    public void setIdLog(Long idLog) { this.idLog = idLog; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getIpAdresse() { return ipAdresse; }
    public void setIpAdresse(String ipAdresse) { this.ipAdresse = ipAdresse; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}