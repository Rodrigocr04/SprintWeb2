package com.example.tareasti_backend.controler;

import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.model.Rol;
import com.example.tareasti_backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthControler {
    
    private final UsuarioRepository usuarioRepository;
    
    public AuthControler(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Rol rol = Rol.valueOf(loginRequest.getRol().toUpperCase());
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailAndPasswordAndRol(
                loginRequest.getEmail(),
                loginRequest.getPassword(),
                rol
            );
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                return ResponseEntity.ok(new LoginResponse(
                    usuario.getId(),
                    usuario.getNombre(),
                    usuario.getRol().toString(),
                    usuario.getNivel().toString()
                ));
            } else {
                return ResponseEntity.status(401).body("Credenciales inválidas");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Rol no válido");
        }
    }
    
    // Clases DTO internas para request/response
    static class LoginRequest {
        private String email;
        private String password;
        private String rol;
        
        // Getters y Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
    }
    
    static class LoginResponse {
        private Long id;
        private String nombre;
        private String rol;
        private String nivel;
        
        // Constructor
        public LoginResponse(Long id, String nombre, String rol, String nivel) {
            this.id = id;
            this.nombre = nombre;
            this.rol = rol;
            this.nivel = nivel;
        }
        
        // Getters
        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getRol() { return rol; }
        public String getNivel() { return nivel; }
    }
}