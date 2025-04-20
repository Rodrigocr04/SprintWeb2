package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.EventoSocial;
import com.example.tareasti_backend.repository.EventoSocialRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoSocialControler {
    
    private final EventoSocialRepository eventoSocialRepository;
    
    public EventoSocialControler(EventoSocialRepository eventoSocialRepository) {
        this.eventoSocialRepository = eventoSocialRepository;
    }
    
    @GetMapping
    public List<EventoSocial> obtenerTodos() {
        return eventoSocialRepository.findAll();
    }
    
    @PostMapping
    public EventoSocial crearEvento(@RequestBody EventoSocial evento) {
        return eventoSocialRepository.save(evento);
    }
}