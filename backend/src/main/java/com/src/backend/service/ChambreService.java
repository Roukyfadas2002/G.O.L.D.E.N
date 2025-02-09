package com.src.backend.service;

import com.src.backend.model.Chambre;
import com.src.backend.repository.ChambreRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChambreService {
    
    private final ChambreRepository chambreRepository;

    public ChambreService(ChambreRepository chambreRepository) {
        this.chambreRepository = chambreRepository;
    }

    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    public Optional<Chambre> getChambreById(Long id) {
        return chambreRepository.findById(id);
    }
}
