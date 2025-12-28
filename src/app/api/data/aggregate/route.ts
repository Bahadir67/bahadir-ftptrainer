import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  return NextResponse.json(
    { error: 'Aggregate endpoint disabled. Use /api/data/strava.' },
    { status: 410 }
  );
}
