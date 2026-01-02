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
  timeOfDay: 'morning' | 'afternoon';
  metrics: Record<string, number | null>;
  source?: string;
  includeInMemory?: boolean;
};

const HEALTH_METRIC_KEYS = new Set([
  'steps',
  'calories',
  'nutritionCalories',
  'distance',
  'restingHr',
  'avgHr',
  'maxHr',
  'hrv',
  'sleepHours',
  'sleepAvgHr',
  'weight',
  'bodyFat',
  'vo2Max',
  'spo2',
  'exerciseDuration',
  'avgSpeed',
  'avgPower',
  'energyScore',
  'bodyBattery'
]);

function validateMetrics(metrics: DailyHealthPayload['metrics']) {
  if (metrics === null || typeof metrics !== 'object' || Array.isArray(metrics)) {
    return { valid: false, error: 'metrics must be an object' as const };
  }

  const invalidKeys = Object.keys(metrics).filter((key) => !HEALTH_METRIC_KEYS.has(key));
  if (invalidKeys.length > 0) {
    return { valid: false, error: `unsupported metrics: ${invalidKeys.join(', ')}` as const };
  }

  const invalidValues = Object.entries(metrics).filter(([, value]) => {
    if (value === null) {
      return false;
    }
    return typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value);
  });
  if (invalidValues.length > 0) {
    return { valid: false, error: 'metrics must be numbers or null' as const };
  }

  return { valid: true as const };
}

function formatHealthSummary(entry: DailyHealth) {
  const parts = Object.entries(entry.metrics)
    .map(([key, value]) => `${key}: ${value ?? 'n/a'}`)
    .join(', ');
  return `Daily Health ${entry.date} (${entry.timeOfDay}): ${parts}`;
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
  if (!body?.date || typeof body.date !== 'string') {
    return NextResponse.json(
      { error: 'date is required' },
      { status: 400 }
    );
  }

  if (!body.timeOfDay || !['morning', 'afternoon'].includes(body.timeOfDay)) {
    return NextResponse.json(
      { error: 'timeOfDay must be morning or afternoon' },
      { status: 400 }
    );
  }

  if (!body.metrics) {
    return NextResponse.json(
      { error: 'metrics is required' },
      { status: 400 }
    );
  }

  if (body.source && typeof body.source !== 'string') {
    return NextResponse.json(
      { error: 'source must be a string' },
      { status: 400 }
    );
  }

  if (body.includeInMemory !== undefined && typeof body.includeInMemory !== 'boolean') {
    return NextResponse.json(
      { error: 'includeInMemory must be a boolean' },
      { status: 400 }
    );
  }

  const metricsValidation = validateMetrics(body.metrics);
  if (!metricsValidation.valid) {
    return NextResponse.json(
      { error: metricsValidation.error },
      { status: 400 }
    );
  }

  const entry: DailyHealth = {
    date: body.date,
    timeOfDay: body.timeOfDay,
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
