export type CostTier = "high" | "medium" | "low";

// PLACEHOLDER VALUES — replace once the client supplies real cost data.
export const BASE_COST_PER_BIRD = 45; // GHS, placeholder
export const TIER_MULTIPLIERS: Record<CostTier, number> = {
  high: 1.3,
  medium: 1,
  low: 0.8,
};
export const TRADE_SPLIT = {
  carpentry: 0.35,
  masonry: 0.3,
  electrical: 0.15,
  waterSystem: 0.2,
};

// Demo assumptions: 0.16m² of building floor per bird, a 2:1 house
// footprint, 90 birds per cage bank, and 30% additional land for access,
// drainage, and service areas. These values require client validation.
export const FLOOR_AREA_PER_BIRD_SQM = 0.16;
export const LAND_BUFFER_MULTIPLIER = 1.3;
export const BIRDS_PER_CAGE = 90;
export const BUILDING_ASPECT_RATIO = 2;
export const DEFAULT_BUILDING_HEIGHT_M = 3.6;

export type QuoteSpecification = {
  landAreaSqm: number;
  buildingLengthM: number;
  buildingWidthM: number;
  buildingHeightM: number;
  cageCount: number;
  waterSystemNotes: string;
  costCarpentry: number;
  costMasonry: number;
  costElectrical: number;
  costWaterSystem: number;
  costTotal: number;
};

function roundMoney(value: number) {
  return Math.round(value / 50) * 50;
}

export function calculateQuoteSpecification(input: {
  flockSize: number;
  costTier: CostTier;
}): QuoteSpecification {
  const flockSize = Math.max(1, Math.round(input.flockSize));
  const floorArea = flockSize * FLOOR_AREA_PER_BIRD_SQM;
  const buildingWidthM = Math.sqrt(floorArea / BUILDING_ASPECT_RATIO);
  const buildingLengthM = buildingWidthM * BUILDING_ASPECT_RATIO;
  const costTotal = roundMoney(
    flockSize * BASE_COST_PER_BIRD * TIER_MULTIPLIERS[input.costTier],
  );

  return {
    landAreaSqm: Math.ceil(floorArea * LAND_BUFFER_MULTIPLIER),
    buildingLengthM: Number(buildingLengthM.toFixed(1)),
    buildingWidthM: Number(buildingWidthM.toFixed(1)),
    buildingHeightM: DEFAULT_BUILDING_HEIGHT_M,
    cageCount: Math.ceil(flockSize / BIRDS_PER_CAGE),
    waterSystemNotes: `Sized for ${flockSize.toLocaleString()} birds: elevated storage, filtered distribution line, and approximately ${Math.ceil(flockSize / 100)} drinker points.`,
    costCarpentry: roundMoney(costTotal * TRADE_SPLIT.carpentry),
    costMasonry: roundMoney(costTotal * TRADE_SPLIT.masonry),
    costElectrical: roundMoney(costTotal * TRADE_SPLIT.electrical),
    costWaterSystem: roundMoney(costTotal * TRADE_SPLIT.waterSystem),
    costTotal,
  };
}
