package com.src.backend.controller;

import com.src.backend.dto.ChienResponse;
import com.src.backend.model.Chien;
import com.src.backend.service.ChienService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chiens")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autoriser les requêtes Angular
public class ChienController {

    private final ChienService chienService;

    public ChienController(ChienService chienService) {
        this.chienService = chienService;
    }

    @GetMapping
    public ResponseEntity<List<ChienResponse>> getAllChiens() {
        List<Chien> chiens = chienService.getAllChiens();

        // ✅ Convertir la liste `Chien` en `ChienResponse`
        List<ChienResponse> response = chiens.stream()
                .map(chien -> new ChienResponse(
                        chien.getIdChien(),
                        chien.getNom(),
                        chien.getRace(),
                        chien.getAge(),
                        chien.getPere() != null ? chien.getPere().getIdChien() : null,
                        chien.getMere() != null ? chien.getMere().getIdChien() : null,
                        chien.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
