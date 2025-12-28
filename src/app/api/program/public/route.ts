import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getProgram } from '@/lib/kv-store';
import type { Program } from '@/types/program';

export const runtime = 'nodejs';

function loadDefaultProgram(): Program {
  const filePath = path.join(process.cwd(), 'public', 'schedule.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Program;
}

export async function GET() {
  const program = await getProgram();
  if (program) {
    return NextResponse.json({ program, source: 'kv' });
  }

  const fallback = loadDefaultProgram();
  return NextResponse.json({ program: fallback, source: 'default' });
}
