package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.service.AsignadorTareasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.tareasti_backend.model.Rol;
import com.example.tareasti_backend.model.Prioridad;
import com.example.tareasti_backend.model.EstadoTarea;
import com.example.tareasti_backend.repository.TareaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/leader")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderController {

    private final AsignadorTareasService asignadorTareasService;
    private final TareaRepository tareaRepository;

    public LeaderController(AsignadorTareasService asignadorTareasService, TareaRepository tareaRepository) {
        this.asignadorTareasService = asignadorTareasService;
        this.tareaRepository = tareaRepository;
    }

    @GetMapping("/tasks/pending")
    public ResponseEntity<List<Tarea>> getPendingTasks() {
        List<Tarea> tareas = asignadorTareasService.getTareasPendientes();
        return ResponseEntity.ok(tareas);
    }

    @GetMapping("/workers")
    public ResponseEntity<List<Usuario>> getAllWorkers() {
        List<Usuario> workers = asignadorTareasService.getAllWorkers();
        return ResponseEntity.ok(workers);
    }

    @PostMapping("/tasks/assign-automatic")
    public ResponseEntity<Void> assignTasksAutomatically() {
        asignadorTareasService.asignarTareasAutomaticamente();
        return ResponseEntity.ok().build();
    }

    // Endpoint to get all tasks (pending, in progress, completed)
    @GetMapping("/tasks/all")
    public ResponseEntity<List<Tarea>> getAllTasks() {
        List<Tarea> allTasks = asignadorTareasService.getAllTasks();
        return ResponseEntity.ok(allTasks);
    }

    @PostMapping("/tasks")
    public ResponseEntity<Tarea> createTask(@RequestBody TaskCreationRequest taskRequest) {
        try {
            Tarea nuevaTarea = new Tarea();
            nuevaTarea.setTitulo(taskRequest.getTitulo());
            nuevaTarea.setDescripcion(taskRequest.getDescripcion());
            nuevaTarea.setPrioridad(Prioridad.valueOf(taskRequest.getPrioridad().toUpperCase()));
            nuevaTarea.setRolRequerido(Rol.valueOf(taskRequest.getRolRequerido().toUpperCase()));
            nuevaTarea.setEstado(EstadoTarea.PENDIENTE);

            Tarea tareaGuardada = tareaRepository.save(nuevaTarea);
            return ResponseEntity.ok(tareaGuardada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTO for Task Creation Request
    static class TaskCreationRequest {
        private String titulo;
        private String descripcion;
        private String prioridad;
        private String rolRequerido;

        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        public String getPrioridad() { return prioridad; }
        public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
        public String getRolRequerido() { return rolRequerido; }
        public void setRolRequerido(String rolRequerido) { this.rolRequerido = rolRequerido; }
    }
}