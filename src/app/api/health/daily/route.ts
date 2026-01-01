import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import {
  getDailyHealth,
  getLatestDailyHealth,
  setConversationMemory,
  getConversationMemory,
  setDailyHealth,
  type DailyHealth
} from '@/lib/kv-store';

export const runtime = 'nodejs';

type DailyHealthPayload = {
  date: string;
  metrics: Record<string, number | string | null>;
  source?: string;
  includeInMemory?: boolean;
};

function formatHealthSummary(entry: DailyHealth) {
  const parts = Object.entries(entry.metrics)
    .map(([key, value]) => `${key}: ${value ?? 'n/a'}`)
    .join(', ');
  return `Daily Health ${entry.date}: ${parts}`;
}

export async function GET(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (date) {
    const entry = await getDailyHealth(date);
    if (!entry) {
      return NextResponse.json({ error: 'Daily health not found' }, { status: 404 });
    }
    return NextResponse.json({ entry });
  }

  const latest = await getLatestDailyHealth();
  if (!latest) {
    return NextResponse.json({ error: 'Daily health not found' }, { status: 404 });
  }

  return NextResponse.json({ entry: latest });
}

export async function POST(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = (await req.json().catch(() => null)) as DailyHealthPayload | null;
  if (!body?.date || !body.metrics || typeof body.metrics !== 'object') {
    return NextResponse.json(
      { error: 'date and metrics are required' },
      { status: 400 }
    );
  }

  const entry: DailyHealth = {
    date: body.date,
    metrics: body.metrics,
    source: body.source,
    createdAt: new Date().toISOString()
  };

  await setDailyHealth(entry);

  if (body.includeInMemory) {
    const existing = await getConversationMemory();
    const summary = formatHealthSummary(entry);
    const nextMemory = existing ? `${existing}\n${summary}` : summary;
    await setConversationMemory(nextMemory);
  }

  return NextResponse.json({ stored: true, entry });
}
