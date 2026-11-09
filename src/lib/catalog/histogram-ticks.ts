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

/** Labels that fit under the bars on a phone (about 330 px for the whole chart). */
export const MAX_TICKS_MOBILE = 6;

/**
 * Label step on phones: the smallest multiple of the desktop step that fits MAX_TICKS_MOBILE,
 * so the labels a phone keeps are a subset of the desktop ones.
 */
export function mobileTickStep(binCount: number): number {
  const step = tickStep(binCount);
  const multiple = Math.max(1, Math.ceil(binCount / (MAX_TICKS_MOBILE * step)));
  return step * multiple;
}
