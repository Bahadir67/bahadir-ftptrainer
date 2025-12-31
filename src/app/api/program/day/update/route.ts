import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { Workout } from '@/types/workout';

export const runtime = 'nodejs';

type UpdateRequest = {
  date?: string;
  changes?: Partial<Workout>;
};

function mergeWorkout(current: Workout, changes: Partial<Workout>): Workout {
  const mergedDetail = changes.detail
    ? { ...(current.detail ?? {}), ...changes.detail }
    : current.detail;

  return {
    ...current,
    ...changes,
    detail: mergedDetail,
    date: current.date,
  };
}

function normalizeDate(value?: string | null) {
  return value && value.trim().length > 0 ? value : null;
}

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = (await req.json().catch(() => null)) as UpdateRequest | null;
  const date = normalizeDate(body?.date);
  const changes = body?.changes ?? null;

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  if (!changes || Object.keys(changes).length === 0) {
    return NextResponse.json(
      { error: 'changes is required' },
      { status: 400 }
    );
  }

  const program = await getProgram();
  if (!program || !Array.isArray(program.workouts)) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const workoutIndex = program.workouts.findIndex((item) => item.date === date);
  if (workoutIndex === -1) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  const current = program.workouts[workoutIndex];
  const updated = mergeWorkout(current, changes);

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = updated;

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({ updated: true, workout: updated });
}
