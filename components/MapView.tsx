'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-950 flex flex-col items-center justify-center rounded-xl border border-slate-800 text-slate-400 font-mono text-sm space-y-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p>Cargando Motor MapLibre / Leaflet GL...</p>
    </div>
  ),
});

interface MapViewProps {
  isHypothesisB?: boolean;
}

export default function MapView({ isHypothesisB = false }: MapViewProps) {
  return <MapViewInner isHypothesisB={isHypothesisB} />;
}
