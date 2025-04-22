package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.repository.TareaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerControler {

    private final TareaRepository tareaRepository;

    public WorkerControler(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    
    @GetMapping("/tasks/{userId}")
    public ResponseEntity<List<Tarea>> getTasksByUser(@PathVariable Long userId) {
        System.out.println("Buscando tareas para usuario ID: " + userId);
        List<Tarea> tareas = tareaRepository.findByAsignadoA_Id(userId);
        System.out.println("Número de tareas encontradas: " + tareas.size());
        return ResponseEntity.ok(tareas);
    }

}