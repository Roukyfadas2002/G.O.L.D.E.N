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
                .map(chien -> new ChienResponse(
                        chien.getIdChien(),
                        chien.getNom(),
                        chien.getRace(),
                        chien.getDateNaissance(),
                        chien.getPere() != null ? chien.getPere().getIdChien() : null,
                        chien.getMere() != null ? chien.getMere().getIdChien() : null,
                        chien.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Récupérer un chien par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ChienResponse> getChienById(@PathVariable Long id) {
        Optional<Chien> chien = chienService.getChienById(id);
        return chien.map(c -> ResponseEntity.ok(new ChienResponse(
                c.getIdChien(),
                c.getNom(),
                c.getRace(),
                c.getDateNaissance(),
                c.getPere() != null ? c.getPere().getIdChien() : null,
                c.getMere() != null ? c.getMere().getIdChien() : null,
                c.getCreatedAt()
        ))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Récupérer tous les chiens d'un propriétaire
    @GetMapping("/proprietaire/{idClient}")
    public ResponseEntity<List<ChienResponse>> getChiensByProprietaire(@PathVariable Long idClient) {
        List<Chien> chiens = chienService.getChiensByProprietaire(idClient);
        List<ChienResponse> response = chiens.stream()
                .map(chien -> new ChienResponse(
                        chien.getIdChien(),
                        chien.getNom(),
                        chien.getRace(),
                        chien.getDateNaissance(),
                        chien.getPere() != null ? chien.getPere().getIdChien() : null,
                        chien.getMere() != null ? chien.getMere().getIdChien() : null,
                        chien.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Créer un nouveau chien
    @PostMapping
public ResponseEntity<Chien> createChien(@RequestBody Chien chien) {
    if (chien.getPere() != null && chien.getPere().getIdChien() != null) {
        chien.setPere(chienService.getChienById(chien.getPere().getIdChien()).orElse(null));
    }
    if (chien.getMere() != null && chien.getMere().getIdChien() != null) {
        chien.setMere(chienService.getChienById(chien.getMere().getIdChien()).orElse(null));
    }

    Chien newChien = chienService.saveChien(chien);
    return ResponseEntity.ok(newChien);
}


    // ✅ Modifier un chien
    @PutMapping("/{id}")
public ResponseEntity<Chien> updateChien(@PathVariable Long id, @RequestBody Chien updatedChien) {
    Optional<Chien> existingChien = chienService.getChienById(id);
    if (existingChien.isPresent()) {
        Chien chien = existingChien.get();
        chien.setNom(updatedChien.getNom());
        chien.setRace(updatedChien.getRace());
        chien.setDateNaissance(updatedChien.getDateNaissance());

        // ✅ Correction : Récupérer les parents à partir de leur ID avant d'enregistrer
        chien.setPere(updatedChien.getPere() != null ? chienService.getChienById(updatedChien.getPere().getIdChien()).orElse(null) : null);
        chien.setMere(updatedChien.getMere() != null ? chienService.getChienById(updatedChien.getMere().getIdChien()).orElse(null) : null);

        Chien savedChien = chienService.saveChien(chien);
        return ResponseEntity.ok(savedChien);
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
}
