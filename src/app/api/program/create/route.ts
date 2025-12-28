import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { Program } from '@/types/program';

export const runtime = 'nodejs';

function loadDefaultProgram(): Program {
  const filePath = path.join(process.cwd(), 'public', 'schedule.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Program;
}

export async function POST(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const existing = await getProgram();
  const body = await req.json().catch(() => ({}));
  const force = Boolean(body?.force);

  if (existing && !force) {
    return NextResponse.json(
      { error: 'Program already exists', requires_confirm: true },
      { status: 409 }
    );
  }

  const program = (body?.program as Program | undefined) ?? loadDefaultProgram();
  await setProgram(program);

  return NextResponse.json({ created: true, program });
}
