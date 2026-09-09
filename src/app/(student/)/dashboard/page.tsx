'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Quiz } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondidos, setRespondidos] = useState<string[]>([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);

      // Obtener cuestionarios publicados
      const res = await fetch('/api/quiz?estado=published');
      if (!res.ok) throw new Error('Error loading quizzes');

      const data = await res.json();
      setQuizzes(data.data || []);

      // Obtener cuales ya respondió el estudiante
      if (user?.id) {
        const respondidosRes = await fetch(`/api/quiz/respondidos?student_id=${user.id}`);
        if (respondidosRes.ok) {
          const respondidosData = await respondidosRes.json();
          setRespondidos(respondidosData.data?.map((r: any) => r.quiz_id) || []);
        }
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Mis Cuestionarios</h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            <p>No hay cuestionarios disponibles en este momento.</p>
            <p className="mt-2">Tu docente pronto asignará actividades.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const yaRespondido = respondidos.includes(quiz.id);

            return (
              <Card key={quiz.id} className={yaRespondido ? 'opacity-75' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{quiz.descripcion}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {quiz.puntos_totales} puntos
                    </span>
                    {quiz.tiempo_limite_minutos && (
                      <span className="text-xs text-gray-500">
                        ⏱️ {quiz.tiempo_limite_minutos} min
                      </span>
                    )}
                  </div>

                  {yaRespondido ? (
                    <div className="rounded-lg bg-green-50 p-3 text-center text-sm text-green-700 border border-green-200">
                      ✓ Ya respondido
                    </div>
                  ) : (
                    <Link href={`/student/quiz/${quiz.id}`}>
                      <Button className="w-full">Responder Cuestionario</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
