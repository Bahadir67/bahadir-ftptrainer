import { workouts, getWorkoutByDate, getWeekSummary } from '@/data/workouts';
import WorkoutDetailClient from './WorkoutDetailClient';

// Generate static params for all workout dates
export function generateStaticParams() {
  return workouts.map((workout) => ({
    date: workout.date,
  }));
}

interface PageProps {
  params: Promise<{ date: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { date } = await params;
  const workout = getWorkoutByDate(date) || null;
  const weekSummary = workout ? getWeekSummary(workout.week) || null : null;

  return (
    <WorkoutDetailClient
      workout={workout}
      weekSummary={weekSummary}
      date={date}
    />
  );
}
