/**
 * Critical control points (HACCP) checked in the kitchen, with their safe limits.
 * Limits follow common food-safety guidance (cold ≤ 5 °C, frozen ≤ −18 °C, cooked core ≥ 75 °C,
 * hot holding ≥ 60 °C). Adjust them here to match ZKS's own HACCP plan.
 * Pure module: used by the server to judge a reading and by the form to warn early.
 */

export type ControlPointScope = "storage" | "production";

export interface ControlPoint {
  key: string;
  name: string;
  unit: "°C";
  min?: number;
  max?: number;
  /** Production checks belong to one production order; storage checks do not. */
  scope: ControlPointScope;
}

export const CONTROL_POINTS: ControlPoint[] = [
  { key: "chiller", name: "Suhu chiller", unit: "°C", min: 0, max: 5, scope: "storage" },
  { key: "freezer", name: "Suhu freezer", unit: "°C", max: -18, scope: "storage" },
  { key: "cooking-core", name: "Suhu inti masakan matang", unit: "°C", min: 75, scope: "production" },
  { key: "hot-holding", name: "Suhu hidangan panas saat packing", unit: "°C", min: 60, scope: "production" },
  { key: "loading", name: "Suhu hidangan saat dimuat ke kendaraan", unit: "°C", min: 60, scope: "production" },
];

export function getControlPoint(key: string): ControlPoint | undefined {
  return CONTROL_POINTS.find((cp) => cp.key === key);
}

export function isWithinLimit(cp: ControlPoint, value: number): boolean {
  return (cp.min === undefined || value >= cp.min) && (cp.max === undefined || value <= cp.max);
}

export function limitText(cp: ControlPoint): string {
  const n = (v: number) => v.toLocaleString("id-ID").replace("-", "−");
  if (cp.min !== undefined && cp.max !== undefined) return `${n(cp.min)}–${n(cp.max)} ${cp.unit}`;
  if (cp.min !== undefined) return `≥ ${n(cp.min)} ${cp.unit}`;
  return `≤ ${n(cp.max!)} ${cp.unit}`;
}

/**
 * How long a food sample is kept after production before it may be disposed of.
 * 2 × 24 hours is the long-standing practice for Indonesian caterers; confirm against the
 * client's current health office requirement.
 */
export const SAMPLE_RETENTION_HOURS = 48;
