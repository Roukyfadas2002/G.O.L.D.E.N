package com.src.backend.controller;

import com.src.backend.dto.ChienResponse;
import com.src.backend.model.Chien;
import com.src.backend.service.ChienService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chiens")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autoriser les requêtes Angular
public class ChienController {

    private final ChienService chienService;

    public ChienController(ChienService chienService) {
        this.chienService = chienService;
    }

    // ✅ Récupérer tous les chiens
    @GetMapping
    public ResponseEntity<List<ChienResponse>> getAllChiens() {
        List<Chien> chiens = chienService.getAllChiens();
        List<ChienResponse> response = chiens.stream()
                .map(chien -> convertToResponse(chien))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Récupérer un chien par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ChienResponse> getChienById(@PathVariable Long id) {
        return chienService.getChienById(id)
                .map(chien -> ResponseEntity.ok(convertToResponse(chien)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Récupérer tous les chiens d'un propriétaire
    @GetMapping("/proprietaire/{idClient}")
    public ResponseEntity<List<ChienResponse>> getChiensByProprietaire(@PathVariable Long idClient) {
        List<Chien> chiens = chienService.getChiensByProprietaire(idClient);
        List<ChienResponse> response = chiens.stream()
                .map(chien -> convertToResponse(chien))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Créer un chien (POST)
    @PostMapping
    public ResponseEntity<ChienResponse> createChien(@RequestBody Chien chien) {
        // 🔹 Récupération des parents avant d'enregistrer
        if (chien.getPere() != null && chien.getPere().getIdChien() != null) {
            chien.setPere(chienService.getChienById(chien.getPere().getIdChien()).orElse(null));
        }
        if (chien.getMere() != null && chien.getMere().getIdChien() != null) {
            chien.setMere(chienService.getChienById(chien.getMere().getIdChien()).orElse(null));
        }

        Chien savedChien = chienService.saveChien(chien);
        return ResponseEntity.ok(convertToResponse(savedChien));
    }

    // ✅ Modifier un chien (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<ChienResponse> updateChien(@PathVariable Long id, @RequestBody Chien updatedChien) {
        Optional<Chien> existingChien = chienService.getChienById(id);
        if (existingChien.isPresent()) {
            Chien chien = existingChien.get();
            chien.setNom(updatedChien.getNom());
            chien.setRace(updatedChien.getRace());
            chien.setDateNaissance(updatedChien.getDateNaissance());

            // 🔹 Récupération des parents pour éviter `null`
            if (updatedChien.getPere() != null && updatedChien.getPere().getIdChien() != null) {
                chien.setPere(chienService.getChienById(updatedChien.getPere().getIdChien()).orElse(null));
            } else {
                chien.setPere(null);
            }

            if (updatedChien.getMere() != null && updatedChien.getMere().getIdChien() != null) {
                chien.setMere(chienService.getChienById(updatedChien.getMere().getIdChien()).orElse(null));
            } else {
                chien.setMere(null);
            }

            Chien savedChien = chienService.saveChien(chien);
            return ResponseEntity.ok(convertToResponse(savedChien));
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Supprimer un chien
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChien(@PathVariable Long id) {
        if (chienService.deleteChien(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Fonction pour convertir `Chien` en `ChienResponse`
    private ChienResponse convertToResponse(Chien chien) {
        return new ChienResponse(
            chien.getIdChien(),
            chien.getNom(),
            chien.getRace(),
            chien.getDateNaissance(),
            chien.getPere() != null ? chien.getPere().getIdChien() : null,
            chien.getMere() != null ? chien.getMere().getIdChien() : null,
            chien.getCreatedAt()
        );
    }
}
