import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY no están configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener sesión del cliente
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// Función para registrar usuario
export async function signUpUser(email: string, password: string, nombre: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
      },
    },
  });
  return { data, error };
}

// Función para iniciar sesión
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Función para cerrar sesión
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Función para obtener usuario actual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Funciones para BD
export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function createUser(userId: string, email: string, nombre: string, rol: 'teacher' | 'student' | 'admin') {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email,
        nombre,
        rol,
      },
    ])
    .select()
    .single();
  return { data, error };
}

export async function getClasesByTeacher(teacherId: string) {
  const { data, error } = await supabase
    .from('clases')
    .select('*')
    .eq('teacher_id', teacherId);
  return { data, error };
}

export async function getQuizzesByTeacher(teacherId: string) {
  const { data, error } = await supabase
    .from('quiz')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('fecha_creacion', { ascending: false });
  return { data, error };
}

export async function getQuizById(quizId: string) {
  const { data, error } = await supabase
    .from('quiz')
    .select('*')
    .eq('id', quizId)
    .single();
  return { data, error };
}

export async function getPreguntasByQuiz(quizId: string) {
  const { data, error } = await supabase
    .from('preguntas')
    .select('*')
    .eq('quiz_id', quizId)
    .order('orden', { ascending: true });
  return { data, error };
}

export async function getRankingByClase(claseId: string) {
  const { data, error } = await supabase
    .from('ranking')
    .select('*, users(nombre, email)')
    .eq('clase_id', claseId)
    .order('puntuacion_total', { ascending: false });
  return { data, error };
}

export async function getMessagesByStudent(studentId: string) {
  const { data, error } = await supabase
    .from('mensajes')
    .select('*, users!sender_id(nombre)')
    .or(`receiver_id.eq.${studentId},clase_id.in(${studentId})`)
    .order('fecha_envio', { ascending: false });
  return { data, error };
}
