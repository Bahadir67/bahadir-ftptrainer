'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout, WeekSummary } from '@/types/workout';
import { calculateZones } from '@/data/workouts';
import {
  formatDate,
  isToday,
  isPast,
  getWorkoutColor,
  getWorkoutIcon,
  getPhaseColor,
  isWorkoutCompleted,
  toggleWorkoutComplete,
  getLatestFtp,
  addNote,
  getNote
} from '@/lib/utils';

interface Props {
  workout: Workout | null;
  weekSummary: WeekSummary | null;
  date: string;
}

export default function WorkoutDetailClient({ workout, weekSummary, date }: Props) {
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState('');
  const [currentFtp, setCurrentFtp] = useState(220);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompleted(isWorkoutCompleted(date));
    setNote(getNote(date));
    setCurrentFtp(getLatestFtp());
  }, [date]);

  const handleToggleComplete = () => {
    toggleWorkoutComplete(date);
    setCompleted(!completed);
  };

  const handleSaveNote = () => {
    addNote(date, note);
  };

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Antrenman Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Bu tarihte planlanmış antrenman yok.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const zones = calculateZones(currentFtp);
  const today = isToday(date);
  const past = isPast(date);
  const zwoLink = workout.myWhooshWorkout?.trim().endsWith('.zwo') ? workout.myWhooshWorkout.trim() : null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              ← Geri
            </Link>
            {today && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full animate-pulse">
                BUGÜN
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Workout Header */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getWorkoutIcon(workout.type)}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{workout.title}</h1>
                <p className="text-gray-600">
                  {workout.dayOfWeek}, {formatDate(date)}
                </p>
              </div>
            </div>
            {mounted && completed && (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getWorkoutColor(workout.type)}`}>
              {workout.type.replace(/_/g, ' ')}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getPhaseColor(workout.phase)}`} />
              {workout.phase.toUpperCase()} Faz
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Hafta {workout.week}
            </span>
          </div>

          {/* Duration & TSS */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{workout.duration}</div>
              <div className="text-sm text-gray-500">Dakika</div>
            </div>
            {workout.tss && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{workout.tss}</div>
                <div className="text-sm text-gray-500">TSS</div>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700">{workout.description}</p>
        </div>

        {/* Workout Detail */}
        {workout.detail && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">📋 Antrenman Detayı</h2>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-1">🔥 Isınma</h3>
                <p className="text-green-700">{workout.detail.warmup}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-medium text-orange-800 mb-1">💪 Ana Set</h3>
                <p className="text-orange-700 whitespace-pre-line">{workout.detail.main}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-1">❄️ Soğuma</h3>
                <p className="text-blue-700">{workout.detail.cooldown}</p>
              </div>

              {workout.detail.cadence && (
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    <strong>Kadans:</strong> {workout.detail.cadence}
                  </span>
                  {workout.detail.heartRate && (
                    <span className="text-gray-600">
                      <strong>Kalp:</strong> {workout.detail.heartRate}
                    </span>
                  )}
                </div>
              )}

              {workout.detail.tips && workout.detail.tips.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">💡 İpuçları</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {workout.detail.tips.map((tip, index) => (
                      <li key={index} className="text-yellow-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Strength Exercises */}
        {workout.strengthExercises && workout.strengthExercises.length > 0 && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">🏋️ Egzersizler</h2>

            <div className="space-y-3">
              {workout.strengthExercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <div className="font-medium text-indigo-900">{exercise.name}</div>
                    {exercise.notes && (
                      <div className="text-sm text-indigo-600">{exercise.notes}</div>
                    )}
                  </div>
                  <div className="text-indigo-700 font-mono">{exercise.sets}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Power Zones Reference */}
        {workout.type !== 'rest' && workout.type !== 'strength_a' && workout.type !== 'strength_b' && workout.type !== 'strength_maintenance' && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">⚡ Güç Zonları (FTP: {currentFtp}W)</h2>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-100 rounded">
                <strong>Z1</strong> Recovery: &lt;{zones.z1.max}W
              </div>
              <div className="p-2 bg-blue-100 rounded">
                <strong>Z2</strong> Endurance: {zones.z2.min}-{zones.z2.max}W
              </div>
              <div className="p-2 bg-green-100 rounded">
                <strong>Z3</strong> Tempo: {zones.z3.min}-{zones.z3.max}W
              </div>
              <div className="p-2 bg-yellow-100 rounded">
                <strong>Z4</strong> Threshold: {zones.z4.min}-{zones.z4.max}W
              </div>
              <div className="p-2 bg-orange-100 rounded">
                <strong>Z5</strong> VO2max: {zones.z5.min}-{zones.z5.max}W
              </div>
              <div className="p-2 bg-red-100 rounded">
                <strong>Z6</strong> Anaerobic: {zones.z6.min}-{zones.z6.max}W
              </div>
            </div>

            {/* Sweet Spot Reference */}
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <strong className="text-yellow-800">Sweet Spot Zone:</strong>
              <span className="text-yellow-700 ml-2">
                {Math.round(currentFtp * 0.88)}-{Math.round(currentFtp * 0.93)}W
              </span>
            </div>
          </div>
        )}

        {/* MyWhoosh Suggestion */}
        {workout.myWhooshWorkout && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold mb-2">{zwoLink ? '📥 ZWO Dosyası' : '🎮 MyWhoosh Önerisi'}</h2>
            {zwoLink ? (
              <a className="text-blue-600 hover:underline" href={zwoLink} download>
                {zwoLink}
              </a>
            ) : (
              <p className="text-gray-700">{workout.myWhooshWorkout}</p>
            )}
          </div>
        )}

        {/* Notes */}
        {mounted && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">📝 Notlar</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Antrenman hakkında notlarını buraya yaz..."
              className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Notu Kaydet
            </button>
          </div>
        )}

        {/* Complete Button */}
        {mounted && (past || today) && (
          <button
            onClick={handleToggleComplete}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition
              ${completed
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            {completed ? '✓ Tamamlandı - İşareti Kaldır' : '✓ Antrenmanı Tamamla'}
          </button>
        )}

        {/* Week Summary */}
        {weekSummary && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <h3 className="font-medium mb-2">Hafta {workout.week} Özeti</h3>
            <p className="text-sm text-gray-600">{weekSummary.focus}</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span>Hedef TSS: {weekSummary.targetTSS}</span>
              <span>Hedef Saat: {weekSummary.targetHours}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
