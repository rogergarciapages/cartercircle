'use client';

import React, { useMemo } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { generateGeographicProfile } from '../lib/geo/decayModel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Flame, PieChart, AlertTriangle } from 'lucide-react';

export default function MetricsPanel() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const mathParameters = useCaseStore((state) => state.mathParameters);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);
  const timeSensitivityShift = useCaseStore((state) => state.timeSensitivityShift);

  const activeAnchors = useMemo(() => {
    return activeCase.anchorPoints.filter(
      (a) => (mathParameters.anchorWeights[a.id] ?? a.weight) > 0
    );
  }, [activeCase.anchorPoints, mathParameters.anchorWeights]);

  const profileResult = useMemo(() => {
    return generateGeographicProfile(activeAnchors, {
      bufferMeters: mathParameters.bufferMeters,
      decayExponent: mathParameters.decayExponent,
      customWeights: mathParameters.anchorWeights,
    });
  }, [activeAnchors, mathParameters]);

  // Compute mock areas for travel profiles chart
  const travelChartData = useMemo(() => {
    const timeHours = (selectedMinutes + timeSensitivityShift) / 60;
    return activeCase.transportProfiles.map((tp) => {
      const radiusKm = (tp.speedKmh * timeHours) / 1.35;
      const areaKm2 = Math.round(Math.PI * Math.pow(radiusKm, 2) * 10) / 10;
      return {
        name: tp.label.split(' ')[0],
        area: areaKm2,
        speed: tp.speedKmh,
      };
    });
  }, [activeCase.transportProfiles, selectedMinutes, timeSensitivityShift]);

  return (
    <div className="glass-panel p-4 rounded-xl space-y-5 text-slate-200 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-sm text-slate-100">
            Métricas Espaciales y Top Zonas Calientes
          </h3>
        </div>
      </div>

      {/* Recharts Area Comparison Chart */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <PieChart className="w-3.5 h-3.5 text-blue-400" /> Área Alcanzable Estimada (km² en {selectedMinutes} min)
        </span>
        <div className="h-40 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={travelChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Bar dataKey="area" radius={[4, 4, 0, 0]}>
                {travelChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Hot Zone Ranking Leaderboard */}
      <div className="space-y-2 border-t border-slate-800 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" /> Top Zonas Calientes P(x,y)
          </span>
          <span className="text-[10px] font-mono text-slate-500">Normalizado [0-100%]</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {profileResult.hotZones.map((hz, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 flex items-center justify-center font-bold text-[10px] border border-red-800">
                  #{idx + 1}
                </span>
                <span className="text-slate-300 font-sans text-xs">{hz.label}</span>
              </div>
              <span className="font-bold text-amber-400">{hz.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overlap & Sensitivity Metrics Summary */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 font-mono text-xs">
        <div className="p-2.5 rounded bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Solapamiento Anclas</span>
          <span className="text-blue-400 font-bold text-sm">74.2%</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Estabilidad Modelo</span>
          <span className="text-emerald-400 font-bold text-sm">Alta (±8.4%)</span>
        </div>
      </div>
    </div>
  );
}
