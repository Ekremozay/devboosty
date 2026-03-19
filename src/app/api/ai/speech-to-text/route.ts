import { NextResponse } from 'next/server';
import { getLemonfoxApiKey, getLemonfoxUrl, parseLemonfoxError } from '@/lib/lemonfox';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const apiKey = getLemonfoxApiKey();
    const form = await request.formData();
    const file = form.get('file');
    const audioUrl = String(form.get('audioUrl') || '').trim();
    const language = String(form.get('language') || '').trim();
    const responseFormat = String(form.get('response_format') || 'json').trim();
    const speakerLabels = String(form.get('speaker_labels') || '').trim();

    if (!(file instanceof File) && !audioUrl) {
      return NextResponse.json({ error: 'Upload an audio file or provide a public audio URL.' }, { status: 400 });
    }

    const upstreamForm = new FormData();

    if (file instanceof File) {
      upstreamForm.append('file', file, file.name);
    } else {
      upstreamForm.append('file', audioUrl);
    }

    if (language) upstreamForm.append('language', language);
    if (responseFormat) upstreamForm.append('response_format', responseFormat);
    if (speakerLabels) upstreamForm.append('speaker_labels', speakerLabels);

    const response = await fetch(getLemonfoxUrl('/audio/transcriptions'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamForm,
    });

    if (!response.ok) {
      const error = await parseLemonfoxError(response);
      return NextResponse.json({ error }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    const text = await response.text();
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Speech-to-text request failed.' },
      { status: 500 },
    );
  }
}
