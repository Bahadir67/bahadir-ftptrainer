'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout } from '@/types/workout';
import {
  formatDateShort,
  isToday,
  isPast,
  getWorkoutColor,
  getWorkoutIcon,
  isWorkoutCompleted,
  toggleWorkoutComplete
} from '@/lib/utils';

interface WorkoutCardProps {
  workout: Workout;
  onToggleComplete?: () => void;
}

export default function WorkoutCard({ workout, onToggleComplete }: WorkoutCardProps) {
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompleted(isWorkoutCompleted(workout.date));
  }, [workout.date]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWorkoutComplete(workout.date);
    setCompleted(!completed);
    onToggleComplete?.();
  };

  const today = isToday(workout.date);
  const past = isPast(workout.date);

  return (
    <Link href={`/workout/${workout.date}/`}>
      <div
        className={`relative p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer
          ${today ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50' : 'bg-white'}
          ${completed && mounted ? 'opacity-75' : ''}
        `}
      >
        {/* Completed Badge */}
        {mounted && completed && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        )}

        {/* Date & Day */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getWorkoutIcon(workout.type)}</span>
            <div>
              <div className="font-medium text-gray-900">{workout.dayOfWeek}</div>
              <div className="text-sm text-gray-500">{formatDateShort(workout.date)}</div>
            </div>
          </div>
          {today && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full animate-pulse">
              BUGÜN
            </span>
          )}
        </div>

        {/* Workout Title */}
        <h3 className="font-semibold text-gray-900 mb-1">{workout.title}</h3>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${getWorkoutColor(workout.type)}`}>
            {workout.type.replace(/_/g, ' ')}
          </span>
          {workout.duration > 0 && (
            <span className="text-xs text-gray-500">{workout.duration} dk</span>
          )}
          {workout.tss && (
            <span className="text-xs text-gray-500">TSS: {workout.tss}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{workout.description}</p>

        {/* Toggle Button */}
        {mounted && (past || today) && (
          <button
            onClick={handleToggle}
            className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition
              ${completed
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            {completed ? 'Tamamlandı İşaretini Kaldır' : '✓ Tamamlandı Olarak İşaretle'}
          </button>
        )}
      </div>
    </Link>
  );
}
