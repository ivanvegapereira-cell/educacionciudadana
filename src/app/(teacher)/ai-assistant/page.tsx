'use client';

import React, { useState } from 'react';
import { generarPreguntasIA } from '@/lib/claude-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AIAssistant() {
  const [tema, setTema] = useState('');
  const [cantidad, setCantidad] = useState(5);
  const [nivel, setNivel] = useState<'basico' | 'intermedio' | 'avanzado'>('intermedio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);

    if (!tema.trim()) {
      setError('Ingresa un tema para generar preguntas');
      return;
    }

    try {
      setLoading(true);
      const preguntas = await generarPreguntasIA(tema, cantidad, nivel);
      console.log('Preguntas generadas:', preguntas);
      alert(`Se generaron ${preguntas.length} preguntas exitosamente`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar preguntas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Asistente IA</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generar Preguntas Automáticamente</CardTitle>
          <CardDescription>
            Usa Claude para generar preguntas sobre cualquier tema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-4"
          >
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <Input
              label="Tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Democracia en Chile, Derechos Humanos, etc."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Cantidad de preguntas</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Nivel de dificultad</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Generar Preguntas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
