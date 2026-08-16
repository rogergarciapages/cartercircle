'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AnchorPoint, PointOfInterest, IsochroneResult, HeatmapResult } from '../lib/types/case';
import { useCaseStore } from '../lib/store/useCaseStore';
import { generateGeographicProfile } from '../lib/geo/decayModel';
import { calculateIsochrone } from '../lib/geo/isochroneClient';

// Helper component to auto-recenter map when active case changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Custom Leaflet DivIcons for forensic styling
const createCustomIcon = (type: string, isSelected: boolean) => {
  let color = '#3b82f6';
  let symbol = '📍';

  switch (type) {
    case 'CRIME_SCENE':
      color = '#ef4444';
      symbol = '⚠️';
      break;
    case 'HOME':
      color = '#3b82f6';
      symbol = '🏠';
      break;
    case 'LEISURE':
      color = '#f59e0b';
      symbol = '☕';
      break;
    case 'RIVER':
      color = '#06b6d4';
      symbol = '🌊';
      break;
    case 'WASTE':
      color = '#d97706';
      symbol = '🗑️';
      break;
    case 'OPEN_FIELD':
      color = '#10b981';
      symbol = '🌳';
      break;
    case 'CONTAINER':
      color = '#eab308';
      symbol = '📦';
      break;
    default:
      color = '#8b5cf6';
      symbol = '📌';
  }

  const borderStyle = isSelected ? 'ring-4 ring-white scale-125 z-50' : 'ring-2 ring-slate-900';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${borderStyle} shadow-lg transition-transform duration-200" style="background-color: ${color};">
        <span class="text-xs">${symbol}</span>
        ${type === 'CRIME_SCENE' ? '<span class="absolute -inset-1 rounded-full bg-red-500 opacity-75 animate-ping"></span>' : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface MapViewProps {
  isHypothesisB?: boolean;
}

export default function MapViewInner({ isHypothesisB = false }: MapViewProps) {
  const activeCase = useCaseStore((state) => state.activeCase);
  const layerVisibility = useCaseStore((state) => state.layerVisibility);
  const mathParameters = useCaseStore((state) =>
    isHypothesisB ? state.mathParametersHypothesisB : state.mathParameters
  );
  const timeSensitivityShift = useCaseStore((state) => state.timeSensitivityShift);
  const selectedTransportProfileId = useCaseStore((state) => state.selectedTransportProfileId);
  const selectedMinutes = useCaseStore((state) => state.selectedMinutes);
  const selectedAnchorId = useCaseStore((state) => state.selectedAnchorId);
  const selectedPOIId = useCaseStore((state) => state.selectedPOIId);

  const setSelectedAnchor = useCaseStore((state) => state.setSelectedAnchor);
  const setSelectedPOI = useCaseStore((state) => state.setSelectedPOI);

  const [isochrone, setIsochrone] = useState<IsochroneResult | null>(null);

  // Compute map center from main anchor or case default
  const mapCenter: [number, number] = useMemo(() => {
    const mainAnchor = activeCase.anchorPoints.find((a) => a.type === 'CRIME_SCENE') || activeCase.anchorPoints[0];
    return mainAnchor ? [mainAnchor.lat, mainAnchor.lng] : [37.4042, -5.9861];
  }, [activeCase]);

  // Active anchor points considering weight > 0
  const activeAnchors = useMemo(() => {
    return activeCase.anchorPoints.filter(
      (a) => (mathParameters.anchorWeights[a.id] ?? a.weight) > 0
    );
  }, [activeCase.anchorPoints, mathParameters.anchorWeights]);

  // Compute spatial probability profile heatmap
  const heatmapProfile: HeatmapResult = useMemo(() => {
    const effectiveOptions = {
      bufferMeters: mathParameters.bufferMeters,
      decayExponent: mathParameters.decayExponent,
      customWeights: mathParameters.anchorWeights,
      gridResolutionKm: 0.4,
    };
    return generateGeographicProfile(activeAnchors, effectiveOptions);
  }, [activeAnchors, mathParameters]);

  // Calculate selected Isochrone
  useEffect(() => {
    const mainAnchor = activeCase.anchorPoints.find((a) => a.id === selectedAnchorId) ||
      activeCase.anchorPoints.find((a) => a.type === 'CRIME_SCENE') ||
      activeCase.anchorPoints[0];

    const profile = activeCase.transportProfiles.find((tp) => tp.id === selectedTransportProfileId) ||
      activeCase.transportProfiles[0];

    if (mainAnchor && profile) {
      const effectiveMinutes = Math.max(5, selectedMinutes + timeSensitivityShift);
      calculateIsochrone(mainAnchor, profile, effectiveMinutes).then((res) => setIsochrone(res));
    }
  }, [activeCase, selectedAnchorId, selectedTransportProfileId, selectedMinutes, timeSensitivityShift]);

  // Helper color function for Heatmap Grid Cells
  const getCellColor = (prob: number) => {
    if (prob > 80) return '#ef4444'; // Red hot zone
    if (prob > 60) return '#f97316'; // Orange
    if (prob > 40) return '#eab308'; // Yellow
    if (prob > 20) return '#3b82f6'; // Blue
    return '#06b6d4'; // Cyan
  };

  return (
    <div className="relative w-full h-full min-h-[450px]">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl z-0"
      >
        <MapRecenter center={mapCenter} />

        {/* Dark Tile Layer from CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* 1. Isochrone Layer */}
        {layerVisibility.isochrones && isochrone && isochrone.coordinates.map((ring, idx) => (
          <Polygon
            key={`iso-${idx}`}
            positions={ring}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.18,
              weight: 2,
              dashArray: '6, 6',
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-mono">
                <p className="font-bold text-blue-400">
                  Isócrona: {isochrone.minutes} min ({isochrone.transportMode})
                </p>
                <p>Área estimada: {isochrone.areaKm2} km²</p>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* 2. Geographic Profiling Score Heatmap Grid Layer */}
        {layerVisibility.heatmap &&
          heatmapProfile.cells
            .filter((cell) => cell.probability > 12)
            .map((cell, idx) => (
              <CircleMarker
                key={`grid-${idx}`}
                center={[cell.lat, cell.lng]}
                radius={cell.probability > 70 ? 14 : cell.probability > 40 ? 10 : 7}
                pathOptions={{
                  fillColor: getCellColor(cell.probability),
                  fillOpacity: cell.probability / 150 + 0.15,
                  stroke: cell.probability > 75,
                  color: '#ffffff',
                  weight: 1,
                }}
              >
                <Tooltip>
                  <div className="text-xs font-mono space-y-1">
                    <p className="font-bold text-amber-400">
                      P(x,y) Score: {cell.probability}%
                    </p>
                    <p className="text-slate-400">
                      Lat: {cell.lat.toFixed(4)}, Lng: {cell.lng.toFixed(4)}
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}

        {/* 3. Top Hot Zone Pulse Rings */}
        {layerVisibility.heatmap &&
          heatmapProfile.hotZones.slice(0, 3).map((hz, idx) => (
            <CircleMarker
              key={`hz-${idx}`}
              center={[hz.lat, hz.lng]}
              radius={24}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.25,
                weight: 2,
                dashArray: '3, 3',
              }}
            >
              <Tooltip permanent direction="top">
                <span className="font-mono text-xs font-bold text-red-400 bg-slate-900/90 px-2 py-1 rounded border border-red-500/50">
                  🔥 {hz.label}
                </span>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* 4. Anchor Points Markers */}
        {layerVisibility.anchors &&
          activeCase.anchorPoints.map((anchor) => {
            const isSelected = selectedAnchorId === anchor.id;
            return (
              <Marker
                key={anchor.id}
                position={[anchor.lat, anchor.lng]}
                icon={createCustomIcon(anchor.type, isSelected)}
                eventHandlers={{
                  click: () => setSelectedAnchor(anchor.id),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                      <span className="font-semibold text-sm text-slate-100">{anchor.label}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 font-mono">
                        {anchor.type}
                      </span>
                    </div>
                    {anchor.notes && <p className="text-xs text-slate-300">{anchor.notes}</p>}
                    {anchor.sourceRef && (
                      <p className="text-[10px] italic text-slate-400 border-t border-slate-800 pt-1">
                        Fuente: {anchor.sourceRef}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 5. Points of Interest (POIs) Markers */}
        {layerVisibility.pois &&
          activeCase.pointsOfInterest.map((poi) => {
            const isSelected = selectedPOIId === poi.id;
            return (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                icon={createCustomIcon(poi.type, isSelected)}
                eventHandlers={{
                  click: () => setSelectedPOI(poi.id),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                      <span className="font-semibold text-sm text-cyan-300">{poi.label}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-300 font-mono">
                        {poi.type}
                      </span>
                    </div>
                    {poi.notes && <p className="text-xs text-slate-300">{poi.notes}</p>}
                    {poi.sourceRef && (
                      <p className="text-[10px] italic text-slate-400 border-t border-slate-800 pt-1">
                        Fuente: {poi.sourceRef}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Map Floating Legend Overlay */}
      <div className="absolute top-4 right-4 z-10 glass-panel p-3 rounded-lg text-xs space-y-2 max-w-[200px]">
        <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
          <span>Leyenda {isHypothesisB ? '(Hipótesis B)' : '(Hipótesis A)'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span>Escena del Crimen</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span>Domicilio Ancla</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
            <span>POI Río / Agua</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>POI Vertedero / Residuo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-dashed border-blue-400 bg-blue-500/20 inline-block"></span>
            <span>Isócrona Red Viaria</span>
          </div>
        </div>
      </div>
    </div>
  );
}
