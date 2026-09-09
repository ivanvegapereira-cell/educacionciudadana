import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json({ error: 'student_id required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('respuestas_estudiante')
      .select('quiz_id')
      .eq('student_id', studentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching answered quizzes:', error);
    return NextResponse.json(
      { error: 'Error fetching data' },
      { status: 500 }
    );
  }
}
