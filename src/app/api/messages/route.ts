import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('mensajes')
      .select('*, users!sender_id(nombre)')
      .or(`receiver_id.eq.${studentId},clase_id.in(${studentId})`)
      .order('fecha_envio', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Error fetching messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sender_id, receiver_id, clase_id, asunto, contenido, tipo } = body;

    const { data, error } = await supabase
      .from('mensajes')
      .insert([
        {
          sender_id,
          receiver_id: receiver_id || null,
          clase_id: clase_id || null,
          asunto,
          contenido,
          tipo,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}
