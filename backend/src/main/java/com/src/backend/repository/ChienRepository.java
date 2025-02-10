package com.src.backend.repository;

import com.src.backend.model.Chien;
import com.src.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChienRepository extends JpaRepository<Chien, Long> {

    // ✅ Correction de la requête pour utiliser une relation JPA
    @Query("SELECT c FROM Chien c JOIN ChienProprietaire cp ON c.idChien = cp.chien.idChien WHERE cp.client.idClient = :idClient")
    List<Chien> findChiensByProprietaire(@Param("idClient") Long idClient);
}
