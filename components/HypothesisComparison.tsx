'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import MapView from './MapView';
import LayerControlPanel from './LayerControlPanel';
import { Columns, Split, ShieldAlert } from 'lucide-react';

export default function HypothesisComparison() {
  const comparisonMode = useCaseStore((state) => state.comparisonMode);
  const toggleComparisonMode = useCaseStore((state) => state.toggleComparisonMode);

  if (!comparisonMode) {
    return (
      <div className="flex justify-end">
        <button
          onClick={toggleComparisonMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs font-mono text-blue-300 hover:text-white border border-blue-500/40 hover:border-blue-400 transition shadow"
        >
          <Split className="w-4 h-4 text-blue-400" />
          <span>Modo Comparar Dos Hipótesis Side-by-Side</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-2 border-blue-500/30 rounded-2xl p-4 bg-slate-950/60 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Columns className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
            Modo Comparación Multicapa: Hipótesis A vs Hipótesis B
          </h3>
        </div>
        <button
          onClick={toggleComparisonMode}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
        >
          Cerrar Modo Comparativo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hypothesis A View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-blue-950/40 p-2.5 rounded-lg border border-blue-800/60 font-mono text-xs">
            <span className="font-bold text-blue-400">HIPÓTESIS A: Escena León XIII & Vertedero</span>
            <span className="text-slate-400">Buffer B=300m, g=1.50</span>
          </div>
          <div className="h-[420px] rounded-xl overflow-hidden border border-slate-800">
            <MapView isHypothesisB={false} />
          </div>
        </div>

        {/* Hypothesis B View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-purple-950/40 p-2.5 rounded-lg border border-purple-800/60 font-mono text-xs">
            <span className="font-bold text-purple-400">HIPÓTESIS B: Arrojamiento Río Guadalquivir</span>
            <span className="text-slate-400">Buffer B=500m, g=1.80</span>
          </div>
          <div className="h-[420px] rounded-xl overflow-hidden border border-slate-800">
            <MapView isHypothesisB={true} />
          </div>
          <LayerControlPanel isHypothesisB={true} />
        </div>
      </div>
    </div>
  );
}
