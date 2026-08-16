'use client';

import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldCheck } from 'lucide-react';

export default function EthicalBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-[11px] font-mono text-amber-400 border border-amber-500/30 hover:border-amber-400 transition"
      >
        <AlertTriangle className="w-3.5 h-3.5" /> Aviso Metodológico
      </button>
    );
  }

  return (
    <div className="w-full bg-amber-950/40 border-y border-amber-500/30 px-4 py-2 text-amber-200 text-xs font-mono flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 max-w-5xl">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="leading-snug">
          <strong className="text-amber-300">AVISO METODOLÓGICO Y DE ALCANCE:</strong> Esta herramienta es un soporte visual y matemático de modelización geográfica (Rossmo distance decay & isócronas). Los datos renderizados son <strong className="underline">hipótesis probabilísticas</strong> y no pretenden sustituir la investigación policial ni acusar a nadie sin pronunciamiento judicial firme. Cada dato incluye su fuente citable y nivel de confianza.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-white p-1 rounded hover:bg-amber-900/50 flex-shrink-0 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
