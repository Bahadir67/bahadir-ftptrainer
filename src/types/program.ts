import type { WeekSummary, Workout } from './workout';

export interface Program {
  ftp_current: number;
  ftp_target: number;
  plan_start: string;
  plan_end: string;
  generated_at: string;
  weeks: WeekSummary[];
  workouts: Workout[];
}
