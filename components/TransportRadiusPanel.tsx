'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { Footprints, Bike, Bike as Motorbike, Car, Compass } from 'lucide-react';

export default function TransportRadiusPanel() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const selectedTransportProfileId = useCaseStore((state) => state.selectedTransportProfileId);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);

  const setSelectedTransportProfile = useCaseStore((state) => state.setSelectedTransportProfile);
  const setSelectedMinutes = useCaseStore((state) => state.setSelectedMinutes);

  const activeProfile = activeCase.transportProfiles.find(
    (tp) => tp.id === selectedTransportProfileId
  ) || activeCase.transportProfiles[0];

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'WALKING':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'BICYCLE':
        return <Bike className="w-4 h-4 text-cyan-400" />;
      case 'MOTORCYCLE':
        return <Motorbike className="w-4 h-4 text-amber-400" />;
      case 'CAR':
      default:
        return <Car className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl space-y-4 text-slate-200 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-sm text-slate-100">
            Transporte e Isócronas de Alcance
          </h3>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {activeCase.transportProfiles.map((profile) => {
          const isSelected = profile.id === selectedTransportProfileId;
          return (
            <button
              key={profile.id}
              onClick={() => setSelectedTransportProfile(profile.id)}
              className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                isSelected
                  ? 'bg-blue-950/80 border-blue-500 ring-1 ring-blue-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {getTransportIcon(profile.mode)}
                <span className="font-semibold text-xs text-slate-200">{profile.label}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Velocidad: {profile.speedKmh} km/h
              </span>
            </button>
          );
        })}
      </div>

      {/* Time Window Slider */}
      <div className="space-y-2 border-t border-slate-800 pt-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Ventana Temporal Disponible:</span>
          <span className="text-blue-400 font-bold text-sm">{selectedMinutes} minutos</span>
        </div>
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={selectedMinutes}
          onChange={(e) => setSelectedMinutes(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
        />
        {activeProfile && (
          <p className="text-[11px] text-slate-400 italic">
            {activeProfile.notes}
          </p>
        )}
      </div>
    </div>
  );
}
