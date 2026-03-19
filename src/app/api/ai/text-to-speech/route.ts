import { NextResponse } from 'next/server';
import { getLemonfoxApiKey, getLemonfoxUrl, parseLemonfoxError } from '@/lib/lemonfox';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const apiKey = getLemonfoxApiKey();
    const body = await request.json();

    const response = await fetch(getLemonfoxUrl('/audio/speech'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: body.input,
        voice: body.voice,
        language: body.language,
        response_format: body.response_format || 'mp3',
        speed: body.speed ?? 1,
      }),
    });

    if (!response.ok) {
      const error = await parseLemonfoxError(response);
      return NextResponse.json({ error }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') ?? 'audio/mpeg';
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="devboosty-speech.${body.response_format || 'mp3'}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Text-to-speech request failed.' },
      { status: 500 },
    );
  }
}
