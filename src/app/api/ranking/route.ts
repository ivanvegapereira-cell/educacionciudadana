import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const claseId = searchParams.get('clase_id');

    if (!claseId) {
      return NextResponse.json(
        { error: 'clase_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ranking')
      .select('*, users(nombre, email)')
      .eq('clase_id', claseId)
      .order('puntuacion_total', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: 'Error fetching ranking' },
      { status: 500 }
    );
  }
}
