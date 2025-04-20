package com.example.tareasti_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titulo;
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private EstadoTarea estado = EstadoTarea.PENDIENTE;
    
    @Enumerated(EnumType.STRING)
    private Prioridad prioridad = Prioridad.MEDIA;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario asignadoA;
    
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private LocalDateTime fechaCompletada;
    
    @Enumerated(EnumType.STRING)
    private Rol rolRequerido;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoTarea getEstado() {
        return estado;
    }

    public void setEstado(EstadoTarea estado) {
        this.estado = estado;
    }

    public Prioridad getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }

    public Usuario getAsignadoA() {
        return asignadoA;
    }

    public void setAsignadoA(Usuario asignadoA) {
        this.asignadoA = asignadoA;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaCompletada() {
        return fechaCompletada;
    }

    public void setFechaCompletada(LocalDateTime fechaCompletada) {
        this.fechaCompletada = fechaCompletada;
    }

    public Rol getRolRequerido() {
        return rolRequerido;
    }

    public void setRolRequerido(Rol rolRequerido) {
        this.rolRequerido = rolRequerido;
    }
}