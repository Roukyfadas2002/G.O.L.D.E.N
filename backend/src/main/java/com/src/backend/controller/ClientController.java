package com.src.backend.controller;

import com.src.backend.dto.ClientResponse;
import com.src.backend.model.Client;
import com.src.backend.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autoriser les requêtes Angular
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        List<Client> clients = clientService.getAllClients();

        // ✅ Convertir la liste `Client` en `ClientResponse` (sans password)
        List<ClientResponse> response = clients.stream()
                .map(client -> new ClientResponse(
                        client.getIdClient(),
                        client.getNom(),
                        client.getPrenom(),
                        client.getEmail(),
                        client.getTelephone(),
                        client.getAdresse(),
                        client.getCreatedAt(),
                        client.getRole()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
