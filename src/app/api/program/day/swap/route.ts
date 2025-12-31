import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';
import type { WeekSummary, Workout } from '@/types/workout';

export const runtime = 'nodejs';

type SwapRequest = {
  dateA?: string;
  dateB?: string;
};

function normalizeDate(value?: string | null) {
  return value && value.trim().length > 0 ? value : null;
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function getDayOfWeek(date: string) {
  const day = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    timeZone: 'Europe/Istanbul',
  }).format(new Date(`${date}T12:00:00Z`));

  return day.charAt(0).toUpperCase() + day.slice(1);
}

function findWeekForDate(weeks: WeekSummary[], date: string) {
  const target = parseDate(date).getTime();
  return (
    weeks.find((week) => {
      const start = parseDate(week.startDate).getTime();
      const end = parseDate(week.endDate).getTime();
      return target >= start && target <= end;
    }) ?? null
  );
}

function applyDateMetadata(
  workout: Workout,
  date: string,
  weeks: WeekSummary[]
) {
  const weekSummary = findWeekForDate(weeks, date);
  return {
    ...workout,
    date,
    dayOfWeek: getDayOfWeek(date),
    week: weekSummary?.week ?? workout.week,
    phase: weekSummary?.phase ?? workout.phase,
    isRecoveryWeek: weekSummary?.isRecoveryWeek ?? workout.isRecoveryWeek,
  };
}

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = (await req.json().catch(() => null)) as SwapRequest | null;
  const dateA = normalizeDate(body?.dateA);
  const dateB = normalizeDate(body?.dateB);

  if (!dateA || !dateB) {
    return NextResponse.json(
      { error: 'dateA and dateB are required' },
      { status: 400 }
    );
  }

  if (dateA === dateB) {
    return NextResponse.json(
      { error: 'dateA and dateB must be different' },
      { status: 400 }
    );
  }

  const program = await getProgram();
  if (!program || !Array.isArray(program.workouts)) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const indexA = program.workouts.findIndex((item) => item.date === dateA);
  const indexB = program.workouts.findIndex((item) => item.date === dateB);

  if (indexA === -1 || indexB === -1) {
    return NextResponse.json(
      { error: 'Workout not found for one or both dates' },
      { status: 404 }
    );
  }

  const workoutA = program.workouts[indexA];
  const workoutB = program.workouts[indexB];

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[indexA] = applyDateMetadata(
    workoutB,
    dateA,
    program.weeks
  );
  updatedWorkouts[indexB] = applyDateMetadata(
    workoutA,
    dateB,
    program.weeks
  );

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({
    swapped: true,
    dateA,
    dateB,
    workoutA: updatedWorkouts[indexA],
    workoutB: updatedWorkouts[indexB],
  });
}
