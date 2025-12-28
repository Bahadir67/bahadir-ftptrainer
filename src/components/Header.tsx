'use client';

import { useState, useEffect } from 'react';
import { getLatestFtp, getProgress, calculateProgress, downloadICS } from '@/lib/utils';
import type { Workout } from '@/types/workout';

interface HeaderProps {
  workouts: Workout[];
  ftpTarget: number;
  totalWeeks?: number;
}

export default function Header({ workouts, ftpTarget, totalWeeks }: HeaderProps) {
  const [currentFtp, setCurrentFtp] = useState(220);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentFtp(getLatestFtp());
    const progressData = getProgress();
    setProgress(calculateProgress(progressData.completedWorkouts, workouts.length));
  }, [workouts]);

  const progressToTarget = Math.round(((currentFtp - 220) / (ftpTarget - 220)) * 100);

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="h-20 animate-pulse bg-gray-100 rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">?? FTP Trainer</h1>
            <p className="text-sm text-gray-500">
              {totalWeeks ?? 12} Hafta {ftpTarget}W+ Plan
            </p>
          </div>
          <button
            onClick={() => downloadICS(workouts)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            ?? Takvime Ekle
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentFtp}W</div>
            <div className="text-xs text-gray-500">Gncel FTP</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{ftpTarget}W</div>
            <div className="text-xs text-gray-500">Hedef FTP</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{progress}%</div>
            <div className="text-xs text-gray-500">Tamamlanan</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Antrenman ˜lerlemesi</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>FTP Hedefi ({currentFtp}W -> {ftpTarget}W)</span>
              <span>{Math.max(0, progressToTarget)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, progressToTarget))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
