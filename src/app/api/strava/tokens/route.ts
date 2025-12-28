import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { setStravaTokens, type StravaTokens } from '@/lib/kv-store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = await req.json().catch(() => null);
  const tokens = body as StravaTokens | null;

  if (!tokens?.access_token || !tokens?.refresh_token || !tokens?.expires_at) {
    return NextResponse.json(
      { error: 'access_token, refresh_token, expires_at are required' },
      { status: 400 }
    );
  }

  await setStravaTokens(tokens);
  return NextResponse.json({ stored: true });
}
