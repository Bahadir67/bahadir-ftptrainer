'use client';

import type { WeekSummary } from '@/types/workout';
import { getPhaseColor } from '@/lib/utils';

interface WeekViewProps {
  currentWeek: number;
  onWeekSelect: (week: number) => void;
  weekSummaries: WeekSummary[];
}

export default function WeekView({ currentWeek, onWeekSelect, weekSummaries }: WeekViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">?? Haftal?k G?r?n?m</h2>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weekSummaries.map((week) => (
          <button
            key={week.week}
            onClick={() => onWeekSelect(week.week)}
            className={`flex-shrink-0 w-12 h-16 rounded-lg flex flex-col items-center justify-center transition
              ${currentWeek === week.week
                ? 'ring-2 ring-blue-500 ring-offset-1'
                : 'hover:bg-gray-100'
              }
              ${week.isRecoveryWeek ? 'bg-green-50' : 'bg-gray-50'}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${getPhaseColor(week.phase)} mb-1`} />
            <span className="text-sm font-medium">H{week.week}</span>
            <span className="text-xs text-gray-500">
              {week.isRecoveryWeek ? '??' : `${week.targetHours}s`}
            </span>
          </button>
        ))}
      </div>

      {/* Current Week Summary */}
      {weekSummaries[currentWeek - 1] && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${getPhaseColor(weekSummaries[currentWeek - 1].phase)}`} />
            <span className="font-medium">
              Hafta {currentWeek}: {weekSummaries[currentWeek - 1].phase.toUpperCase()}
            </span>
            {weekSummaries[currentWeek - 1].isRecoveryWeek && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Recovery
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{weekSummaries[currentWeek - 1].focus}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>?? TSS: {weekSummaries[currentWeek - 1].targetTSS}</span>
            <span>?? {weekSummaries[currentWeek - 1].targetHours} saat</span>
            <span>??? {weekSummaries[currentWeek - 1].strengthSessions}x</span>
          </div>
        </div>
      )}
    </div>
  );
}
