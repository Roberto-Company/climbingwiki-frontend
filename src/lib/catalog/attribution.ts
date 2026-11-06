/**
 * Imported catalog data ends its description with a source sentence, e.g.
 * "… Fuente: theCrag contributors (CC BY-NC-SA) – https://….". It must start a sentence.
 */
const SOURCE_SENTENCE = /(?:^|(?<=[.!?])\s+)Fuente:\s*([\s\S]+?)\.?\s*$/;

export interface SplitDescription {
  /** The description without the source sentence; null when nothing else is left. */
  body: string | null;
  /** The source text without the "Fuente:" label or final period. */
  source: string | null;
}

/** Separates the source sentence so pages can show it once as a footnote instead of on every card. */
export function splitAttribution(description: string | null): SplitDescription {
  if (!description) {
    return { body: null, source: null };
  }
  const match = SOURCE_SENTENCE.exec(description);
  if (!match) {
    return { body: description, source: null };
  }
  const body = description.slice(0, match.index).trim();
  return { body: body || null, source: match[1].trim() };
}

/**
 * Sources to list once per page: no nulls or duplicates, and a source is dropped when a longer one
 * starts with it (e.g. the same licence line without and with the URL).
 */
export function uniqueSources(sources: readonly (string | null)[]): string[] {
  const distinct = [...new Set(sources.filter((source): source is string => source !== null))];
  return distinct.filter((source) => !distinct.some((other) => other !== source && other.startsWith(source)));
}
