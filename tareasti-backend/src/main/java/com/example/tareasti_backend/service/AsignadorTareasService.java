package com.example.tareasti_backend.service;

import com.example.tareasti_backend.model.*;
import com.example.tareasti_backend.repository.AsignacionTareaRepository;
import com.example.tareasti_backend.repository.TareaRepository;
import com.example.tareasti_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class AsignadorTareasService {
    
    private final UsuarioRepository usuarioRepository;
    private final TareaRepository tareaRepository;
    private final AsignacionTareaRepository asignacionTareaRepository;
    
    public AsignadorTareasService(UsuarioRepository usuarioRepository, TareaRepository tareaRepository, AsignacionTareaRepository asignacionTareaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tareaRepository = tareaRepository;
        this.asignacionTareaRepository = asignacionTareaRepository;
    }
    
    @Transactional
    public void asignarTareasAutomaticamente() {
        List<Tarea> tareasPendientes = tareaRepository.findByEstado(EstadoTarea.PENDIENTE);
        
        for (Tarea tarea : tareasPendientes) {
            Optional<Usuario> usuarioOpt = encontrarUsuarioAdecuado(tarea);
            
            usuarioOpt.ifPresent(usuario -> {
                AsignacionTarea asignacion = new AsignacionTarea();
                asignacion.setTarea(tarea);
                asignacion.setUsuario(usuario);
                asignacion.setFechaAsignacion(LocalDateTime.now());
                asignacion.setComentarios("Asignado automáticamente");
                asignacionTareaRepository.save(asignacion);

                tarea.setAsignadoA(usuario);
                tarea.setEstado(EstadoTarea.EN_PROGRESO);
                tareaRepository.save(tarea);
            });
        }
    }
    
    private Optional<Usuario> encontrarUsuarioAdecuado(Tarea tarea) {
        Rol rolRequerido = tarea.getRolRequerido();
        Prioridad prioridadTarea = tarea.getPrioridad();

        List<Usuario> candidatosBase = usuarioRepository.findByRolAndDisponibleTrue(rolRequerido);

        List<Usuario> candidatosFiltrados = candidatosBase.stream()
            .filter(u -> asignacionTareaRepository.countActiveTasksByUsuarioId(u.getId()) < 4)
            .collect(Collectors.toList());

        if (candidatosFiltrados.isEmpty()) {
            return Optional.empty();
        }

        if (prioridadTarea == Prioridad.ALTA) {
            List<Usuario> seniors = candidatosFiltrados.stream()
                .filter(u -> u.getNivel() == Nivel.SENIOR)
                .collect(Collectors.toList());
            
            if (!seniors.isEmpty()) {
                return seniors.stream()
                    .min(Comparator.comparingInt(u -> asignacionTareaRepository.countActiveTasksByUsuarioId(u.getId())));
            }
        }

        return candidatosFiltrados.stream()
            .min(Comparator.comparingInt(u -> asignacionTareaRepository.countActiveTasksByUsuarioId(u.getId())));
    }

    public List<Tarea> getTareasPendientes() {
        return tareaRepository.findByEstado(EstadoTarea.PENDIENTE);
    }

    public List<Usuario> getAllWorkers() {
        return usuarioRepository.findAll();
    }

    // Method for Leader Dashboard: Get all tasks
    public List<Tarea> getAllTasks() {
        return tareaRepository.findAll();
    }
}