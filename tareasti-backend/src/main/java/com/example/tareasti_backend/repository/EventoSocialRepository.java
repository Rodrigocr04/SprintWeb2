package com.example.tareasti_backend.repository;

import com.example.tareasti_backend.model.EventoSocial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoSocialRepository extends JpaRepository<EventoSocial, Long> {
    
}