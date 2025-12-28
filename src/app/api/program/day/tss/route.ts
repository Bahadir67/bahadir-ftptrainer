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
  const date = searchParams.get('date');
  const tssParam = searchParams.get('tss');

  if (!date || !tssParam) {
    return NextResponse.json(
      { error: 'date and tss query parameters are required' },
      { status: 400 }
    );
  }

  const tss = Number(tssParam);
  if (!Number.isFinite(tss)) {
    return NextResponse.json({ error: 'tss must be a number' }, { status: 400 });
  }

  const program = await getProgram();
  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const workoutIndex = program.workouts.findIndex((item) => item.date === date);
  if (workoutIndex === -1) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = {
    ...updatedWorkouts[workoutIndex],
    tss,
  };

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({ updated: true, date, tss });
}
