import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';

export const runtime = 'nodejs';

function formatInTimeZone(timeZone: string) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('tr-TR', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return formatter.formatToParts(now).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
}

export async function GET(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const { searchParams } = new URL(req.url);
  const timeZone = searchParams.get('tz') ?? 'Europe/Istanbul';

  try {
    const parts = formatInTimeZone(timeZone);
    const date = `${parts.year}-${parts.month}-${parts.day}`;
    const time = `${parts.hour}:${parts.minute}:${parts.second}`;

    return NextResponse.json({
      timeZone,
      date,
      time,
      iso: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid time zone', timeZone },
      { status: 400 }
    );
  }
}
