-- Primero insertar todos los usuarios y obtener sus IDs reales
-- Usuarios PROGRAMADOR
INSERT INTO usuario (nombre, email, password, rol, nivel, disponible) 
VALUES 
('Ana López', 'ana@example.com', '123', 'PROGRAMADOR', 'SENIOR', true),
('Carlos Mendez', 'carlos@example.com', '123', 'PROGRAMADOR', 'JUNIOR', true),
('Luisa Torres', 'luisa@example.com', '123', 'PROGRAMADOR', 'SENIOR', false);

-- Usuarios DISENADOR
INSERT INTO usuario (nombre, email, password, rol, nivel, disponible) 
VALUES 
('Pedro García', 'pedro@example.com', '123', 'DISENADOR', 'SENIOR', true),
('Sofía Ruiz', 'sofia@example.com', '123', 'DISENADOR', 'JUNIOR', true);

-- Usuarios TESTER
INSERT INTO usuario (nombre, email, password, rol, nivel, disponible) 
VALUES 
('Marta Sánchez', 'marta@example.com', '123', 'TESTER', 'SENIOR', true),
('Jorge Díaz', 'jorge@example.com', '123', 'TESTER', 'JUNIOR', false);

-- Usuarios LIDER
INSERT INTO usuario (nombre, email, password, rol, nivel, disponible) 
VALUES 
('Luis Fernández', 'luis@example.com', '123', 'LIDER', 'SENIOR', true);

-- Primero insertar tareas sin asignar (usuario_id NULL)
INSERT INTO tarea (titulo, descripcion, estado, prioridad, rol_requerido, fecha_creacion, usuario_id)
VALUES
('Fix login error', 'Corregir autenticación fallida', 'PENDIENTE', 'ALTA', 'PROGRAMADOR', CURRENT_TIMESTAMP, NULL),
('Implementar API', 'Desarrollar endpoints para usuarios', 'PENDIENTE', 'MEDIA', 'PROGRAMADOR', CURRENT_TIMESTAMP, NULL),
('Optimizar queries', 'Mejorar rendimiento de consultas SQL', 'PENDIENTE', 'BAJA', 'PROGRAMADOR', CURRENT_TIMESTAMP, NULL),
('Diseñar dashboard', 'Crear maquetas para panel principal', 'PENDIENTE', 'ALTA', 'DISENADOR', CURRENT_TIMESTAMP, NULL),
('Actualizar estilo', 'Refrescar look and feel de la app', 'PENDIENTE', 'MEDIA', 'DISENADOR', CURRENT_TIMESTAMP, NULL),
('Probar checkout', 'Verificar flujo de pago completo', 'PENDIENTE', 'ALTA', 'TESTER', CURRENT_TIMESTAMP, NULL),
('Test de carga', 'Ejecutar pruebas de performance', 'PENDIENTE', 'MEDIA', 'TESTER', CURRENT_TIMESTAMP, NULL);

-- Ahora hacer las asignaciones usando subconsultas para obtener IDs correctos
-- Asignaciones completadas
INSERT INTO asignacion_tarea (tarea_id, usuario_id, fecha_asignacion, fecha_finalizacion, comentarios)
VALUES
(
  (SELECT id FROM tarea WHERE titulo = 'Optimizar queries'),
  (SELECT id FROM usuario WHERE email = 'carlos@example.com'),
  '2025-04-01 10:00:00', 
  '2025-04-05 15:30:00', 
  'Tarea completada con éxito'
),
(
  (SELECT id FROM tarea WHERE titulo = 'Test de carga'),
  (SELECT id FROM usuario WHERE email = 'marta@example.com'),
  '2025-04-10 09:15:00', 
  '2025-04-12 11:20:00', 
  'Pruebas exitosas'
);

-- Asignaciones en progreso
INSERT INTO asignacion_tarea (tarea_id, usuario_id, fecha_asignacion, fecha_finalizacion, comentarios)
VALUES
(
  (SELECT id FROM tarea WHERE titulo = 'Implementar API'),
  (SELECT id FROM usuario WHERE email = 'ana@example.com'),
  '2025-04-15 14:00:00', 
  NULL, 
  'En desarrollo'
),
(
  (SELECT id FROM tarea WHERE titulo = 'Actualizar estilo'),
  (SELECT id FROM usuario WHERE email = 'pedro@example.com'),
  '2025-04-16 16:30:00', 
  NULL, 
  'Primeros diseños aprobados'
);

-- Asignaciones pendientes
INSERT INTO asignacion_tarea (tarea_id, usuario_id, fecha_asignacion, fecha_finalizacion, comentarios)
VALUES
(
  (SELECT id FROM tarea WHERE titulo = 'Fix login error'),
  (SELECT id FROM usuario WHERE email = 'ana@example.com'),
  '2025-04-18 08:00:00', 
  NULL, 
  'Urgente - cliente reportó el problema'
),
(
  (SELECT id FROM tarea WHERE titulo = 'Diseñar dashboard'),
  (SELECT id FROM usuario WHERE email = 'sofia@example.com'),
  '2025-04-17 13:45:00', 
  NULL, 
  'Esperando feedback'
);

-- Finalmente actualizar las tareas con las asignaciones actuales
UPDATE tarea SET 
  usuario_id = (SELECT usuario_id FROM asignacion_tarea WHERE tarea_id = tarea.id ORDER BY fecha_asignacion DESC LIMIT 1),
  estado = CASE 
    WHEN fecha_completada IS NOT NULL THEN 'COMPLETADA'
    WHEN usuario_id IS NOT NULL THEN 'EN_PROGRESO'
    ELSE 'PENDIENTE'
  END
WHERE id IN (SELECT tarea_id FROM asignacion_tarea);