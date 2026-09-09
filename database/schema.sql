-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clases
CREATE TABLE IF NOT EXISTS clases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  codigo_acceso VARCHAR(20) UNIQUE NOT NULL,
  año INTEGER NOT NULL,
  semestre INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de relación estudiante-clase
CREATE TABLE IF NOT EXISTS estudiante_clase (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clase_id UUID NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
  puntuacion_total DECIMAL(10, 2) DEFAULT 0,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, clase_id)
);

-- Tabla de cuestionarios (quiz)
CREATE TABLE IF NOT EXISTS quiz (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (estado IN ('draft', 'published', 'archived')),
  puntos_totales INTEGER DEFAULT 10,
  tiempo_limite_minutos INTEGER
);

-- Tabla de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('multiple_choice', 'verdadero_falso', 'respuesta_corta', 'ensayo')),
  opciones JSONB, -- JSON con opciones para opción múltiple
  respuesta_correcta TEXT, -- Puede ser string o array JSON
  puntos INTEGER DEFAULT 1,
  orden INTEGER NOT NULL
);

-- Tabla de respuestas de estudiante
CREATE TABLE IF NOT EXISTS respuestas_estudiante (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  respuestas JSONB NOT NULL, -- JSON con respuestas por pregunta
  puntuacion DECIMAL(10, 2),
  tiempo_completado_minutos INTEGER,
  fecha_envio TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'completado' CHECK (estado IN ('completado', 'pendiente_evaluacion')),
  UNIQUE(student_id, quiz_id)
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('tarea', 'proyecto', 'investigacion')),
  fecha_vencimiento DATE,
  puntos_totales INTEGER DEFAULT 10,
  rubrica JSONB, -- JSON con criterios de evaluación
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de entregas de actividades
CREATE TABLE IF NOT EXISTS entregas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  puntuacion DECIMAL(10, 2),
  retroalimentacion TEXT,
  fecha_entrega TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'entregado' CHECK (estado IN ('entregado', 'evaluado', 'revision_pendiente')),
  UNIQUE(student_id, activity_id)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL si es mensaje de grupo
  clase_id UUID REFERENCES clases(id) ON DELETE CASCADE, -- Para mensajes de grupo
  asunto VARCHAR(255),
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  fecha_envio TIMESTAMP DEFAULT NOW(),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('individual', 'grupo'))
);

-- Tabla de ranking
CREATE TABLE IF NOT EXISTS ranking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clase_id UUID NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
  puntuacion_total DECIMAL(10, 2) DEFAULT 0,
  posicion INTEGER,
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, clase_id)
);

-- Tabla de recompensas (premios personalizados)
CREATE TABLE IF NOT EXISTS recompensas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  puntos_necesarios INTEGER NOT NULL,
  icono VARCHAR(255), -- Emoji o URL de imagen
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de canjes de recompensas
CREATE TABLE IF NOT EXISTS recompensas_canje (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recompensa_id UUID NOT NULL REFERENCES recompensas(id) ON DELETE CASCADE,
  fecha_canje TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'canjeado' CHECK (estado IN ('canjeado', 'completado'))
);

-- Tabla de auditoría de actividad
CREATE TABLE IF NOT EXISTS auditoria_actividad (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  accion VARCHAR(255) NOT NULL,
  quiz_id UUID REFERENCES quiz(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES actividades(id) ON DELETE SET NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  detalles JSONB
);

-- Índices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clases_teacher ON clases(teacher_id);
CREATE INDEX idx_estudiante_clase_student ON estudiante_clase(student_id);
CREATE INDEX idx_estudiante_clase_clase ON estudiante_clase(clase_id);
CREATE INDEX idx_quiz_teacher ON quiz(teacher_id);
CREATE INDEX idx_preguntas_quiz ON preguntas(quiz_id);
CREATE INDEX idx_respuestas_student ON respuestas_estudiante(student_id);
CREATE INDEX idx_respuestas_quiz ON respuestas_estudiante(quiz_id);
CREATE INDEX idx_actividades_teacher ON actividades(teacher_id);
CREATE INDEX idx_entregas_student ON entregas(student_id);
CREATE INDEX idx_entregas_activity ON entregas(activity_id);
CREATE INDEX idx_mensajes_sender ON mensajes(sender_id);
CREATE INDEX idx_mensajes_receiver ON mensajes(receiver_id);
CREATE INDEX idx_mensajes_clase ON mensajes(clase_id);
CREATE INDEX idx_ranking_clase ON ranking(clase_id);
CREATE INDEX idx_recompensas_teacher ON recompensas(teacher_id);
CREATE INDEX idx_recompensas_canje_student ON recompensas_canje(student_id);
CREATE INDEX idx_auditoria_student ON auditoria_actividad(student_id);
CREATE INDEX idx_auditoria_teacher ON auditoria_actividad(teacher_id);

-- Comentarios de documentación
COMMENT ON TABLE users IS 'Usuarios del sistema: docentes, estudiantes y administradores';
COMMENT ON TABLE clases IS 'Clases creadas por docentes';
COMMENT ON TABLE quiz IS 'Cuestionarios/evaluaciones';
COMMENT ON TABLE preguntas IS 'Preguntas dentro de los cuestionarios';
COMMENT ON TABLE respuestas_estudiante IS 'Respuestas de estudiantes a los cuestionarios';
COMMENT ON TABLE actividades IS 'Tareas y actividades';
COMMENT ON TABLE entregas IS 'Entregas de actividades por estudiantes';
COMMENT ON TABLE mensajes IS 'Sistema de mensajería entre docente y estudiantes';
COMMENT ON TABLE ranking IS 'Ranking de estudiantes por puntuación';
COMMENT ON TABLE recompensas IS 'Premios/reconocimientos creados por docentes';
COMMENT ON TABLE recompensas_canje IS 'Historial de canjes de recompensas';
COMMENT ON TABLE auditoria_actividad IS 'Log de todas las acciones de usuarios para analítica';
