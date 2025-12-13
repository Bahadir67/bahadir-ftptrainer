export type WorkoutType =
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

export type Phase = 'base' | 'build' | 'peak';

export interface WorkoutDetail {
  warmup: string;
  main: string;
  cooldown: string;
  cadence?: string;
  heartRate?: string;
  tips?: string[];
}

export interface StrengthExercise {
  name: string;
  sets: string;
  notes?: string;
}

export interface Workout {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  type: WorkoutType;
  title: string;
  duration: number; // minutes
  tss?: number;
  description: string;
  detail?: WorkoutDetail;
  strengthExercises?: StrengthExercise[];
  myWhooshWorkout?: string;
  phase: Phase;
  week: number;
  isRecoveryWeek: boolean;
}

export interface WeekSummary {
  week: number;
  phase: Phase;
  startDate: string;
  endDate: string;
  targetTSS: number;
  targetHours: number;
  strengthSessions: number;
  isRecoveryWeek: boolean;
  focus: string;
}
