import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { Workout } from '@/types/workout';

export const runtime = 'nodejs';

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = await req.json().catch(() => null);
  const date = body?.date as string | undefined;
  const workout = body?.workout as Workout | undefined;

  if (!date || !workout) {
    return NextResponse.json(
      { error: 'date and workout are required' },
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

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = workout;

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({ updated: true, workout });
}
