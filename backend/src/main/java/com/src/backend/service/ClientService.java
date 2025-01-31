package com.src.backend.service;

import com.src.backend.model.Client;
import com.src.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll(); // ✅ Récupère tous les clients depuis la DB
    }
}
