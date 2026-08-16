'use client';

import React, { useState } from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';
import { CaseData } from '../lib/types/case';
import { FolderPlus, Download, Upload, Plus, Database, Check } from 'lucide-react';

export default function CaseManagerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'select' | 'create' | 'json'>('select');

  const cases = useCaseStore((state) => state.cases);
  const activeCase = useCaseStore((state) => state.activeCase);
  const setActiveCase = useCaseStore((state) => state.setActiveCase);
  const addCase = useCaseStore((state) => state.addCase);

  // New Case Form state
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newAnchorLabel, setNewAnchorLabel] = useState('');
  const [newAnchorLat, setNewAnchorLat] = useState('37.3891');
  const [newAnchorLng, setNewAnchorLng] = useState('-5.9845');

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState('');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName) return;

    const caseId = `case-${Date.now()}`;
    const newCase: CaseData = {
      id: caseId,
      name: newCaseName,
      description: newCaseDesc || 'Caso ingresado manualmente.',
      status: 'INVESTIGATION_OPEN',
      createdAt: new Date().toISOString(),
      anchorPoints: [
        {
          id: `anchor-initial-${Date.now()}`,
          caseId,
          label: newAnchorLabel || 'Escena Inicial / Ancla 1',
          type: 'CRIME_SCENE',
          lat: parseFloat(newAnchorLat) || 37.3891,
          lng: parseFloat(newAnchorLng) || -5.9845,
          weight: 1.0,
          notes: 'Ancla inicial creada al crear el caso.',
        },
      ],
      timelineEvents: [
        {
          id: `event-initial-${Date.now()}`,
          caseId,
          timestamp: new Date().toISOString(),
          timeConfidence: 'testimonial',
          description: 'Evento inicial registrado.',
          personsInvolved: [],
        },
      ],
      pointsOfInterest: [],
      transportProfiles: [
        { id: `tp-1-${caseId}`, caseId, mode: 'WALKING', label: 'A pie', speedKmh: 4.5 },
        { id: `tp-2-${caseId}`, caseId, mode: 'MOTORCYCLE', label: 'Moto', speedKmh: 30.0 },
        { id: `tp-3-${caseId}`, caseId, mode: 'CAR', label: 'Coche', speedKmh: 40.0 },
      ],
    };

    addCase(newCase);
    setActiveCase(caseId);
    setIsOpen(false);
    setNewCaseName('');
    setNewCaseDesc('');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeCase.id}-dataset.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(jsonInput);
      if (!parsed.id || !parsed.name || !parsed.anchorPoints) {
        throw new Error('Estructura JSON inválida para el caso.');
      }
      addCase(parsed);
      setActiveCase(parsed.id);
      setIsOpen(false);
      setJsonInput('');
    } catch (err: any) {
      setImportError(err.message || 'Error al importar JSON.');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 font-mono text-xs transition shadow"
      >
        <Database className="w-4 h-4 text-blue-400" />
        <span>Caso Activo: <strong>{activeCase.name}</strong></span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-slate-100">
                  Gestión de Casos & Dataset Semilla
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs bg-slate-900 px-2 py-1 rounded"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 font-mono text-xs border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('select')}
                className={`px-3 py-1.5 rounded ${
                  activeTab === 'select' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Seleccionar Caso
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1.5 rounded ${
                  activeTab === 'create' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                + Nuevo Caso
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded ${
                  activeTab === 'json' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Exportar / Importar JSON
              </button>
            </div>

            {/* Tab 1: Case Selector */}
            {activeTab === 'select' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Seleccione el caso para cargar su mapa de anclas, línea temporal e isócronas:
                </p>
                <div className="space-y-2">
                  {cases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveCase(c.id);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                        activeCase.id === c.id
                          ? 'bg-blue-950/80 border-blue-500 text-blue-200'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          {c.name} {activeCase.id === c.id && <Check className="w-4 h-4 text-blue-400" />}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {c.anchorPoints.length} anclas | {c.timelineEvents.length} eventos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Create New Case Form */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreateCase} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre del Caso:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Caso Ficticio / Investigacion X"
                    value={newCaseName}
                    onChange={(e) => setNewCaseName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Descripción General:</label>
                  <textarea
                    placeholder="Resumen del caso, fechas e hipótesis..."
                    value={newCaseDesc}
                    onChange={(e) => setNewCaseDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 h-20"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Ancla Principal:</label>
                    <input
                      type="text"
                      placeholder="Escena Principal"
                      value={newAnchorLabel}
                      onChange={(e) => setNewAnchorLabel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Latitud:</label>
                    <input
                      type="text"
                      value={newAnchorLat}
                      onChange={(e) => setNewAnchorLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Longitud:</label>
                    <input
                      type="text"
                      value={newAnchorLng}
                      onChange={(e) => setNewAnchorLng(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                >
                  Guardar y Cargar Nuevo Caso
                </button>
              </form>
            )}

            {/* Tab 3: JSON Import/Export */}
            {activeTab === 'json' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span>Exportar Caso Actual ({activeCase.name}):</span>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 bg-emerald-950 border border-emerald-600 text-emerald-300 px-3 py-1.5 rounded font-bold hover:bg-emerald-900 transition"
                  >
                    <Download className="w-4 h-4" /> Descargar Dataset JSON
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-400">Pegar JSON para Importar Caso:</label>
                  <textarea
                    placeholder="Pegar dataset JSON completo..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 h-32"
                  />
                  {importError && <p className="text-red-400">{importError}</p>}
                  <button
                    onClick={handleImportJSON}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-4 h-4" /> Importar Caso desde JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
