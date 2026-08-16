import { point, featureCollection } from '@turf/helpers';
import distance from '@turf/distance';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';
import pointGrid from '@turf/point-grid';
import bboxPolygon from '@turf/bbox-polygon';
import { AnchorPoint, HeatmapGridCell, HeatmapResult } from '../types/case';

export interface ProfileOptions {
  bufferMeters: number;       // B: buffer zone radius (default 300m)
  decayExponent: number;      // g: power law decay exponent (default 1.5)
  gridResolutionKm?: number;  // Distance between grid points (default 0.5km = 500m)
  customWeights?: Record<string, number>; // Overrides for anchor weights φ_i
  timeShiftMinutes?: number;  // ±30 min time sensitivity shift factor
}

/**
 * Calculates Rossmo-style distance decay probability score for a single point (lat, lng)
 * given a set of anchor points.
 */
export function calculatePointScore(
  lat: number,
  lng: number,
  anchors: AnchorPoint[],
  options: ProfileOptions
): { score: number; anchorDistances: Record<string, number> } {
  const { bufferMeters, decayExponent, customWeights = {} } = options;
  
  // Convert buffer to kilometers
  const bufferKm = Math.max(0.05, bufferMeters / 1000);
  const g = Math.max(0.5, Math.min(3.0, decayExponent));
  const pt = point([lng, lat]);

  let totalScore = 0;
  const anchorDistances: Record<string, number> = {};

  for (const anchor of anchors) {
    const weight = customWeights[anchor.id] ?? anchor.weight ?? 1.0;
    if (weight <= 0) continue;

    const anchorPt = point([anchor.lng, anchor.lat]);
    const distanceKm = distance(pt, anchorPt, { units: 'kilometers' });
    anchorDistances[anchor.id] = distanceKm;

    let f_d: number;
    if (distanceKm <= bufferKm) {
      // Buffer zone: probability is capped or constant inside buffer
      f_d = 1.0 / Math.pow(bufferKm, g);
    } else {
      // Power law decay beyond buffer zone
      f_d = 1.0 / Math.pow(distanceKm, g);
    }

    totalScore += weight * f_d;
  }

  return { score: totalScore, anchorDistances };
}

/**
 * Generates a full spatial probability grid over the case bounding box
 * and returns normalized scores and hot zone rankings.
 */
export function generateGeographicProfile(
  anchors: AnchorPoint[],
  options: ProfileOptions
): HeatmapResult {
  if (!anchors || anchors.length === 0) {
    return { cells: [], maxScore: 0, minScore: 0, hotZones: [] };
  }

  const gridRes = options.gridResolutionKm ?? 0.5; // 500m grid

  // Find bounding box of anchors
  const points = featureCollection(
    anchors.map(a => point([a.lng, a.lat]))
  );

  let anchorBbox = bbox(points);
  // Add a padding of ~8 km around the anchor points
  const paddingKm = 8;
  const expandedPoly = buffer(bboxPolygon(anchorBbox), paddingKm, { units: 'kilometers' });
  const expandedBbox = expandedPoly ? bbox(expandedPoly) : anchorBbox;

  // Generate grid points over the bounding box
  const grid = pointGrid(expandedBbox, gridRes, { units: 'kilometers' });

  const cells: HeatmapGridCell[] = [];
  let maxScore = 0;
  let minScore = Infinity;

  for (const pt of grid.features) {
    const [lng, lat] = pt.geometry.coordinates;
    const { score, anchorDistances } = calculatePointScore(lat, lng, anchors, options);

    if (score > maxScore) maxScore = score;
    if (score < minScore) minScore = score;

    cells.push({
      lat,
      lng,
      probability: score,
      score,
      anchorDistances
    });
  }

  // Normalize scores to [0, 100] scale
  const range = maxScore - minScore || 1;
  const normalizedCells = cells.map(cell => ({
    ...cell,
    probability: Math.round(((cell.score - minScore) / range) * 100)
  }));

  // Identify Top 5 Hot Zones
  const sortedCells = [...normalizedCells].sort((a, b) => b.probability - a.probability);
  
  // Pick distinct hot zones separated by at least 1km
  const hotZones: HeatmapResult['hotZones'] = [];
  for (const cell of sortedCells) {
    if (hotZones.length >= 6) break;

    const isDistinct = hotZones.every(hz => {
      const dist = distance(
        point([cell.lng, cell.lat]),
        point([hz.lng, hz.lat]),
        { units: 'kilometers' }
      );
      return dist > 1.2;
    });

    if (isDistinct) {
      hotZones.push({
        lat: cell.lat,
        lng: cell.lng,
        score: cell.probability,
        label: `Zona Caliente ${hotZones.length + 1} (${cell.probability}% prob.)`
      });
    }
  }

  return {
    cells: normalizedCells,
    maxScore,
    minScore,
    hotZones
  };
}
