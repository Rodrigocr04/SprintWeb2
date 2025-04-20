package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Tarea;
import com.example.tareasti_backend.model.EstadoTarea;
import com.example.tareasti_backend.repository.TareaRepository;
import com.example.tareasti_backend.service.AsignadorTareasService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaControler {
    
    private final TareaRepository tareaRepository;
    private final AsignadorTareasService asignadorTareasService;
    
    public TareaControler(TareaRepository tareaRepository, AsignadorTareasService asignadorTareasService) {
        this.tareaRepository = tareaRepository;
        this.asignadorTareasService = asignadorTareasService;
    }
    
    @GetMapping
    public List<Tarea> obtenerTodas() {
        return tareaRepository.findAll();
    }
    
    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea tarea) {
        return tareaRepository.save(tarea);
    }
    
    @PostMapping("/asignar-automaticamente")
    public void asignarAutomaticamente() {
        asignadorTareasService.asignarTareasAutomaticamente();
    }
    
    @PatchMapping("/{id}/completar")
    public Tarea marcarCompletada(@PathVariable Long id) {
        Tarea tarea = tareaRepository.findById(id).orElseThrow();
        tarea.setEstado(EstadoTarea.COMPLETADA);
        tarea.setFechaCompletada(LocalDateTime.now());
        return tareaRepository.save(tarea);
    }
}