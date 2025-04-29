package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.model.Rol;
import com.example.tareasti_backend.model.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByDisponibleTrue();
    List<Usuario> findByRolAndDisponibleTrue(Rol rol);
    List<Usuario> findByNivelAndDisponibleTrue(Nivel nivel);

    // Add method to find available users by rol and nivel
    List<Usuario> findByRolAndNivelAndDisponibleTrue(Rol rol, Nivel nivel);

    // Method to count active tasks for a user (via AsignacionTarea)
    // Note: This requires joining with AsignacionTarea where fechaFinalizacion is null
    @Query("SELECT COUNT(at) FROM AsignacionTarea at WHERE at.usuario.id = :usuarioId AND at.fechaFinalizacion IS NULL")
    int countActiveTasksByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Método para buscar un usuario por su email y contraseña
    Optional<Usuario> findByEmailAndPasswordAndRol(String email, String password, Rol rol);
    // Método para buscar un usuario por su email
    boolean existsByEmail(String email);
}