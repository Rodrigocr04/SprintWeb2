package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.repository.TareaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leader")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderController {

    private final TareaRepository tareaRepository;

    public LeaderController(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Tarea>> getAllTasks() {
        List<Tarea> tareas = tareaRepository.findAll();
        return ResponseEntity.ok(tareas);
    }
}