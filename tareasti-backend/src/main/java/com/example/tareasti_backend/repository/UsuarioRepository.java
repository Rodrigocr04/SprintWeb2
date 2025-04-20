package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.model.Rol;
import com.example.tareasti_backend.model.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByDisponibleTrue();
    List<Usuario> findByRolAndDisponibleTrue(Rol rol);
    List<Usuario> findByNivelAndDisponibleTrue(Nivel nivel);
}