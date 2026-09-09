'use client';

import React, { useState, useEffect } from 'react';
import { getQuizzesByTeacher } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Quiz } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadQuizzes();
    }
  }, [user?.id]);

  const loadQuizzes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await getQuizzesByTeacher(user.id);
      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mis Cuestionarios</h1>
        <Link href="/teacher/activities/create">
          <Button>+ Crear Cuestionario</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          <p>No tienes cuestionarios creados aún.</p>
          <p className="mt-2">
            <Link href="/teacher/activities/create" className="text-blue-600 hover:underline">
              Crea tu primer cuestionario
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">{quiz.titulo}</h3>
              <p className="mt-2 text-sm text-gray-600">{quiz.descripcion}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  {quiz.estado}
                </span>
                <span className="text-sm text-gray-500">{quiz.puntos_totales} pts</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm">
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
