package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.model.EstadoTarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // Remove incorrect methods for finding by user ID
    // @Query("SELECT t FROM Tarea t WHERE t.asignadoA.id = :usuarioId")
    // List<Tarea> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    // List<Tarea> findByAsignadoA_Id(Long usuarioId);

    // Add method to find tasks by state
    List<Tarea> findByEstado(EstadoTarea estado);
}