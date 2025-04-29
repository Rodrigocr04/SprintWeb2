package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.AsignacionTarea;
import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.repository.AsignacionTareaRepository;
import com.example.tareasti_backend.repository.UsuarioRepository;
import com.example.tareasti_backend.repository.TareaRepository;
import com.example.tareasti_backend.model.EstadoTarea;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerControler {

    private static final Logger log = LoggerFactory.getLogger(WorkerControler.class);

    private final AsignacionTareaRepository asignacionTareaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TareaRepository tareaRepository;

    public WorkerControler(AsignacionTareaRepository asignacionTareaRepository, UsuarioRepository usuarioRepository, TareaRepository tareaRepository) {
        this.asignacionTareaRepository = asignacionTareaRepository;
        this.usuarioRepository = usuarioRepository;
        this.tareaRepository = tareaRepository;
    }

    @GetMapping("/tasks/{userId}")
    public ResponseEntity<List<Tarea>> getActiveTasksByUser(@PathVariable Long userId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(userId);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Usuario usuario = usuarioOpt.get();
        List<AsignacionTarea> activeAssignments = asignacionTareaRepository.findByUsuarioAndFechaFinalizacionIsNull(usuario);
        
        List<Tarea> activeTasks = activeAssignments.stream()
                                    .map(AsignacionTarea::getTarea)
                                    .collect(Collectors.toList());

        return ResponseEntity.ok(activeTasks);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        log.info("Attempting to complete task with ID: {}", taskId);
        List<AsignacionTarea> activeAssignments = asignacionTareaRepository.findByTareaIdAndFechaFinalizacionIsNull(taskId);

        if (activeAssignments.isEmpty()) {
            log.warn("No active assignment found for task ID: {}", taskId);
            Optional<Tarea> tareaOpt = tareaRepository.findById(taskId);
            if (tareaOpt.isPresent() && tareaOpt.get().getEstado() == EstadoTarea.COMPLETADA) {
                 log.warn("Task {} exists but is already completed (no active assignment found).", taskId);
                 return ResponseEntity.badRequest().body("Task already completed");
            }
            return ResponseEntity.notFound().build(); 
        }

        activeAssignments.sort(Comparator.comparing(AsignacionTarea::getFechaAsignacion).reversed());
        AsignacionTarea asignacionToComplete = activeAssignments.get(0);
        
        for (int i = 1; i < activeAssignments.size(); i++) {
            AsignacionTarea oldAssignment = activeAssignments.get(i);
            if (oldAssignment.getFechaFinalizacion() == null) {
                 log.warn("Found older active assignment {} for task {}. Marking as complete.", oldAssignment.getId(), taskId);
                 oldAssignment.setFechaFinalizacion(LocalDateTime.now());
                 oldAssignment.setComentarios("Marked complete due to newer assignment completion.");
                 asignacionTareaRepository.save(oldAssignment);
            }
        }

        Tarea tarea = asignacionToComplete.getTarea();
        log.info("Found most recent active assignment {} for task {} with status {}", asignacionToComplete.getId(), tarea.getId(), tarea.getEstado());

        if (tarea.getEstado() == EstadoTarea.COMPLETADA) {
            log.warn("Task {} is already marked as completed in Tarea table.", taskId);
             if (asignacionToComplete.getFechaFinalizacion() == null) {
                 asignacionToComplete.setFechaFinalizacion(LocalDateTime.now());
                 asignacionTareaRepository.save(asignacionToComplete);
             }
            return ResponseEntity.badRequest().body("Task already completed");
        }

        try {
            asignacionToComplete.setFechaFinalizacion(LocalDateTime.now());
            asignacionTareaRepository.save(asignacionToComplete);
            log.info("Updated AsignacionTarea {} finalization date.", asignacionToComplete.getId());

            tarea.setEstado(EstadoTarea.COMPLETADA);
            tarea.setFechaCompletada(LocalDateTime.now());
            tareaRepository.save(tarea);
            log.info("Updated Tarea {} status to COMPLETADA.", tarea.getId());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error saving changes for task ID: {}", taskId, e);
            return ResponseEntity.internalServerError().body("Error completing task");
        }
    }
}