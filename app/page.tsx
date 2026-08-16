'use client';

import React from 'react';
import MapView from '../components/MapView';
import Timeline from '../components/Timeline';
import LayerControlPanel from '../components/LayerControlPanel';
import TransportRadiusPanel from '../components/TransportRadiusPanel';
import MetricsPanel from '../components/MetricsPanel';
import SensitivitySlider from '../components/SensitivitySlider';
import EventDetailDrawer from '../components/EventDetailDrawer';
import EthicalBanner from '../components/EthicalBanner';
import CaseManagerModal from '../components/CaseManagerModal';
import HypothesisComparison from '../components/HypothesisComparison';
import { useCaseStore } from '../lib/store/useCaseStore';
import { Radar, ShieldAlert, Crosshair, Map, Activity } from 'lucide-react';

export default function DashboardPage() {
  const activeCase = useCaseStore((state) => state.activeCase);
  const comparisonMode = useCaseStore((state) => state.comparisonMode);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Methodological Scope & Ethical Disclaimer Banner */}
      <EthicalBanner />

      {/* Top Operational Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Radar className="w-5 h-5 animate-radar" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-slate-100 flex items-center gap-2">
              Cold Case Geo-Dashboard <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase">v1.0 MVP</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Análisis geoespacial de espacio de decisión y perfilado geográfico (Modelo Rossmo)
            </p>
          </div>
        </div>

        {/* Quick Stats & Case Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeCase.anchorPoints.length} Anclas</span>
            <span className="text-slate-600">|</span>
            <span>{activeCase.timelineEvents.length} Eventos</span>
          </div>

          <CaseManagerModal />
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        {/* Left Column (65% width on desktop) - Map & Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Comparison Mode or Single Map Container */}
          {comparisonMode ? (
            <HypothesisComparison />
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Crosshair className="w-4 h-4 text-blue-400" />
                  <span>Visor Espacial Interactivo (MapLibre / Leaflet GL)</span>
                </div>
                <HypothesisComparison />
              </div>

              {/* Interactive Map Component */}
              <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <MapView />
              </div>

              {/* Time Sensitivity Slider ( shift crime time ±30 min ) */}
              <SensitivitySlider />
            </div>
          )}

          {/* Interactive Timeline Bar */}
          <Timeline />
        </div>

        {/* Right Sidebar (35% width on desktop) - Controls & Math Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Layer Control Panel & Rossmo Math Parameters */}
          <LayerControlPanel />

          {/* Transport Profiles & Isochrones Selector */}
          <TransportRadiusPanel />

          {/* Recharts Analytics & Hot Zones Ranking Leaderboard */}
          <MetricsPanel />
        </div>
      </main>

      {/* Event Detail Drawer Overlay */}
      <EventDetailDrawer />
    </div>
  );
}
