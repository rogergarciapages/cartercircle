export type TimeConfidence = 'confirmed' | 'testimonial' | 'hypothesis';

export type AnchorType = 'CRIME_SCENE' | 'HOME' | 'WORK' | 'LEISURE' | 'OTHER';

export type POIType = 'RIVER' | 'WASTE' | 'CONTAINER' | 'OPEN_FIELD' | 'WAREHOUSE' | 'OTHER';

export type TransportMode = 'WALKING' | 'BICYCLE' | 'MOTORCYCLE' | 'CAR';

export interface AnchorPoint {
  id: string;
  caseId: string;
  label: string;
  type: AnchorType;
  lat: number;
  lng: number;
  weight: number;
  notes?: string;
  sourceRef?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string; // ISO 8601 string
  timeConfidence: TimeConfidence;
  description: string;
  personsInvolved: string[];
  locationRefId?: string;
  locationRef?: AnchorPoint;
  sourceRef?: string;
}

export interface PointOfInterest {
  id: string;
  caseId: string;
  label: string;
  type: POIType;
  lat: number;
  lng: number;
  notes?: string;
  sourceRef?: string;
}

export interface TransportProfile {
  id: string;
  caseId: string;
  mode: TransportMode;
  label: string;
  speedKmh: number;
  notes?: string;
}

export interface CaseData {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  anchorPoints: AnchorPoint[];
  timelineEvents: TimelineEvent[];
  pointsOfInterest: PointOfInterest[];
  transportProfiles: TransportProfile[];
}

export interface HeatmapGridCell {
  lat: number;
  lng: number;
  probability: number;
  score: number;
  anchorDistances: Record<string, number>;
}

export interface HeatmapResult {
  cells: HeatmapGridCell[];
  maxScore: number;
  minScore: number;
  hotZones: { lat: number; lng: number; score: number; label: string }[];
}

export interface IsochroneResult {
  anchorId: string;
  transportMode: TransportMode;
  minutes: number;
  coordinates: [number, number][][]; // Polygon rings [lat, lng]
  areaKm2: number;
}
