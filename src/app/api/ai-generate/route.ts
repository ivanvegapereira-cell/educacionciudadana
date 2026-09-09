import { NextRequest, NextResponse } from 'next/server';
import { generarPreguntasIA } from '@/lib/claude-api';

export async function POST(request: NextRequest) {
  try {
    const { tema, cantidad = 5, nivel = 'intermedio' } = await request.json();

    if (!tema || typeof tema !== 'string') {
      return NextResponse.json(
        { error: 'El tema es requerido' },
        { status: 400 }
      );
    }

    const preguntas = await generarPreguntasIA(tema, cantidad, nivel);

    return NextResponse.json({
      success: true,
      data: preguntas,
    });
  } catch (error) {
    console.error('Error in ai-generate:', error);
    return NextResponse.json(
      { error: 'Error al generar preguntas' },
      { status: 500 }
    );
  }
}
