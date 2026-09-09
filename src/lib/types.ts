// Tipos de usuario
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  created_at: string;
  updated_at: string;
}

// Tipos de clase
export interface Clase {
  id: string;
  teacher_id: string;
  nombre: string;
  codigo_acceso: string;
  año: number;
  semestre: number;
  created_at: string;
}

export interface EstudianteClase {
  id: string;
  student_id: string;
  clase_id: string;
  puntuacion_total: number;
  fecha_asignacion: string;
}

// Tipos de quiz
export type PreguntaTipo = 'multiple_choice' | 'verdadero_falso' | 'respuesta_corta' | 'ensayo';

export interface Quiz {
  id: string;
  teacher_id: string;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  estado: 'draft' | 'published' | 'archived';
  puntos_totales: number;
  tiempo_limite_minutos?: number;
}

export interface Pregunta {
  id: string;
  quiz_id: string;
  texto: string;
  tipo: PreguntaTipo;
  opciones?: string[]; // Para multiple choice
  respuesta_correcta?: string | string[];
  puntos: number;
  orden: number;
}

export interface RespuestaEstudiante {
  id: string;
  student_id: string;
  quiz_id: string;
  respuestas: Record<string, any>; // JSON con respuestas por pregunta
  puntuacion: number;
  tiempo_completado_minutos: number;
  fecha_envio: string;
  estado: 'completado' | 'pendiente_evaluacion';
}

// Tipos de actividades
export interface Actividad {
  id: string;
  teacher_id: string;
  titulo: string;
  descripcion: string;
  tipo: 'tarea' | 'proyecto' | 'investigacion';
  fecha_vencimiento: string;
  puntos_totales: number;
  rubrica?: Record<string, any>; // JSON con criterios de evaluación
  created_at: string;
}

export interface Entrega {
  id: string;
  student_id: string;
  activity_id: string;
  contenido: string;
  puntuacion?: number;
  retroalimentacion?: string;
  fecha_entrega: string;
  estado: 'entregado' | 'evaluado' | 'revision_pendiente';
}

// Tipos de mensajes
export interface Mensaje {
  id: string;
  sender_id: string;
  receiver_id?: string; // NULL si es de grupo
  clase_id?: string; // Si es mensaje de grupo
  asunto: string;
  contenido: string;
  leido: boolean;
  fecha_envio: string;
  tipo: 'individual' | 'grupo';
}

// Tipos de ranking
export interface Ranking {
  id: string;
  student_id: string;
  clase_id: string;
  puntuacion_total: number;
  posicion: number;
  actualizado_en: string;
}

// Tipos de recompensas
export interface Recompensa {
  id: string;
  teacher_id: string;
  nombre: string;
  descripcion: string;
  puntos_necesarios: number;
  icono?: string; // Emoji o URL
  disponible: boolean;
  created_at: string;
}

export interface RecompensaCanje {
  id: string;
  student_id: string;
  recompensa_id: string;
  fecha_canje: string;
  estado: 'canjeado' | 'completado';
}

// Tipos para auditoría
export interface AuditoriaActividad {
  id: string;
  student_id?: string;
  teacher_id?: string;
  accion: string;
  quiz_id?: string;
  activity_id?: string;
  fecha: string;
  detalles?: Record<string, any>;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Contexto de usuario autenticado
export interface AuthContext {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}
