-- Usuarios
INSERT INTO usuario (nombre, email, password, rol, nivel, disponible) 
VALUES 
  ('Ana López', 'ana@example.com', '123', 'PROGRAMADOR', 'SENIOR', true),
  ('Carlos Ruiz', 'carlos@example.com', '123', 'DISENADOR', 'JUNIOR', true),
  ('Marta García', 'marta@example.com', '123', 'TESTER', 'SENIOR', false),
  ('Luis Torres', 'luis@example.com', '123', 'LIDER', 'SENIOR', true);

-- Tareas
INSERT INTO tarea (titulo, descripcion, estado, prioridad, rol_requerido, fecha_creacion, usuario_id)
VALUES 
  ('Fix Login', 'Corregir error en autenticación', 'EN_PROGRESO', 'ALTA', 'PROGRAMADOR', CURRENT_TIMESTAMP, 1),
  ('Diseñar Dashboard', 'Crear mockups para nueva UI', 'PENDIENTE', 'MEDIA', 'DISENADOR', CURRENT_TIMESTAMP, 2),
  ('Test API Pagos', 'Pruebas de endpoints /payments', 'PENDIENTE', 'ALTA', 'TESTER', CURRENT_TIMESTAMP, NULL);

-- Eventos sociales
INSERT INTO evento_social (titulo, descripcion, fecha, tipo)
VALUES 
  ('Cumpleaños de Ana', 'Celebración con pastel en el área común', CURRENT_DATE + INTERVAL '3 days', 'CUMPLEANOS'),
  ('Reunión de Sprint', 'Revisión de objetivos en sala 2', CURRENT_DATE + INTERVAL '1 day', 'REUNION'),
  ('Taller de Docker', 'Capacitación para devs', CURRENT_DATE + INTERVAL '5 days', 'CAPACITACION');