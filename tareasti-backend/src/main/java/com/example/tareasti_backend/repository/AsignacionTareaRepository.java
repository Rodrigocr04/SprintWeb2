package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.AsignacionTarea;
import com.example.tareasti_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AsignacionTareaRepository extends JpaRepository<AsignacionTarea, Long> {

    // Find active assignments for a user
    List<AsignacionTarea> findByUsuarioAndFechaFinalizacionIsNull(Usuario usuario);

    // Find all assignments for a user (for history)
    List<AsignacionTarea> findByUsuario(Usuario usuario);

    // Count active assignments (alternative to the one in UsuarioRepository, might be cleaner here)
    @Query("SELECT COUNT(at) FROM AsignacionTarea at WHERE at.usuario.id = :usuarioId AND at.fechaFinalizacion IS NULL")
    int countActiveTasksByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Find active assignment(s) for a specific task
    List<AsignacionTarea> findByTareaIdAndFechaFinalizacionIsNull(Long tareaId);
} 