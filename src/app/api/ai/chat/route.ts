import { NextResponse } from 'next/server';
import { getLemonfoxApiKey, getLemonfoxUrl, parseLemonfoxError } from '@/lib/lemonfox';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const apiKey = getLemonfoxApiKey();
    const body = await request.json();

    const response = await fetch(getLemonfoxUrl('/chat/completions'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: body.model || 'llama-70b-chat',
        messages: body.messages,
      }),
    });

    if (!response.ok) {
      const error = await parseLemonfoxError(response);
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat request failed.' },
      { status: 500 },
    );
  }
}
