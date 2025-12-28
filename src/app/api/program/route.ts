import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram } from '@/lib/kv-store';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const program = await getProgram();
  if (!program) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({ exists: true, program });
}
