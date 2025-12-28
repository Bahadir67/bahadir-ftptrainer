import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { fetchStravaActivities } from '@/lib/strava';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'from and to are required (YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  try {
    const activities = await fetchStravaActivities(from, to);
    return NextResponse.json({ from, to, activities });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
