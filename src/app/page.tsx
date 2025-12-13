'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WeekView from '@/components/WeekView';
import WorkoutCard from '@/components/WorkoutCard';
import { workouts, getWorkoutsByWeek, weekSummaries } from '@/data/workouts';

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine current week based on today's date
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    for (const summary of weekSummaries) {
      if (todayStr >= summary.startDate && todayStr <= summary.endDate) {
        setCurrentWeek(summary.week);
        break;
      }
    }
  }, []);

  const weekWorkouts = getWorkoutsByWeek(currentWeek);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="pb-20">
      <Header key={refreshKey} />

      <div className="max-w-4xl mx-auto px-4 py-4">
        <WeekView currentWeek={currentWeek} onWeekSelect={setCurrentWeek} />

        {/* Workouts Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>Hafta {currentWeek} Antrenmanları</span>
            {weekSummaries[currentWeek - 1]?.isRecoveryWeek && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Recovery Week
              </span>
            )}
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            {weekWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.date}
                workout={workout}
                onToggleComplete={handleRefresh}
              />
            ))}
          </div>
        </div>

        {/* Phase Legend */}
        <div className="mt-8 p-4 bg-white rounded-xl border">
          <h3 className="font-medium mb-3">📊 Faz Bilgisi</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>BASE (H1-4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>BUILD (H5-8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>PEAK (H9-12)</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setCurrentWeek(1)}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition"
          >
            📅 Plan Başlangıcı
          </button>
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              for (const summary of weekSummaries) {
                if (today >= summary.startDate && today <= summary.endDate) {
                  setCurrentWeek(summary.week);
                  break;
                }
              }
            }}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition"
          >
            📍 Bu Hafta
          </button>
          <button
            onClick={() => setCurrentWeek(12)}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
          >
            🏆 Final Test
          </button>
        </div>
      </div>
    </main>
  );
}
