import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('ANTHROPIC_API_KEY no está configurada');
}

const anthropic = new Anthropic({ apiKey });

export interface PreguntaGenerada {
  texto: string;
  tipo: 'multiple_choice' | 'verdadero_falso' | 'respuesta_corta' | 'ensayo';
  opciones?: string[];
  respuesta_correcta?: string;
  puntos: number;
}

export async function generarPreguntasIA(
  tema: string,
  cantidad: number = 5,
  nivel: 'basico' | 'intermedio' | 'avanzado' = 'intermedio'
): Promise<PreguntaGenerada[]> {
  const prompt = `
Eres un experto educativo especializado en generar preguntas para educación ciudadana en enseñanza media (Chile).

Genera ${cantidad} preguntas sobre el tema: "${tema}"
Nivel: ${nivel}

Para cada pregunta, proporciona:
1. El texto de la pregunta
2. El tipo (multiple_choice, verdadero_falso, respuesta_corta, ensayo)
3. Para opción múltiple: 4 opciones (incluyendo la correcta)
4. La respuesta correcta
5. Puntos (1-5 según dificultad)

Responde en formato JSON válido como un array de objetos con estructura:
[
  {
    "texto": "...",
    "tipo": "multiple_choice",
    "opciones": ["...", "...", "...", "..."],
    "respuesta_correcta": "...",
    "puntos": 2
  }
]

Las preguntas deben ser pertinentes, rigurosas y alineadas con el currículum nacional chileno.
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extraer JSON de la respuesta
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const preguntas = JSON.parse(jsonMatch[0]) as PreguntaGenerada[];
    return preguntas;
  } catch (error) {
    console.error('Error generando preguntas:', error);
    throw error;
  }
}

export async function generarRetroalimentacionIA(
  pregunta: string,
  respuestaEstudiante: string,
  respuestaCorrecta: string
): Promise<string> {
  const prompt = `
Eres un docente de educación ciudadana evaluando la respuesta de un estudiante.

Pregunta: "${pregunta}"
Respuesta del estudiante: "${respuestaEstudiante}"
Respuesta correcta/esperada: "${respuestaCorrecta}"

Proporciona una retroalimentación breve, constructiva y específica (máximo 150 palabras) que:
1. Indique si la respuesta es correcta o no
2. Señale qué está bien (si hay algo positivo)
3. Indique qué le falta o está incorrecto
4. Sugiera cómo mejorar su comprensión

Sé empático y motivador.
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const feedback =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return feedback;
  } catch (error) {
    console.error('Error generando retroalimentación:', error);
    throw error;
  }
}

export async function generarPuntosEnsayoIA(
  pregunta: string,
  respuestaEstudiante: string,
  criterios: string
): Promise<{ puntos: number; justificacion: string }> {
  const prompt = `
Eres un docente de educación ciudadana evaluando un ensayo de estudiante de media.

Pregunta: "${pregunta}"
Respuesta del estudiante:
"${respuestaEstudiante}"

Criterios de evaluación: ${criterios}

Proporciona:
1. Puntuación (0-10)
2. Justificación breve (máximo 100 palabras)

Responde en JSON: {"puntos": X, "justificacion": "..."}
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const resultado = JSON.parse(jsonMatch[0]);
    return { puntos: resultado.puntos, justificacion: resultado.justificacion };
  } catch (error) {
    console.error('Error evaluando ensayo:', error);
    throw error;
  }
}

export async function generarActividadComplementariaIA(
  tema: string,
  conceptoDebil: string
): Promise<string> {
  const prompt = `
Eres un docente de educación ciudadana diseñando una actividad complementaria.

Tema: "${tema}"
Concepto que necesita refuerzo: "${conceptoDebil}"

Proporciona una actividad práctica, breve y atractiva para estudiantes de 3°/4° medio que:
1. Refuerce el concepto débil
2. Sea práctica y aplicable a la realidad chilena
3. No requiera más de 45 minutos
4. Pueda ser individual o en grupo

Sé creativo pero realista.
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const actividad =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return actividad;
  } catch (error) {
    console.error('Error generando actividad:', error);
    throw error;
  }
}
