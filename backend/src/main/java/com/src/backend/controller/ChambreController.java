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

    @PostMapping
    public ResponseEntity<Chambre> createChambre(@RequestBody Chambre chambre) {
        Chambre savedChambre = chambreService.saveChambre(chambre);
        return ResponseEntity.ok(savedChambre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chambre> updateChambre(@PathVariable Long id, @RequestBody Chambre chambreDetails) {
        Optional<Chambre> optionalChambre = chambreService.getChambreById(id);
        if (optionalChambre.isPresent()) {
            Chambre chambre = optionalChambre.get();
            chambre.setNom(chambreDetails.getNom());
            chambre.setType(chambreDetails.getType());
            chambre.setPrixParNuit(chambreDetails.getPrixParNuit());
            Chambre updatedChambre = chambreService.saveChambre(chambre);
            return ResponseEntity.ok(updatedChambre);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
    if (chambreService.getChambreById(id).isPresent()) {
        chambreService.deleteChambre(id);
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
}

}
