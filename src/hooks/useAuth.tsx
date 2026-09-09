'use client';

import { useState, useEffect, useCallback, ReactNode, createContext, useContext } from 'react';
import { User } from '@/lib/types';
import { supabase, getSession, getCurrentUser, getUserData } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, nombre: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const { user: authUser, error: sessionError } = await getCurrentUser();

        if (sessionError) {
          setUser(null);
          return;
        }

        if (authUser) {
          // Obtener datos del usuario de la BD
          const { data: userData, error: userError } = await getUserData(authUser.id);

          if (userError) {
            throw userError;
          }

          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError(err instanceof Error ? err.message : 'Error checking session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await getUserData(session.user.id);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        const { data: userData, error: userError } = await getUserData(data.user.id);

        if (userError) {
          throw userError;
        }

        if (userData) {
          setUser(userData);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, nombre: string) => {
    try {
      setLoading(true);
      setError(null);

      // Crear usuario en Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Crear usuario en BD con rol 'student' por defecto
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              nombre,
              rol: 'student',
            },
          ])
          .select()
          .single();

        if (userError) {
          throw userError;
        }

        if (userData) {
          setUser(userData);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
