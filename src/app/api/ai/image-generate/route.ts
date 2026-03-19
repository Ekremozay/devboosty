import { NextResponse } from 'next/server';
import { getLemonfoxApiKey, getLemonfoxUrl, parseLemonfoxError } from '@/lib/lemonfox';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const apiKey = getLemonfoxApiKey();
    const body = await request.json();

    const response = await fetch(getLemonfoxUrl('/images/generations'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: body.prompt,
        negative_prompt: body.negative_prompt || undefined,
        n: body.n ?? 1,
        response_format: body.response_format || 'url',
        size: body.size || '1024x1024',
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
      { error: error instanceof Error ? error.message : 'Image generation request failed.' },
      { status: 500 },
    );
  }
}
