package com.src.backend.service;

import com.src.backend.model.Client;
import com.src.backend.model.Chambre;
import com.src.backend.model.Reservation;
import com.src.backend.repository.ReservationRepository;
import com.src.backend.repository.ClientRepository;
import com.src.backend.repository.ChambreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;
    private final ChambreRepository chambreRepository;

    public ReservationService(ReservationRepository reservationRepository, ClientRepository clientRepository, ChambreRepository chambreRepository) {
        this.reservationRepository = reservationRepository;
        this.clientRepository = clientRepository;
        this.chambreRepository = chambreRepository;
    }

    public Reservation createReservation(Long clientId, Long chambreId, LocalDate dateDebut, LocalDate dateFin) {
        Optional<Client> client = clientRepository.findById(clientId);
        Optional<Chambre> chambre = chambreRepository.findById(chambreId);

        if (client.isEmpty() || chambre.isEmpty()) {
            throw new RuntimeException("Client ou chambre introuvable.");
        }

        Reservation reservation = new Reservation();
        reservation.setClient(client.get());
        reservation.setChambre(chambre.get());
        reservation.setDateDebut(dateDebut);
        reservation.setDateFin(dateFin);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByClient(Long clientId) {
        return reservationRepository.findByClientIdClient(clientId);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * ✅ Mettre à jour le statut d'une réservation
     */
    public void updateReservationStatus(Long id, String newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);
    }

    /**
     * ✅ Supprimer une réservation
     */
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Réservation non trouvée");
        }
        reservationRepository.deleteById(id);
    }
}