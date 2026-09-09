'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessaging } from '@/hooks/useMessaging';
import { ChatBox } from '@/components/messaging/ChatBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function StudentMessagesPage() {
  const { user } = useAuth();
  const { mensajes, loading, error, enviarMensaje } = useMessaging(user?.id);
  const [filtro, setFiltro] = useState<'todos' | 'no_leidos'>('todos');

  const mensajesFiltrados = filtro === 'no_leidos'
    ? mensajes.filter((m) => !m.leido && m.receiver_id === user?.id)
    : mensajes;

  const mensajesNoLeidos = mensajes.filter(
    (m) => !m.leido && m.receiver_id === user?.id
  ).length;

  const remitentes = Array.from(
    new Map(
      mensajes.map((m) => [m.sender_id, m])
    ).values()
  ).sort((a, b) => new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Mensajes</h1>
        {mensajesNoLeidos > 0 && (
          <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
            {mensajesNoLeidos} nuevo{mensajesNoLeidos !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Lista de remitentes */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : remitentes.length === 0 ? (
                <p className="text-sm text-gray-500">No hay mensajes aún</p>
              ) : (
                remitentes.map((msg) => (
                  <div
                    key={msg.sender_id}
                    className="rounded-lg border border-gray-200 p-3 hover:bg-blue-50 cursor-pointer transition"
                  >
                    <p className="font-medium text-sm text-gray-900">
                      {'Docente'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.contenido}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.fecha_envio).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div className="md:col-span-2">
          <ChatBox
            mensajes={mensajesFiltrados}
            loading={loading}
            onSendMessage={(contenido, asunto) => enviarMensaje(undefined, contenido, asunto)}
            currentUserId={user?.id}
            recipientName="Docente"
          />
        </div>
      </div>

      {/* Información */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-700">
            💬 <strong>Los mensajes se actualizan en tiempo real.</strong> Cualquier mensaje nuevo aparecerá automáticamente sin necesidad de recargar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
