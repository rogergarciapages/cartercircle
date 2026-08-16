'use client';

import React, { useMemo } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { TimeConfidence, TimelineEvent } from '../lib/types/case';
import { Clock, ShieldCheck, HelpCircle, FileText, ChevronRight } from 'lucide-react';

export default function Timeline() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const currentTimeIso = useCaseStore((state) => state.currentTimeIso);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);
  const selectedEventId = useCaseStore((state) => state.selectedEventId);

  const setCurrentTimeIso = useCaseStore((state) => state.setCurrentTimeIso);
  const setSelectedEvent = useCaseStore((state) => state.setSelectedEvent);
  const setSelectedAnchor = useCaseStore((state) => state.setSelectedAnchor);

  // Filter events based on confidence toggles
  const filteredEvents = useMemo(() => {
    return activeCase.timelineEvents.filter((ev) => {
      if (ev.timeConfidence === 'confirmed' && !layerVisibility.confidenceJudicial) return false;
      if (ev.timeConfidence === 'testimonial' && !layerVisibility.confidenceTestimonial) return false;
      if (ev.timeConfidence === 'hypothesis' && !layerVisibility.confidenceHypothesis) return false;
      return true;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [activeCase.timelineEvents, layerVisibility]);

  // Format timestamp helper
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getUTCDate()} ene ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}h`;
  };

  const getConfidenceBadge = (confidence: TimeConfidence) => {
    switch (confidence) {
      case 'confirmed':
        return {
          label: 'Confirmado Judicial',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
        };
      case 'testimonial':
        return {
          label: 'Testimonial',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <HelpCircle className="w-3 h-3 text-amber-400" />,
        };
      case 'hypothesis':
      default:
        return {
          label: 'Hipótesis',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30 border-dashed',
          icon: <FileText className="w-3 h-3 text-slate-400" />,
        };
    }
  };

  const currentIdx = filteredEvents.findIndex(
    (e) => new Date(e.timestamp).getTime() >= new Date(currentTimeIso).getTime()
  );

  return (
    <div className="w-full glass-panel p-4 rounded-xl space-y-4 border border-slate-800">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
            Línea Temporal Secuencial (Marcador de Hora T)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Hora Seleccionada T:</span>
          <span className="bg-blue-950 text-blue-300 px-3 py-1 rounded-md border border-blue-800/60 font-bold">
            {formatTime(currentTimeIso)}
          </span>
        </div>
      </div>

      {/* Interactive Drag/Click Range Slider */}
      {filteredEvents.length > 0 && (
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={filteredEvents.length - 1}
            value={currentIdx >= 0 ? currentIdx : filteredEvents.length - 1}
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              const ev = filteredEvents[idx];
              if (ev) {
                setCurrentTimeIso(ev.timestamp);
                setSelectedEvent(ev.id);
                if (ev.locationRefId) setSelectedAnchor(ev.locationRefId);
              }
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>{formatTime(filteredEvents[0].timestamp)}</span>
            <span>{formatTime(filteredEvents[filteredEvents.length - 1].timestamp)}</span>
          </div>
        </div>
      )}

      {/* Horizontal Cards Sequence */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar">
        {filteredEvents.map((event) => {
          const badge = getConfidenceBadge(event.timeConfidence);
          const isSelected = selectedEventId === event.id;
          const isPastOrActive = new Date(event.timestamp).getTime() <= new Date(currentTimeIso).getTime();

          return (
            <div
              key={event.id}
              onClick={() => {
                setCurrentTimeIso(event.timestamp);
                setSelectedEvent(event.id);
                if (event.locationRefId) setSelectedAnchor(event.locationRefId);
              }}
              className={`flex-shrink-0 w-64 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                  : isPastOrActive
                  ? 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-400">
                  {formatTime(event.timestamp)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${badge.bg}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 mb-2">{event.description}</p>
              {event.personsInvolved.length > 0 && (
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1.5">
                  <span className="truncate">👤 {event.personsInvolved.join(', ')}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
