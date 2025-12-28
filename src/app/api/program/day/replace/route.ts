import { NextResponse } from 'next/server';
import { ensureApiKey } from '@/lib/api-auth';
import { getProgram, setProgram } from '@/lib/kv-store';

export const runtime = 'nodejs';

type WorkoutDetail = {
  warmup: string;
  main: string;
  cooldown: string;
  cadence?: string;
  heartRate?: string;
  tips?: string[];
};

function getZwiftRoute(type: string) {
  switch (type) {
    case 'vo2max':
      return 'Watopia: Volcano Circuit';
    case 'threshold':
    case 'sweet_spot':
      return 'Watopia: Tempus Fugit';
    case 'z2_endurance':
      return 'Watopia: Tempus Fugit';
    case 'recovery':
      return 'Watopia: Tick Tock';
    default:
      return undefined;
  }
}

function estimateIF(tss: number, duration: number) {
  const hours = duration / 60;
  if (hours <= 0) return NaN;
  return Math.sqrt(tss / (hours * 100));
}

type WorkoutType =
  | 'rest'
  | 'recovery'
  | 'z2_endurance'
  | 'sweet_spot'
  | 'threshold'
  | 'vo2max'
  | 'over_unders'
  | 'strength_a'
  | 'strength_b'
  | 'strength_maintenance'
  | 'ftp_test'
  | 'race_simulation';

function deriveType(tss: number, duration: number): WorkoutType {
  const intensityFactor = estimateIF(tss, duration);
  if (!Number.isFinite(intensityFactor)) {
    return 'recovery';
  }
  if (intensityFactor < 0.6) return 'recovery';
  if (intensityFactor < 0.85) return 'z2_endurance';
  if (intensityFactor < 0.95) return 'sweet_spot';
  if (intensityFactor < 1.05) return 'threshold';
  return 'vo2max';
}

function buildDetail(type: string, duration: number): WorkoutDetail {
  let warmup = 10;
  let cooldown = 5;
  if (duration < 30) {
    warmup = 5;
    cooldown = 5;
  }
  const mainMinutes = Math.max(10, duration - warmup - cooldown);

  if (type === 'vo2max') {
    return {
      warmup: `${warmup} min easy spin`,
      main: `5x3 min @110-120% FTP, 3 min easy between (total ~${mainMinutes} min)`,
      cooldown: `${cooldown} min easy spin`,
      cadence: '95-105 rpm',
    };
  }

  if (type === 'threshold') {
    return {
      warmup: `${warmup} min progressive`,
      main: `3x10 min @95-100% FTP, 5 min easy between (total ~${mainMinutes} min)`,
      cooldown: `${cooldown} min easy spin`,
      cadence: '90-100 rpm',
    };
  }

  if (type === 'sweet_spot') {
    return {
      warmup: `${warmup} min progressive`,
      main: `3x12 min @88-93% FTP, 4 min easy between (total ~${mainMinutes} min)`,
      cooldown: `${cooldown} min easy spin`,
      cadence: '85-95 rpm',
    };
  }

  if (type === 'z2_endurance') {
    return {
      warmup: `${warmup} min easy`,
      main: `${mainMinutes} min @60-70% FTP steady`,
      cooldown: `${cooldown} min easy`,
      cadence: '80-95 rpm',
    };
  }

  return {
    warmup: `${warmup} min easy`,
    main: `${mainMinutes} min very easy @50-60% FTP`,
    cooldown: `${cooldown} min easy`,
  };
}

export async function PATCH(req: Request) {
  const authResponse = ensureApiKey(req);
  if (authResponse) {
    return authResponse;
  }

  const body = await req.json().catch(() => null);
  const date = body?.date as string | undefined;
  const tss = Number(body?.tss);

  if (!date || !Number.isFinite(tss)) {
    return NextResponse.json(
      { error: 'date and tss are required' },
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
  const duration = Number(body?.duration ?? current.duration);

  if (!Number.isFinite(duration) || duration <= 0) {
    return NextResponse.json(
      { error: 'duration is required if not present in existing workout' },
      { status: 400 }
    );
  }

  const intensityFactor = estimateIF(tss, duration);
  const type = (body?.type as WorkoutType | undefined) ?? deriveType(tss, duration);
  const detail = (body?.detail as WorkoutDetail | undefined) ?? buildDetail(type, duration);
  const title =
    (body?.title as string | undefined) ?? `${type.replace(/_/g, ' ')} ${duration}min`;
  const description =
    (body?.description as string | undefined) ??
    `Auto plan for ${duration} min, target TSS ${tss} (IF ~${Number.isFinite(intensityFactor) ? intensityFactor.toFixed(2) : 'n/a'}).`;
  const myWhooshWorkout =
    (body?.myWhooshWorkout as string | undefined) ??
    getZwiftRoute(type) ??
    current.myWhooshWorkout;

  const updatedWorkouts = [...program.workouts];
  updatedWorkouts[workoutIndex] = {
    ...current,
    type,
    title,
    duration,
    tss,
    description,
    detail,
    myWhooshWorkout,
  };

  await setProgram({ ...program, workouts: updatedWorkouts });

  return NextResponse.json({
    updated: true,
    workout: updatedWorkouts[workoutIndex],
    intensityFactor: Number.isFinite(intensityFactor) ? Number(intensityFactor.toFixed(2)) : null,
  });
}
