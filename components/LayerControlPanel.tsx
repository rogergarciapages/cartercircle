'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { Layers, Sliders, Shield, MapPin, Eye, Zap } from 'lucide-react';

interface Props {
  isHypothesisB?: boolean;
}

export default function LayerControlPanel({ isHypothesisB = false }: Props) {
  const activeCase = useCaseStore((state) => state.activeCase);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);
  const mathParameters = useCaseStore((state) =>
    isHypothesisB ? state.mathParametersHypothesisB : state.mathParameters
  );
  const toggleLayer = useCaseStore((state) => state.toggleLayer);

  const setBufferMeters = useCaseStore((state) => state.setBufferMeters);
  const setDecayExponent = useCaseStore((state) => state.setDecayExponent);
  const setAnchorWeight = useCaseStore((state) => state.setAnchorWeight);
  const setHypothesisBWeight = useCaseStore((state) => state.setHypothesisBWeight);

  const updateWeight = (anchorId: string, weight: number) => {
    if (isHypothesisB) {
      setHypothesisBWeight(anchorId, weight);
    } else {
      setAnchorWeight(anchorId, weight);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl space-y-5 text-slate-200 border border-slate-800">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-sm text-slate-100">
            Control de Capas y Parámetros Math {isHypothesisB ? '(Hipótesis B)' : '(Hipótesis A)'}
          </h3>
        </div>
        <Eye className="w-4 h-4 text-slate-400" />
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Capas del Mapa
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleLayer('anchors')}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              layerVisibility.anchors
                ? 'bg-blue-900/40 border-blue-500/50 text-blue-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Puntos Ancla
            </span>
            <span className={`w-2 h-2 rounded-full ${layerVisibility.anchors ? 'bg-blue-400' : 'bg-slate-700'}`} />
          </button>

          <button
            onClick={() => toggleLayer('pois')}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              layerVisibility.pois
                ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Lugares POI
            </span>
            <span className={`w-2 h-2 rounded-full ${layerVisibility.pois ? 'bg-cyan-400' : 'bg-slate-700'}`} />
          </button>

          <button
            onClick={() => toggleLayer('isochrones')}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              layerVisibility.isochrones
                ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            <span>🌐 Isócronas</span>
            <span className={`w-2 h-2 rounded-full ${layerVisibility.isochrones ? 'bg-indigo-400' : 'bg-slate-700'}`} />
          </button>

          <button
            onClick={() => toggleLayer('heatmap')}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              layerVisibility.heatmap
                ? 'bg-red-900/40 border-red-500/50 text-red-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            <span>🔥 Heatmap Score</span>
            <span className={`w-2 h-2 rounded-full ${layerVisibility.heatmap ? 'bg-red-400' : 'bg-slate-700'}`} />
          </button>
        </div>
      </div>

      {/* Confidence Level Filters */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Nivel de Confianza de Datos
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => toggleLayer('confidenceJudicial')}
            className={`flex-1 py-1 px-2 rounded border text-[11px] font-mono transition-all ${
              layerVisibility.confidenceJudicial
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
          >
            Judicial
          </button>
          <button
            onClick={() => toggleLayer('confidenceTestimonial')}
            className={`flex-1 py-1 px-2 rounded border text-[11px] font-mono transition-all ${
              layerVisibility.confidenceTestimonial
                ? 'bg-amber-950 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
          >
            Testimonial
          </button>
          <button
            onClick={() => toggleLayer('confidenceHypothesis')}
            className={`flex-1 py-1 px-2 rounded border text-[11px] font-mono transition-all ${
              layerVisibility.confidenceHypothesis
                ? 'bg-slate-800 border-slate-600 text-slate-300'
                : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
          >
            Hipótesis
          </button>
        </div>
      </div>

      {/* Rossmo Distance Decay Math Sliders */}
      <div className="space-y-4 border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-300 uppercase">
            Modelo de Perfil Geo (Rossmo P(x,y))
          </span>
        </div>

        {/* Buffer B Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Zona Buffer B (Amortiguación):</span>
            <span className="text-amber-400 font-bold">{mathParameters.bufferMeters} m</span>
          </div>
          <input
            type="range"
            min={50}
            max={1200}
            step={25}
            value={mathParameters.bufferMeters}
            onChange={(e) => setBufferMeters(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Decay Exponent g Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Exponente de Decaimiento (g):</span>
            <span className="text-amber-400 font-bold">{mathParameters.decayExponent.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={2.5}
            step={0.05}
            value={mathParameters.decayExponent}
            onChange={(e) => setDecayExponent(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Anchor Weights Sliders (φ_i) */}
        <div className="space-y-2 border-t border-slate-800/80 pt-3">
          <span className="text-[11px] font-mono text-slate-400 block">
            Pesos por Punto Ancla (φ_i):
          </span>
          {activeCase.anchorPoints.map((anchor) => {
            const currentW = mathParameters.anchorWeights[anchor.id] ?? anchor.weight;
            return (
              <div key={anchor.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300 truncate max-w-[170px]">{anchor.label}</span>
                  <span className="text-blue-400 font-bold">{(currentW * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={currentW}
                  onChange={(e) => updateWeight(anchor.id, parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
