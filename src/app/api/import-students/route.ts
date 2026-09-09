import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, nombre, curso, teacher_id } = await request.json();

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Crear usuario en Supabase Auth
      const tempPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const authResponse = await supabase.auth.signUp({
        email,
        password: tempPassword,
      });

      if (authResponse.error) {
        return NextResponse.json(
          { error: `Auth error: ${authResponse.error.message}` },
          { status: 400 }
        );
      }

      userId = authResponse.data.user?.id || '';

      // Crear usuario en BD
      const { error: userError } = await supabase.from('users').insert([
        {
          id: userId,
          email,
          nombre,
          rol: 'student',
        },
      ]);

      if (userError) {
        return NextResponse.json(
          { error: `User creation error: ${userError.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: { userId, email, nombre },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error importing student:', error);
    return NextResponse.json(
      { error: 'Error importing student' },
      { status: 500 }
    );
  }
}
