import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');
    const estado = searchParams.get('estado');

    let query = supabase.from('quiz').select('*');

    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data, error } = await query.order('fecha_creacion', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Error fetching quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacher_id, titulo, descripcion, puntos_totales, estado = 'draft', tiempo_limite_minutos } = body;

    const { data, error } = await supabase
      .from('quiz')
      .insert([
        {
          teacher_id,
          titulo,
          descripcion,
          puntos_totales,
          estado,
          tiempo_limite_minutos,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Error creating quiz' },
      { status: 500 }
    );
  }
}
