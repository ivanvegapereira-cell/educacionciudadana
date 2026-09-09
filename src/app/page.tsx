'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            📚 Plataforma Educativa Integral
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Una plataforma completa para educación ciudadana con cuestionarios, actividades,
            ranking y asistente IA
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg">Ingresar</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-lg font-semibold">Cuestionarios Interactivos</h3>
            <p className="text-gray-600">
              Crea y responde cuestionarios con múltiples tipos de preguntas
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-lg font-semibold">Asistente IA</h3>
            <p className="text-gray-600">
              Genera preguntas y retroalimentación automática con Claude
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">🏆</div>
            <h3 className="mb-2 text-lg font-semibold">Ranking y Recompensas</h3>
            <p className="text-gray-600">
              Sistema de puntuación con premios canjeables
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-lg font-semibold">Mensajería</h3>
            <p className="text-gray-600">
              Comunicación directa entre docentes y estudiantes
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-lg font-semibold">Analítica Avanzada</h3>
            <p className="text-gray-600">
              Visualiza el progreso académico de tus estudiantes
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 text-4xl">📁</div>
            <h3 className="mb-2 text-lg font-semibold">Historial Completo</h3>
            <p className="text-gray-600">
              Registro detallado de todas las actividades completadas
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado
  if (user.rol === 'teacher') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Bienvenido, {user.nombre}
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/teacher/dashboard">
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Dashboard</h3>
              <p className="text-gray-600">Ver tus cuestionarios y actividades</p>
            </div>
          </Link>

          <Link href="/teacher/activities">
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Crear Actividades</h3>
              <p className="text-gray-600">Cuestionarios, tareas y más</p>
            </div>
          </Link>

          <Link href="/teacher/ai-assistant">
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Asistente IA</h3>
              <p className="text-gray-600">Genera preguntas automáticamente</p>
            </div>
          </Link>

          <Link href="/teacher/analytics">
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Análisis</h3>
              <p className="text-gray-600">Progreso de tus estudiantes</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // Estudiante
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Bienvenido, {user.nombre}
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/student/dashboard">
          <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Mis Cuestionarios</h3>
            <p className="text-gray-600">Responde las actividades asignadas</p>
          </div>
        </Link>

        <Link href="/student/ranking">
          <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Ranking</h3>
            <p className="text-gray-600">Compite con tus compañeros</p>
          </div>
        </Link>

        <Link href="/student/messages">
          <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Mensajes</h3>
            <p className="text-gray-600">Comunicación con tu docente</p>
          </div>
        </Link>

        <Link href="/student/history">
          <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Historial</h3>
            <p className="text-gray-600">Todas tus actividades completadas</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
