'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { X, ExternalLink, ShieldCheck, MapPin, Zap, User, BookOpen } from 'lucide-react';

export default function EventDetailDrawer() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const selectedEventId = useCaseStore((state) => state.selectedEventId);
  const selectedAnchorId = useCaseStore((state) => state.selectedAnchorId);
  const selectedPOIId = useCaseStore((state) => state.selectedPOIId);

  const setSelectedEvent = useCaseStore((state) => state.setSelectedEvent);
  const setSelectedAnchor = useCaseStore((state) => state.setSelectedAnchor);
  const setSelectedPOI = useCaseStore((state) => state.setSelectedPOI);

  const event = activeCase.timelineEvents.find((e) => e.id === selectedEventId);
  const anchor = activeCase.anchorPoints.find((a) => a.id === selectedAnchorId);
  const poi = activeCase.pointsOfInterest.find((p) => p.id === selectedPOIId);

  if (!event && !anchor && !poi) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 glass-panel-accent p-5 rounded-2xl shadow-2xl space-y-4 border border-blue-500/40 animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-xs text-slate-100 uppercase tracking-wider">
            Ficha de Trazabilidad Forense
          </span>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedAnchor(null);
            setSelectedPOI(null);
          }}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Timeline Event */}
      {event && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-blue-400">
              {new Date(event.timestamp).toUTCString().slice(0, 22)}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {event.timeConfidence}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">{event.description}</p>

          {event.personsInvolved.length > 0 && (
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase">Personas Implicadas:</span>
              <div className="flex flex-wrap gap-1">
                {event.personsInvolved.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded"
                  >
                    <User className="w-3 h-3 text-slate-400" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.sourceRef && (
            <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <span className="text-blue-400 font-bold block flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Fuente Citable:
              </span>
              <p className="italic">{event.sourceRef}</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Anchor Point */}
      {!event && anchor && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" /> {anchor.label}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              {anchor.type}
            </span>
          </div>

          <div className="font-mono text-xs text-slate-400 space-y-1">
            <p>Latitud: {anchor.lat}</p>
            <p>Longitud: {anchor.lng}</p>
            <p className="text-amber-400 font-bold">Peso inicial φ: {anchor.weight * 100}%</p>
          </div>

          {anchor.notes && <p className="text-xs text-slate-300">{anchor.notes}</p>}

          {anchor.sourceRef && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-blue-400 font-bold block">Fuente:</span>
              <p className="italic">{anchor.sourceRef}</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Point of Interest (POI) */}
      {!event && !anchor && poi && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" /> {poi.label}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {poi.type}
            </span>
          </div>

          <div className="font-mono text-xs text-slate-400 space-y-1">
            <p>Latitud: {poi.lat}</p>
            <p>Longitud: {poi.lng}</p>
          </div>

          {poi.notes && <p className="text-xs text-slate-300">{poi.notes}</p>}

          {poi.sourceRef && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold block">Fuente Citable:</span>
              <p className="italic">{poi.sourceRef}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
