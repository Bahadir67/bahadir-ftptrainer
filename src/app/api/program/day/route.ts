import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { Workout } from '@/types/workout';

export const runtime = 'nodejs';

function mergeWorkout(current: Workout, patch: Partial<Workout>): Workout {
  const mergedDetail = patch.detail
    ? { ...(current.detail ?? {}), ...patch.detail }
    : current.detail;

  return {
    ...current,
    ...patch,
    detail: mergedDetail,
  };
}

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = await req.json().catch(() => null);
  const date = body?.date as string | undefined;
  const patch = body?.patch as Partial<Workout> | undefined;
  const replacement = body?.workout as Workout | undefined;

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  if (!patch && !replacement) {
    return NextResponse.json(
      { error: 'patch or workout is required' },
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
  const updated = replacement ? replacement : mergeWorkout(current, patch ?? {});
  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = updated;

  const updatedProgram = {
    ...program,
    workouts: updatedWorkouts,
  };

  await setProgram(updatedProgram);

  return NextResponse.json({ updated: true, workout: updated });
}
