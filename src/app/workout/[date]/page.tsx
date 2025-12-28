import fs from 'fs';
import path from 'path';
import { getProgram } from '@/lib/kv-store';
import type { Program } from '@/types/program';
import type { WeekSummary } from '@/types/workout';
import WorkoutDetailClient from './WorkoutDetailClient';

export const dynamic = 'force-dynamic';

function loadDefaultProgram(): Program {
  const filePath = path.join(process.cwd(), 'public', 'schedule.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Program;
}

async function loadProgram(): Promise<Program> {
  const program = await getProgram();
  if (program && Array.isArray(program.workouts)) {
    return program;
  }

  return loadDefaultProgram();
}

interface PageProps {
  params: Promise<{ date: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { date } = await params;
  const program = await loadProgram();
  const workout = program.workouts.find((item) => item.date === date) || null;
  const weekSummary: WeekSummary | null = workout
    ? program.weeks.find((week) => week.week === workout.week) ?? null
    : null;

  return (
    <WorkoutDetailClient
      workout={workout}
      weekSummary={weekSummary}
      date={date}
    />
  );
}
