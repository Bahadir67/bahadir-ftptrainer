import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';

export const runtime = 'nodejs';

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const { searchParams } = new URL(req.url);
  const body = await req.json().catch(() => null);
  const date = (body?.date as string | undefined) ?? searchParams.get('date') ?? undefined;
  const tssValue = body?.tss ?? searchParams.get('tss');
  const tss = Number(tssValue);

  if (!date || !Number.isFinite(tss)) {
    return NextResponse.json(
      { error: 'date and tss are required' },
      { status: 400 }
    );
  }

  const program = await getProgram();
  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const workoutIndex = program.workouts.findIndex((item) => item.date === date);
  if (workoutIndex === -1) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  const current = program.workouts[workoutIndex];
  const updated = { ...current, tss };
  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = updated;

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({ updated: true, workout: updated });
}
