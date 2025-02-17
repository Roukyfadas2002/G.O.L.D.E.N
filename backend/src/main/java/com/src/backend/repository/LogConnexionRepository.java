package com.src.backend.repository;

import com.src.backend.model.LogConnexion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogConnexionRepository extends JpaRepository<LogConnexion, Long> {
    List<LogConnexion> findByClientIdClient(Long idClient);
}