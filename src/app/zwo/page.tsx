'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { workouts } from '@/data/workouts';

type ZwoSegment =
  | { kind: 'steady'; seconds: number; power: number }
  | { kind: 'ramp'; seconds: number; startPower: number; endPower: number };

function parseFloatAttr(el: Element, name: string, fallback = 0) {
  const v = el.getAttribute(name);
  const n = v ? Number.parseFloat(v) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

function parseIntAttr(el: Element, name: string, fallback = 0) {
  const v = el.getAttribute(name);
  const n = v ? Number.parseInt(v, 10) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

function parseZwo(xmlText: string): ZwoSegment[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const workout = doc.querySelector('workout');
  if (!workout) return [];

  const segments: ZwoSegment[] = [];
  const children = Array.from(workout.children);

  for (const node of children) {
    const tag = node.tagName;

    if (tag === 'Warmup' || tag === 'Cooldown') {
      const seconds = parseIntAttr(node, 'Duration', 0);
      const powerLow = parseFloatAttr(node, 'PowerLow', 0);
      const powerHigh = parseFloatAttr(node, 'PowerHigh', 0);
      segments.push({ kind: 'ramp', seconds, startPower: powerLow, endPower: powerHigh });
      continue;
    }

    if (tag === 'SteadyState') {
      const seconds = parseIntAttr(node, 'Duration', 0);
      const power = parseFloatAttr(node, 'Power', 0);
      segments.push({ kind: 'steady', seconds, power });
      continue;
    }

    if (tag === 'IntervalsT') {
      const repeat = parseIntAttr(node, 'Repeat', 1);
      const onSeconds = parseIntAttr(node, 'OnDuration', 0);
      const offSeconds = parseIntAttr(node, 'OffDuration', 0);
      const onPower = parseFloatAttr(node, 'OnPower', 0);
      const offPower = parseFloatAttr(node, 'OffPower', 0);

      for (let i = 0; i < repeat; i += 1) {
        segments.push({ kind: 'steady', seconds: onSeconds, power: onPower });
        segments.push({ kind: 'steady', seconds: offSeconds, power: offPower });
      }
      continue;
    }
  }

  return segments.filter(s => s.seconds > 0);
}

function zoneColor(power: number) {
  if (power <= 0.55) return '#9CA3AF'; // Z1 grey
  if (power <= 0.75) return '#38BDF8'; // Z2 blue
  if (power <= 0.9) return '#34D399'; // Z3 green
  if (power <= 1.05) return '#FBBF24'; // Z4 yellow
  if (power <= 1.2) return '#FB923C'; // Z5 orange
  return '#F87171'; // Z6+ red
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function summarize(segments: ZwoSegment[]) {
  let total = 0;
  let weighted = 0;
  let peak = 0;

  for (const seg of segments) {
    total += seg.seconds;
    if (seg.kind === 'steady') {
      weighted += seg.power * seg.seconds;
      peak = Math.max(peak, seg.power);
    } else {
      const avg = (seg.startPower + seg.endPower) / 2;
      weighted += avg * seg.seconds;
      peak = Math.max(peak, seg.startPower, seg.endPower);
    }
  }

  const avg = total > 0 ? weighted / total : 0;
  return { total, avg, peak };
}

function Timeline({ segments }: { segments: ZwoSegment[] }) {
  const width = 1100;
  const height = 340;
  const leftPad = 55;
  const bottomPad = 30;
  const topPad = 18;
  const plotW = width - leftPad - 20;
  const plotH = height - topPad - bottomPad;
  const maxPower = 1.35;
  const totalSeconds = segments.reduce((acc, s) => acc + s.seconds, 0) || 1;

  const y = (p: number) => topPad + (1 - clamp(p / maxPower, 0, 1)) * plotH;

  let xCursor = leftPad;
  const shapes: ReactNode[] = [];

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    const w = (seg.seconds / totalSeconds) * plotW;
    const x0 = xCursor;
    const x1 = xCursor + w;
    xCursor = x1;

    if (seg.kind === 'steady') {
      const fill = zoneColor(seg.power);
      shapes.push(
        <rect
          key={`s-${i}`}
          x={x0}
          y={y(seg.power)}
          width={Math.max(1, w)}
          height={topPad + plotH - y(seg.power)}
          fill={fill}
          opacity={0.95}
          rx={1}
        />
      );
    } else {
      const fill = zoneColor((seg.startPower + seg.endPower) / 2);
      const y0 = y(seg.startPower);
      const y1 = y(seg.endPower);
      const baseY = topPad + plotH;
      const points = `${x0},${baseY} ${x0},${y0} ${x1},${y1} ${x1},${baseY}`;
      shapes.push(<polygon key={`r-${i}`} points={points} fill={fill} opacity={0.5} />);
    }
  }

  const grid: ReactNode[] = [];
  const yTicks = [0.5, 0.75, 0.9, 1.05, 1.2, 1.35];
  for (const p of yTicks) {
    grid.push(
      <g key={`yt-${p}`}>
        <line x1={leftPad} x2={leftPad + plotW} y1={y(p)} y2={y(p)} stroke="#E5E7EB" strokeDasharray="4 4" />
        <text x={10} y={y(p) + 4} fontSize="12" fill="#6B7280">
          {p.toFixed(2)}x
        </text>
      </g>
    );
  }

  const xTicks: ReactNode[] = [];
  const tickCount = 6;
  for (let i = 0; i <= tickCount; i += 1) {
    const t = Math.round((i / tickCount) * totalSeconds);
    const x = leftPad + (t / totalSeconds) * plotW;
    xTicks.push(
      <g key={`xt-${i}`}>
        <line x1={x} x2={x} y1={topPad + plotH} y2={topPad + plotH + 6} stroke="#D1D5DB" />
        <text x={x - 12} y={height - 8} fontSize="12" fill="#6B7280">
          {formatMmSs(t)}
        </text>
      </g>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 overflow-x-auto">
      <div className="text-sm text-gray-500 mb-2">Power (FTP çarpanı) / Zaman</div>
      <svg width={width} height={height} className="block">
        {grid}
        {shapes}
        <rect x={leftPad} y={topPad} width={plotW} height={plotH} fill="none" stroke="#E5E7EB" />
        {xTicks}
      </svg>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Z1 ≤0.55</span>
        <span className="px-2 py-1 rounded bg-sky-100 text-sky-800">Z2 ≤0.75</span>
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800">Z3 ≤0.90</span>
        <span className="px-2 py-1 rounded bg-amber-100 text-amber-900">Z4 ≤1.05</span>
        <span className="px-2 py-1 rounded bg-orange-100 text-orange-900">Z5 ≤1.20</span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-900">Z6+ &gt;1.20</span>
      </div>
    </div>
  );
}

export default function ZwoPage() {
  const zwoWorkouts = useMemo(() => {
    return workouts
      .filter(w => (w.myWhooshWorkout || '').trim().endsWith('.zwo'))
      .map(w => ({
        date: w.date,
        title: w.title,
        url: (w.myWhooshWorkout || '').trim()
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const [selectedUrl, setSelectedUrl] = useState<string>(zwoWorkouts[0]?.url ?? '');
  const [xmlText, setXmlText] = useState<string>('');
  const [segments, setSegments] = useState<ZwoSegment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!selectedUrl) return;
      setError(null);
      setXmlText('');
      setSegments([]);
      try {
        const res = await fetch(selectedUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`ZWO fetch failed: ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        setXmlText(text);
        setSegments(parseZwo(text));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedUrl]);

  const summary = useMemo(() => summarize(segments), [segments]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Ana Sayfa
          </Link>
          <div className="font-semibold">ZWO Preview / Editor</div>
          <a className="text-blue-600 hover:underline" href={selectedUrl} download>
            Download
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Workout</label>
              <select
                className="border rounded-lg px-3 py-2 bg-white"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
              >
                {zwoWorkouts.map(w => (
                  <option key={w.url} value={w.url}>
                    {w.date} — {w.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 flex gap-4">
              <span>
                Süre: <strong className="text-gray-900">{Math.round(summary.total / 60)} dk</strong>
              </span>
              <span>
                Avg: <strong className="text-gray-900">{summary.avg.toFixed(2)}x</strong>
              </span>
              <span>
                Peak: <strong className="text-gray-900">{summary.peak.toFixed(2)}x</strong>
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Not: Bu ekran ZWO dosyasını okuyup görselleştirir. Power değerleri FTP çarpanı olarak gösterilir.
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border shadow-sm p-6 text-red-600">{error}</div>
        ) : (
          <Timeline segments={segments} />
        )}

        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">ZWO XML</div>
            <button
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={async () => {
                await navigator.clipboard.writeText(xmlText);
              }}
              disabled={!xmlText}
            >
              Copy
            </button>
          </div>
          <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-x-auto max-h-80">{xmlText || 'Loading…'}</pre>
        </div>
      </div>
    </main>
  );
}
