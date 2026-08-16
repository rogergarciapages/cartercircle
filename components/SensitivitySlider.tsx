'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function SensitivitySlider() {
  const timeSensitivityShift = useCaseStore((state) => state.timeSensitivityShift);
  const setTimeSensitivityShift = useCaseStore((state) => state.setTimeSensitivityShift);

  return (
    <div className="glass-panel p-3.5 rounded-xl space-y-2 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-xs text-slate-100">
            Sensibilidad Temporal en Vivo (Variación Hora del Crimen)
          </span>
        </div>
        <button
          onClick={() => setTimeSensitivityShift(0)}
          className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40"
        >
          <RefreshCw className="w-3 h-3" /> Reset 0m
        </button>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-slate-500 font-bold">-30 min</span>
        <input
          type="range"
          min={-30}
          max={30}
          step={5}
          value={timeSensitivityShift}
          onChange={(e) => setTimeSensitivityShift(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-slate-500 font-bold">+30 min</span>
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono">
        <span className="text-slate-400">Desplazamiento aplicado:</span>
        <span
          className={`font-bold ${
            timeSensitivityShift === 0
              ? 'text-slate-400'
              : timeSensitivityShift > 0
              ? 'text-purple-400'
              : 'text-amber-400'
          }`}
        >
          {timeSensitivityShift > 0 ? `+${timeSensitivityShift}` : timeSensitivityShift} minutos
        </span>
      </div>
    </div>
  );
}
