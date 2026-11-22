/** Stock opname rules. Pure functions: safe for the browser, the server, and tests. */

export interface OpnameAdjustment {
  ingredientId: number;
  /** Always positive; `direction` says whether stock goes up or down. */
  quantity: number;
  direction: "plus" | "minus";
}

/** Rounds to the 3 decimals the database stores, so float noise never becomes a movement. */
function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** One adjustment per counted ingredient whose physical count differs from the system. */
export function opnameAdjustments(
  counts: { ingredientId: number; counted: number }[],
  system: Map<number, number>
): OpnameAdjustment[] {
  return counts.flatMap(({ ingredientId, counted }) => {
    const diff = round3(counted - (system.get(ingredientId) ?? 0));
    if (diff === 0) return [];
    return [{ ingredientId, quantity: Math.abs(diff), direction: diff > 0 ? "plus" : "minus" }];
  });
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Groups the movements of one count: OPN-YYYYMMDD-HHMMSS-<location code>, time in WIB. */
export function opnameReference(now: Date, locationCode: string): string {
  const stamp = new Date(now.getTime() + WIB_OFFSET_MS).toISOString();
  const date = stamp.slice(0, 10).replaceAll("-", "");
  const time = stamp.slice(11, 19).replaceAll(":", "");
  return `OPN-${date}-${time}-${locationCode.toUpperCase()}`.slice(0, 40);
}

export const OPNAME_PREFIX = "OPN-";
