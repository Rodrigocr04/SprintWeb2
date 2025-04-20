package com.example.tareasti_backend.controler;
import com.example.tareasti_backend.model.Usuario;
import com.example.tareasti_backend.model.Rol;
import com.example.tareasti_backend.model.Nivel;
import com.example.tareasti_backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Asegúrate que coincida con tu frontend
public class RegisterControler {

    private final UsuarioRepository usuarioRepository;

    public RegisterControler(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email ya está en uso");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(registerRequest.getNombre());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setPassword(registerRequest.getPassword()); // En producción, hashear la contraseña
        usuario.setRol(Rol.valueOf(registerRequest.getRol()));
        usuario.setNivel(Nivel.valueOf(registerRequest.getNivel()));
        usuario.setDisponible(registerRequest.isDisponible());

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}

// Clase DTO para la request
class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private String rol;
    private String nivel;
    private boolean disponible;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}