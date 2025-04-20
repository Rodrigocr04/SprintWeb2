package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioControler {
    
    private final UsuarioRepository usuarioRepository;
    
    public UsuarioControler(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }
    
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @PatchMapping("/{id}/disponibilidad")
    public Usuario cambiarDisponibilidad(@PathVariable Long id, @RequestParam boolean disponible) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        usuario.setDisponible(disponible);
        return usuarioRepository.save(usuario);
    }
}