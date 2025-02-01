package com.src.backend.service;

import com.src.backend.model.Chien;
import com.src.backend.repository.ChienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChienService {
    @Autowired
    private ChienRepository chienRepository;

    public List<Chien> getAllChiens() {
        return chienRepository.findAll();
    }
}
