import { create } from 'zustand';
import { MARTA_DEL_CASTILLO_CASE } from '../seed/martaDelCastillo';
import { AnchorPoint, CaseData, PointOfInterest, TimelineEvent, TransportMode } from '../types/case';

export interface LayerVisibility {
  anchors: boolean;
  pois: boolean;
  isochrones: boolean;
  heatmap: boolean;
  confidenceJudicial: boolean;
  confidenceTestimonial: boolean;
  confidenceHypothesis: boolean;
}

export interface MathParameters {
  bufferMeters: number;       // B
  decayExponent: number;      // g
  anchorWeights: Record<string, number>; // φ_i
}

export interface CaseStoreState {
  // Case Data
  cases: CaseData[];
  activeCase: CaseData;

  // Timeline State
  currentTimeIso: string;
  timeSensitivityShift: number; // -30 to +30 minutes shift

  // Layer Visibility
  layerVisibility: LayerVisibility;

  // Transport & Isochrone Controls
  selectedTransportProfileId: string;
  selectedMinutes: number;

  // Geographic Profiling Parameters
  mathParameters: MathParameters;

  // Selection & Details
  selectedEventId: string | null;
  selectedAnchorId: string | null;
  selectedPOIId: string | null;

  // Comparison Mode State
  comparisonMode: boolean;
  mathParametersHypothesisB: MathParameters;

  // Actions
  setActiveCase: (caseId: string) => void;
  addCase: (newCase: CaseData) => void;
  setCurrentTimeIso: (iso: string) => void;
  setTimeSensitivityShift: (minutes: number) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setSelectedTransportProfile: (profileId: string) => void;
  setSelectedMinutes: (minutes: number) => void;
  setBufferMeters: (meters: number) => void;
  setDecayExponent: (g: number) => void;
  setAnchorWeight: (anchorId: string, weight: number) => void;
  setSelectedEvent: (eventId: string | null) => void;
  setSelectedAnchor: (anchorId: string | null) => void;
  setSelectedPOI: (poiId: string | null) => void;
  toggleComparisonMode: () => void;
  setHypothesisBWeight: (anchorId: string, weight: number) => void;
  addAnchorPoint: (anchor: Omit<AnchorPoint, 'id' | 'caseId'>) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'caseId'>) => void;
  addPOI: (poi: Omit<PointOfInterest, 'id' | 'caseId'>) => void;
}

export const useCaseStore = create<CaseStoreState>((set) => ({
  cases: [MARTA_DEL_CASTILLO_CASE],
  activeCase: MARTA_DEL_CASTILLO_CASE,

  currentTimeIso: '2009-01-24T21:45:00.000Z',
  timeSensitivityShift: 0,

  layerVisibility: {
    anchors: true,
    pois: true,
    isochrones: true,
    heatmap: true,
    confidenceJudicial: true,
    confidenceTestimonial: true,
    confidenceHypothesis: true,
  },

  selectedTransportProfileId: 'trans-motorcycle',
  selectedMinutes: 45,

  mathParameters: {
    bufferMeters: 300,
    decayExponent: 1.5,
    anchorWeights: {
      'anchor-leon-xiii': 1.0,
      'anchor-marta-home': 0.7,
      'anchor-miguel-home': 0.8,
      'anchor-dseda': 0.5,
      'anchor-samuel-home': 0.4,
    },
  },

  selectedEventId: null,
  selectedAnchorId: null,
  selectedPOIId: null,

  comparisonMode: false,
  mathParametersHypothesisB: {
    bufferMeters: 500,
    decayExponent: 1.8,
    anchorWeights: {
      'anchor-leon-xiii': 1.0,
      'anchor-marta-home': 0.2,
      'anchor-miguel-home': 0.9,
      'anchor-dseda': 0.8,
      'anchor-samuel-home': 0.7,
    },
  },

  setActiveCase: (caseId) =>
    set((state) => {
      const found = state.cases.find((c) => c.id === caseId);
      if (!found) return state;
      return { activeCase: found };
    }),

  addCase: (newCase) =>
    set((state) => ({
      cases: [...state.cases, newCase],
      activeCase: newCase,
    })),

  setCurrentTimeIso: (iso) => set({ currentTimeIso: iso }),

  setTimeSensitivityShift: (minutes) => set({ timeSensitivityShift: minutes }),

  toggleLayer: (layer) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layer]: !state.layerVisibility[layer],
      },
    })),

  setSelectedTransportProfile: (profileId) =>
    set({ selectedTransportProfileId: profileId }),

  setSelectedMinutes: (minutes) => set({ selectedMinutes: minutes }),

  setBufferMeters: (meters) =>
    set((state) => ({
      mathParameters: { ...state.mathParameters, bufferMeters: meters },
    })),

  setDecayExponent: (g) =>
    set((state) => ({
      mathParameters: { ...state.mathParameters, decayExponent: g },
    })),

  setAnchorWeight: (anchorId, weight) =>
    set((state) => ({
      mathParameters: {
        ...state.mathParameters,
        anchorWeights: {
          ...state.mathParameters.anchorWeights,
          [anchorId]: weight,
        },
      },
    })),

  setSelectedEvent: (eventId) => set({ selectedEventId: eventId }),
  setSelectedAnchor: (anchorId) => set({ selectedAnchorId: anchorId }),
  setSelectedPOI: (poiId) => set({ selectedPOIId: poiId }),

  toggleComparisonMode: () =>
    set((state) => ({ comparisonMode: !state.comparisonMode })),

  setHypothesisBWeight: (anchorId, weight) =>
    set((state) => ({
      mathParametersHypothesisB: {
        ...state.mathParametersHypothesisB,
        anchorWeights: {
          ...state.mathParametersHypothesisB.anchorWeights,
          [anchorId]: weight,
        },
      },
    })),

  addAnchorPoint: (anchorData) =>
    set((state) => {
      const newAnchor: AnchorPoint = {
        ...anchorData,
        id: `anchor-${Date.now()}`,
        caseId: state.activeCase.id,
      };
      const updatedCase: CaseData = {
        ...state.activeCase,
        anchorPoints: [...state.activeCase.anchorPoints, newAnchor],
      };
      return {
        activeCase: updatedCase,
        cases: state.cases.map((c) =>
          c.id === updatedCase.id ? updatedCase : c
        ),
      };
    }),

  addTimelineEvent: (eventData) =>
    set((state) => {
      const newEvent: TimelineEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        caseId: state.activeCase.id,
      };
      const updatedCase: CaseData = {
        ...state.activeCase,
        timelineEvents: [...state.activeCase.timelineEvents, newEvent],
      };
      return {
        activeCase: updatedCase,
        cases: state.cases.map((c) =>
          c.id === updatedCase.id ? updatedCase : c
        ),
      };
    }),

  addPOI: (poiData) =>
    set((state) => {
      const newPoi: PointOfInterest = {
        ...poiData,
        id: `poi-${Date.now()}`,
        caseId: state.activeCase.id,
      };
      const updatedCase: CaseData = {
        ...state.activeCase,
        pointsOfInterest: [...state.activeCase.pointsOfInterest, newPoi],
      };
      return {
        activeCase: updatedCase,
        cases: state.cases.map((c) =>
          c.id === updatedCase.id ? updatedCase : c
        ),
      };
    }),
}));
