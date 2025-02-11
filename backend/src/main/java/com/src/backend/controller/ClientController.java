package com.src.backend.controller;

import com.src.backend.dto.ClientResponse;
import com.src.backend.model.Client;
import com.src.backend.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise les requêtes Angular
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // ✅ Récupérer tous les clients
    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        List<ClientResponse> response = clients.stream()
                .map(client -> new ClientResponse(
                        client.getIdClient(),
                        client.getNom(),
                        client.getPrenom(),
                        client.getEmail(),
                        client.getTelephone(),
                        client.getAdresse(),
                        client.getCreatedAt(), // ✅ Correction : Assure que `createdAt` est bien récupéré
                        client.getRole()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Récupérer un client par ID
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientService.getClientById(id);
        return client.map(c -> ResponseEntity.ok(new ClientResponse(
                c.getIdClient(),
                c.getNom(),
                c.getPrenom(),
                c.getEmail(),
                c.getTelephone(),
                c.getAdresse(),
                c.getCreatedAt(),
                c.getRole()
        ))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Ajouter un client
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@RequestBody Client client) {
        // 🚀 `createdAt` est automatiquement géré via `@PrePersist`
        Client newClient = clientService.saveClient(client);
        ClientResponse response = new ClientResponse(
                newClient.getIdClient(),
                newClient.getNom(),
                newClient.getPrenom(),
                newClient.getEmail(),
                newClient.getTelephone(),
                newClient.getAdresse(),
                newClient.getCreatedAt(),
                newClient.getRole()
        );
        return ResponseEntity.ok(response);
    }

    // ✅ Modifier un client (sans toucher à `createdAt`)
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        Optional<Client> existingClientOpt = clientService.getClientById(id);
        
        if (existingClientOpt.isPresent()) {
            Client client = existingClientOpt.get();
            client.setNom(updatedClient.getNom());
            client.setPrenom(updatedClient.getPrenom());
            client.setEmail(updatedClient.getEmail());
            client.setTelephone(updatedClient.getTelephone());
            client.setAdresse(updatedClient.getAdresse());
            
            // ✅ Mise à jour du mot de passe uniquement si un nouveau est fourni
            if (updatedClient.getPassword() != null && !updatedClient.getPassword().trim().isEmpty()) {
                client.setPassword(updatedClient.getPassword());
            }

            // ✅ Mise à jour du rôle (évite de perdre le rôle actuel si non fourni)
            if (updatedClient.getRole() != null) {
                client.setRole(updatedClient.getRole());
            }

            Client savedClient = clientService.saveClient(client);
            
            // ✅ Conversion en `ClientResponse` pour ne pas exposer le mot de passe
            ClientResponse response = new ClientResponse(
                savedClient.getIdClient(),
                savedClient.getNom(),
                savedClient.getPrenom(),
                savedClient.getEmail(),
                savedClient.getTelephone(),
                savedClient.getAdresse(),
                savedClient.getCreatedAt(),
                savedClient.getRole()
            );

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Supprimer un client
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (clientService.deleteClient(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}