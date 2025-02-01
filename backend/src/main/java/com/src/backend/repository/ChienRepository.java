package com.src.backend.repository;

import com.src.backend.model.Chien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChienRepository extends JpaRepository<Chien, Long> {
}
