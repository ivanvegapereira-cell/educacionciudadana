'use client';

import React, { useState } from 'react';
import { Mensaje } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ChatBoxProps {
  mensajes: Mensaje[];
  loading: boolean;
  onSendMessage: (contenido: string, asunto?: string) => Promise<any>;
  currentUserId?: string;
  recipientName?: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  mensajes,
  loading,
  onSendMessage,
  currentUserId,
  recipientName = 'Usuario',
}) => {
  const [contenido, setContenido] = useState('');
  const [asunto, setAsunto] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!contenido.trim()) return;

    try {
      setSending(true);
      await onSendMessage(contenido, asunto || 'Sin asunto');
      setContenido('');
      setAsunto('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Conversación con {recipientName}</h3>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-2" />
              <p>Cargando mensajes...</p>
            </div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">No hay mensajes aún</p>
          </div>
        ) : (
          mensajes.map((msg) => {
            const esDelUsuario = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${esDelUsuario ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    esDelUsuario
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.asunto && (
                    <p className="text-xs font-semibold opacity-75">{msg.asunto}</p>
                  )}
                  <p className="text-sm">{msg.contenido}</p>
                  <p className="mt-1 text-xs opacity-60">
                    {new Date(msg.fecha_envio).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
        <Input
          placeholder="Asunto (opcional)"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
        <div className="flex gap-2">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSend();
              }
            }}
            placeholder="Escribe tu mensaje... (Ctrl+Enter para enviar)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            loading={sending}
            disabled={!contenido.trim() || sending}
            className="self-end"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};
