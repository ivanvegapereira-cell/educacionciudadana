'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessaging } from '@/hooks/useMessaging';
import { ChatBox } from '@/components/messaging/ChatBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function TeacherMessagesPage() {
  const { user } = useAuth();
  const { mensajes, loading, error, enviarMensaje } = useMessaging(user?.id);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [selectedEstudiant, setSelectedEstudiant] = useState<string | null>(null);
  const [mensajeGrupal, setMensajeGrupal] = useState('');
  const [asuntoGrupal, setAsuntoGrupal] = useState('');
  const [sendingGrupal, setSendingGrupal] = useState(false);

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      const res = await fetch('/api/estudiantes');
      if (res.ok) {
        const data = await res.json();
        setEstudiantes(data.data || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleSendGrupale = async () => {
    if (!mensajeGrupal.trim()) return;

    try {
      setSendingGrupal(true);
      // Enviar a todos los estudiantes
      for (const estudiante of estudiantes) {
        await enviarMensaje(estudiante.id, mensajeGrupal, asuntoGrupal);
      }
      setMensajeGrupal('');
      setAsuntoGrupal('');
      alert(`✓ Mensaje enviado a ${estudiantes.length} estudiantes`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSendingGrupal(false);
    }
  };

  const estudianteSeleccionado = estudiantes.find((e) => e.id === selectedEstudiant);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Mensajería</h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedEstudiant(null)}
          className={`px-4 py-2 font-medium transition ${
            selectedEstudiant === null
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📢 Mensaje Grupal
        </button>
        <button
          onClick={() => {
            if (estudiantes.length > 0) setSelectedEstudiant(estudiantes[0].id);
          }}
          className={`px-4 py-2 font-medium transition ${
            selectedEstudiant !== null
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          💬 Mensaje Individual
        </button>
      </div>

      {/* Mensaje Grupal */}
      {selectedEstudiant === null && (
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enviar a Toda la Clase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Destinatarios: <span className="font-bold text-blue-600">{estudiantes.length} estudiantes</span>
                </label>
              </div>

              <Input
                label="Asunto"
                value={asuntoGrupal}
                onChange={(e) => setAsuntoGrupal(e.target.value)}
                placeholder="Ej: Recordatorio sobre quiz"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mensaje</label>
                <textarea
                  value={mensajeGrupal}
                  onChange={(e) => setMensajeGrupal(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  rows={6}
                />
              </div>

              <Button
                onClick={handleSendGrupale}
                loading={sendingGrupal}
                disabled={!mensajeGrupal.trim()}
                className="w-full"
              >
                Enviar a Todos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consejos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>✓ Los mensajes se entregan instantáneamente</p>
              <p>✓ Los estudiantes recibirán notificaciones</p>
              <p>✓ Se guardan automáticamente en el historial</p>
              <p>✓ Puedes usar asuntos para organizar</p>
              <p>💡 Usa mensajes grupales para anuncios</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensaje Individual */}
      {selectedEstudiant !== null && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Lista de estudiantes */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estudiantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {estudiantes.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => setSelectedEstudiant(est.id)}
                    className={`w-full text-left rounded-lg p-3 transition ${
                      selectedEstudiant === est.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900">{est.nombre}</p>
                    <p className="text-xs text-gray-500">{est.email}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="md:col-span-2">
            <ChatBox
              mensajes={mensajes.filter(
                (m) =>
                  (m.sender_id === selectedEstudiant && m.receiver_id === user?.id) ||
                  (m.sender_id === user?.id && m.receiver_id === selectedEstudiant)
              )}
              loading={loading}
              onSendMessage={(contenido, asunto) =>
                enviarMensaje(selectedEstudiant, contenido, asunto)
              }
              currentUserId={user?.id}
              recipientName={estudianteSeleccionado?.nombre || 'Estudiante'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
