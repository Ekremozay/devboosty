const LEMONFOX_API_BASE = 'https://api.lemonfox.ai/v1';

export function getLemonfoxApiKey() {
  const apiKey = process.env.LEMONFOX_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('LEMONFOX_API_KEY is not configured on the server.');
  }

  return apiKey;
}

export function getLemonfoxUrl(path: string) {
  return `${LEMONFOX_API_BASE}${path}`;
}

export async function parseLemonfoxError(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const body = await response.json() as { error?: { message?: string } | string; message?: string };

      if (typeof body.error === 'string') {
        return body.error;
      }

      if (body.error && typeof body.error === 'object' && body.error.message) {
        return body.error.message;
      }

      if (body.message) {
        return body.message;
      }
    }

    const text = await response.text();
    if (text.trim()) {
      return text.trim();
    }
  } catch {
    return 'The LemonfoxAI request failed.';
  }

  return 'The LemonfoxAI request failed.';
}
