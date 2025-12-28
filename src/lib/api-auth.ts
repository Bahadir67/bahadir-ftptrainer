import { NextResponse } from 'next/server';

const API_KEY_HEADER = 'x-api-key';

function readApiKey(req: Request): string | null {
  const headerKey = req.headers.get(API_KEY_HEADER);
  if (headerKey) {
    return headerKey;
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

export function ensureApiKey(req: Request): NextResponse | null {
  const expected = process.env.FTPTRAINER_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const provided = readApiKey(req);
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
