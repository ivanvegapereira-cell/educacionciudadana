'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              📚 Plataforma Educativa
            </Link>

            {user && (
              <div className="hidden md:flex gap-6">
                {user.rol === 'teacher' && (
                  <>
                    <Link href="/teacher/dashboard" className="text-gray-600 hover:text-gray-900">
                      Dashboard
                    </Link>
                    <Link href="/teacher/activities" className="text-gray-600 hover:text-gray-900">
                      Actividades
                    </Link>
                    <Link href="/teacher/ai-assistant" className="text-gray-600 hover:text-gray-900">
                      Asistente IA
                    </Link>
                    <Link href="/teacher/analytics" className="text-gray-600 hover:text-gray-900">
                      Análisis
                    </Link>
                  </>
                )}

                {user.rol === 'student' && (
                  <>
                    <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                      Mis Quiz
                    </Link>
                    <Link href="/student/ranking" className="text-gray-600 hover:text-gray-900">
                      Ranking
                    </Link>
                    <Link href="/student/messages" className="text-gray-600 hover:text-gray-900">
                      Mensajes
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.nombre}</span>
                <Button size="sm" variant="secondary" onClick={handleLogout} disabled={loading}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="secondary">
                    Ingresar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
