package com.src.backend.controller;

import com.src.backend.model.Chambre;
import com.src.backend.service.ChambreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chambres")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Permet au front Angular d'accéder au backend
public class ChambreController {

    private final ChambreService chambreService;

    public ChambreController(ChambreService chambreService) {
        this.chambreService = chambreService;
    }

    @GetMapping
    public ResponseEntity<List<Chambre>> getAllChambres() {
        List<Chambre> chambres = chambreService.getAllChambres();
        return ResponseEntity.ok(chambres);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chambre> getChambreById(@PathVariable Long id) {
        Optional<Chambre> chambre = chambreService.getChambreById(id);
        return chambre.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
