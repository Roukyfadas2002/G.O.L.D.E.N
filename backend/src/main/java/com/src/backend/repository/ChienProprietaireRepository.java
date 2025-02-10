package com.src.backend.repository;

import com.src.backend.model.ChienProprietaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChienProprietaireRepository extends JpaRepository<ChienProprietaire, Long> {
}
