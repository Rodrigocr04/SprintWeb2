package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.model.EstadoTarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByEstado(EstadoTarea estado);
    List<Tarea> findByAsignadoAId(Long usuarioId);
}