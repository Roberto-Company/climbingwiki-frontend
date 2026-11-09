/** Most grade labels (and counts) the histogram can print under its bars without them overlapping. */
export const MAX_TICKS = 12;

/** Label every n-th bar so a long grade scale (YDS 5.5–5.15d) stays readable. */
export function tickStep(binCount: number): number {
  return Math.max(1, Math.ceil(binCount / MAX_TICKS));
}

/** Counts above the bars only fit while every bar has its own label slot. */
export function showsCounts(binCount: number): boolean {
  return binCount <= MAX_TICKS;
}
