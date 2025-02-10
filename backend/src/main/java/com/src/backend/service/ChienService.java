package com.src.backend.service;

import com.src.backend.model.Chien;
import com.src.backend.repository.ChienRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChienService {

    private final ChienRepository chienRepository;

    public ChienService(ChienRepository chienRepository) {
        this.chienRepository = chienRepository;
    }

    public List<Chien> getAllChiens() {
        return chienRepository.findAll();
    }

    public Optional<Chien> getChienById(Long id) {
        return chienRepository.findById(id);
    }

    public List<Chien> getChiensByProprietaire(Long idClient) {
        return chienRepository.findChiensByProprietaire(idClient);
    }

    public Chien saveChien(Chien chien) {
        return chienRepository.save(chien);
    }

    public boolean deleteChien(Long id) {
        if (chienRepository.existsById(id)) {
            chienRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
