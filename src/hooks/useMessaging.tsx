'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Mensaje } from '@/lib/types';

export const useMessaging = (userId: string | undefined) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar mensajes iniciales
  const loadMensajes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('mensajes')
        .select('*, users!sender_id(nombre, email)')
        .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`)
        .order('fecha_envio', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setMensajes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading messages');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!userId) return;

    loadMensajes();

    // Suscribirse a mensajes nuevos
    const channel = supabase
      .channel(`mensajes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          setMensajes((prev) => [payload.new as Mensaje, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadMensajes]);

  const enviarMensaje = useCallback(
    async (receiverId: string | undefined, contenido: string, asunto: string = 'Sin asunto') => {
      if (!userId) return;

      try {
        const { data, error: sendError } = await supabase
          .from('mensajes')
          .insert([
            {
              sender_id: userId,
              receiver_id: receiverId || null,
              asunto,
              contenido,
              tipo: receiverId ? 'individual' : 'grupo',
              leido: false,
            },
          ])
          .select()
          .single();

        if (sendError) throw sendError;

        setMensajes((prev) => [data as Mensaje, ...prev]);
        return { success: true, data };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error sending message';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [userId]
  );

  const marcarComoLeido = useCallback(
    async (mensajeId: string) => {
      try {
        await supabase
          .from('mensajes')
          .update({ leido: true })
          .eq('id', mensajeId);

        setMensajes((prev) =>
          prev.map((m) => (m.id === mensajeId ? { ...m, leido: true } : m))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error marking as read');
      }
    },
    []
  );

  return {
    mensajes,
    loading,
    error,
    enviarMensaje,
    marcarComoLeido,
    recargar: loadMensajes,
  };
};
