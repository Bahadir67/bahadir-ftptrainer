// Date utilities
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long'
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { weekday: 'long' });
}

export function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return today.toDateString() === date.toDateString();
}

export function isPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  return date < today;
}

export function isFuture(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  return date > today;
}

// LocalStorage utilities for progress tracking
const STORAGE_KEY = 'ftp_trainer_progress';

export interface ProgressData {
  completedWorkouts: string[];
  ftpValues: { date: string; value: number }[];
  notes: { [date: string]: string };
}

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return { completedWorkouts: [], ftpValues: [{ date: '2025-12-13', value: 220 }], notes: {} };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { completedWorkouts: [], ftpValues: [{ date: '2025-12-13', value: 220 }], notes: {} };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { completedWorkouts: [], ftpValues: [{ date: '2025-12-13', value: 220 }], notes: {} };
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function toggleWorkoutComplete(date: string): void {
  const progress = getProgress();
  const index = progress.completedWorkouts.indexOf(date);

  if (index === -1) {
    progress.completedWorkouts.push(date);
  } else {
    progress.completedWorkouts.splice(index, 1);
  }

  saveProgress(progress);
}

export function isWorkoutCompleted(date: string): boolean {
  const progress = getProgress();
  return progress.completedWorkouts.includes(date);
}

export function addFtpValue(date: string, value: number): void {
  const progress = getProgress();
  progress.ftpValues.push({ date, value });
  saveProgress(progress);
}

export function getLatestFtp(): number {
  const progress = getProgress();
  if (progress.ftpValues.length === 0) return 220;
  return progress.ftpValues[progress.ftpValues.length - 1].value;
}

export function addNote(date: string, note: string): void {
  const progress = getProgress();
  progress.notes[date] = note;
  saveProgress(progress);
}

export function getNote(date: string): string {
  const progress = getProgress();
  return progress.notes[date] || '';
}

// Workout type colors
export function getWorkoutColor(type: string): string {
  const colors: { [key: string]: string } = {
    rest: 'bg-gray-200 text-gray-600',
    recovery: 'bg-green-100 text-green-700',
    z2_endurance: 'bg-blue-100 text-blue-700',
    sweet_spot: 'bg-yellow-100 text-yellow-700',
    threshold: 'bg-orange-100 text-orange-700',
    vo2max: 'bg-red-100 text-red-700',
    over_unders: 'bg-purple-100 text-purple-700',
    strength_a: 'bg-indigo-100 text-indigo-700',
    strength_b: 'bg-indigo-100 text-indigo-700',
    strength_maintenance: 'bg-indigo-50 text-indigo-600',
    ftp_test: 'bg-pink-200 text-pink-800',
    race_simulation: 'bg-amber-100 text-amber-700'
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
}

export function getWorkoutIcon(type: string): string {
  const icons: { [key: string]: string } = {
    rest: '😴',
    recovery: '🔄',
    z2_endurance: '🚴',
    sweet_spot: '💛',
    threshold: '🔥',
    vo2max: '💨',
    over_unders: '📈',
    strength_a: '🏋️',
    strength_b: '🏋️',
    strength_maintenance: '🏋️',
    ftp_test: '🎯',
    race_simulation: '🏁'
  };
  return icons[type] || '🚴';
}

export function getPhaseColor(phase: string): string {
  const colors: { [key: string]: string } = {
    base: 'bg-blue-500',
    build: 'bg-orange-500',
    peak: 'bg-red-500'
  };
  return colors[phase] || 'bg-gray-500';
}

// Calculate progress percentage
export function calculateProgress(completedWorkouts: string[], totalWorkouts: number): number {
  return Math.round((completedWorkouts.length / totalWorkouts) * 100);
}

// Generate ICS calendar file
export function generateICS(workouts: any[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FTP Trainer//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  workouts.forEach(workout => {
    const date = workout.date.replace(/-/g, '');
    const endDate = date; // Same day

    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${date}`);
    lines.push(`DTEND;VALUE=DATE:${date}`);
    lines.push(`SUMMARY:${getWorkoutIcon(workout.type)} ${workout.title}`);
    lines.push(`DESCRIPTION:${workout.description.replace(/\n/g, '\\n')}\\n\\nSüre: ${workout.duration}dk${workout.tss ? '\\nTSS: ' + workout.tss : ''}`);
    lines.push(`CATEGORIES:${workout.phase.toUpperCase()}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(workouts: any[]): void {
  const ics = generateICS(workouts);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ftp_trainer_plan.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
