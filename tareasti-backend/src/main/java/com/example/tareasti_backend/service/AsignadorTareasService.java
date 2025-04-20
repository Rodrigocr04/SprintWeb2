package com.example.tareasti_backend.service;

import com.example.tareasti_backend.model.*;
import com.example.tareasti_backend.repository.TareaRepository;
import com.example.tareasti_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AsignadorTareasService {
    
    private final UsuarioRepository usuarioRepository;
    private final TareaRepository tareaRepository;
    
    public AsignadorTareasService(UsuarioRepository usuarioRepository, TareaRepository tareaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tareaRepository = tareaRepository;
    }
    
    @Transactional
    public void asignarTareasAutomaticamente() {
        List<Tarea> tareasPendientes = tareaRepository.findByEstado(EstadoTarea.PENDIENTE);
        List<Usuario> usuariosDisponibles = usuarioRepository.findByDisponibleTrue();
        
        tareasPendientes.forEach(tarea -> {
            Optional<Usuario> usuarioOpt = encontrarUsuarioAdecuado(tarea, usuariosDisponibles);
            usuarioOpt.ifPresent(usuario -> {
                tarea.setAsignadoA(usuario);
                tarea.setEstado(EstadoTarea.EN_PROGRESO);
                tareaRepository.save(tarea);
            });
        });
    }
    
    private Optional<Usuario> encontrarUsuarioAdecuado(Tarea tarea, List<Usuario> usuarios) {
        return usuarios.stream()
            .filter(u -> cumpleReglasBasicas(u, tarea))
            .min(Comparator.comparingInt(this::tareasActivas))
            .filter(u -> tareasActivas(u) < 4); // Regla 3: Máximo 4 tareas
    }
    
    private boolean cumpleReglasBasicas(Usuario usuario, Tarea tarea) {
        // Regla 1: Solo trabajadores disponibles
        if (!usuario.isDisponible()) return false;
        
        // Regla 2: Priorizar seniors para tareas críticas
        if (tarea.getPrioridad() == Prioridad.ALTA && usuario.getNivel() != Nivel.SENIOR) {
            return false;
        }
        
        // Coincidencia de rol
        return usuario.getRol() == tarea.getRolRequerido();
    }
    
    private int tareasActivas(Usuario usuario) {
        return tareaRepository.findByAsignadoAId(usuario.getId()).stream()
            .filter(t -> t.getEstado() != EstadoTarea.COMPLETADA)
            .toList()
            .size();
    }
}