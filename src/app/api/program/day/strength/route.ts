import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { StrengthExercise, Workout } from '@/types/workout';

export const runtime = 'nodejs';

type StrengthUpdateBody = {
  date: string;
  title?: string;
  description?: string;
  duration?: number;
  exercises: StrengthExercise[];
};

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = (await req.json().catch(() => null)) as StrengthUpdateBody | null;
  if (!body?.date || !Array.isArray(body.exercises) || body.exercises.length === 0) {
    return NextResponse.json(
      { error: 'date and exercises are required' },
      { status: 400 }
    );
  }

  const program = await getProgram();
  if (!program || !Array.isArray(program.workouts)) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const workoutIndex = program.workouts.findIndex((item) => item.date === body.date);
  if (workoutIndex === -1) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  const current = program.workouts[workoutIndex];
  const updated: Workout = {
    ...current,
    type: current.type.startsWith('strength') ? current.type : 'strength_a',
    title: body.title ?? current.title,
    description: body.description ?? current.description,
    duration: body.duration ?? current.duration,
    strengthExercises: body.exercises,
    tss: current.tss,
  };

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = updated;

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({ updated: true, workout: updated });
}
