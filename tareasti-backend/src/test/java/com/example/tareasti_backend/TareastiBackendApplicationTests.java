package com.example.tareasti_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")  // Usa el perfil de prueba
class TareastiBackendApplicationTests {

    @Test
    void contextLoads() {
        // Test de carga de contexto
    }
}