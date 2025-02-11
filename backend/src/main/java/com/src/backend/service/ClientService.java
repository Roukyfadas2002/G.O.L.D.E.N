package com.src.backend.service;

import com.src.backend.model.Client;
import com.src.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // ✅ Récupérer tous les clients
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // ✅ Récupérer un client par ID
    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    // ✅ Ajouter un client
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    // ✅ Modifier un client
    public Optional<Client> updateClient(Long id, Client updatedClient) {
        return clientRepository.findById(id).map(existingClient -> {
            existingClient.setNom(updatedClient.getNom());
            existingClient.setPrenom(updatedClient.getPrenom());
            existingClient.setEmail(updatedClient.getEmail());
            existingClient.setTelephone(updatedClient.getTelephone());
            return clientRepository.save(existingClient);
        });
    }

    // ✅ Supprimer un client
    public boolean deleteClient(Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return true;
        }
        return false;
    }
}