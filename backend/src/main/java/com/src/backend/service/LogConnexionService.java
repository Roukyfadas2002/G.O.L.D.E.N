package com.src.backend.service;

import com.src.backend.model.Client;
import com.src.backend.model.LogConnexion;
import com.src.backend.repository.LogConnexionRepository;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class LogConnexionService {
    private final LogConnexionRepository logConnexionRepository;

    public LogConnexionService(LogConnexionRepository logConnexionRepository) {
        this.logConnexionRepository = logConnexionRepository;
    }

    /**
     * 📌 Enregistre un log de connexion
     */
    public void enregistrerLog(Client client, String action, HttpServletRequest request) {
        LogConnexion log = new LogConnexion();
        log.setClient(client);
        log.setAction(action);
        log.setIpAdresse(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));

        logConnexionRepository.save(log);
    }

    /**
     * 📌 Récupère les logs d'un client
     */
    public List<LogConnexion> getLogsByClient(Long idClient) {
        return logConnexionRepository.findByClientIdClient(idClient);
    }
}