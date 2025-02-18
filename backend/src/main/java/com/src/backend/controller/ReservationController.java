package com.src.backend.controller;

import com.src.backend.model.Reservation;
import com.src.backend.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise Angular
public class ReservationController {

    private final ReservationService reservationService;
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class); // ✅ Ajout du logger

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * ✅ Créer une réservation avec logs détaillés
     */
    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> reservationData) {
        logger.info("📡 Nouvelle tentative de réservation...");

        try {
            Long clientId = Long.parseLong(reservationData.get("clientId").toString());
            Long chambreId = Long.parseLong(reservationData.get("chambreId").toString());
            LocalDate dateDebut = LocalDate.parse(reservationData.get("dateDebut").toString());
            LocalDate dateFin = LocalDate.parse(reservationData.get("dateFin").toString());

            logger.info("✅ Données reçues : clientId={}, chambreId={}, dateDebut={}, dateFin={}", 
                clientId, chambreId, dateDebut, dateFin);

            // 🔥 Vérification des dates
            if (dateDebut.isAfter(dateFin)) {
                logger.warn("❌ Date de début {} est après la date de fin {}", dateDebut, dateFin);
                return ResponseEntity.badRequest().body("❌ La date de début doit être avant la date de fin !");
            }

            Reservation reservation = reservationService.createReservation(clientId, chambreId, dateDebut, dateFin);
            logger.info("✅ Réservation créée avec succès : {}", reservation);

            return ResponseEntity.ok(reservation);

        } catch (Exception e) {
            logger.error("❌ Erreur lors de la création de la réservation : {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("❌ Erreur lors de la réservation: " + e.getMessage());
        }
    }

    /**
     * ✅ Récupère les réservations d'un client donné avec logs
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getReservationsByClient(@PathVariable Long clientId) {
        logger.info("📡 Requête pour récupérer les réservations du client ID={}", clientId);
        
        List<Reservation> reservations = reservationService.getReservationsByClient(clientId);
        
        if (reservations.isEmpty()) {
            logger.warn("⚠️ Aucune réservation trouvée pour le client ID={}", clientId);
            return ResponseEntity.badRequest().body("⚠️ Aucune réservation trouvée pour ce client.");
        }

        logger.info("✅ {} réservations trouvées pour le client ID={}", reservations.size(), clientId);
        return ResponseEntity.ok(reservations);
    }

    /**
     * ✅ Récupère toutes les réservations avec logs
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllReservations() {
        logger.info("📡 Requête pour récupérer toutes les réservations...");

        List<Reservation> reservations = reservationService.getAllReservations();

        if (reservations.isEmpty()) {
            logger.warn("⚠️ Aucune réservation trouvée en base.");
            return ResponseEntity.badRequest().body("⚠️ Aucune réservation enregistrée.");
        }

        logger.info("✅ {} réservations récupérées.", reservations.size());
        return ResponseEntity.ok(reservations);
    }

    /**
     * ✅ Modifier le statut d'une réservation avec logs
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        logger.info("📡 Modification du statut de la réservation ID={} en '{}'", id, newStatus);
        
        reservationService.updateReservationStatus(id, newStatus);

        logger.info("✅ Statut de la réservation ID={} mis à jour avec succès.", id);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ Supprimer une réservation avec logs
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        logger.info("🗑️ Suppression de la réservation ID={}", id);
        
        reservationService.deleteReservation(id);
        
        logger.info("✅ Réservation ID={} supprimée avec succès.", id);
        return ResponseEntity.ok().build();
    }
}