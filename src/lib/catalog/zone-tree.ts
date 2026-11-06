type ZoneNode = { id: number; parentZoneId: number | null };

/** The id of a zone and of every zone nested under it, at any depth. */
export function subtreeZoneIds(rootId: number, zones: readonly ZoneNode[]): number[] {
  const seen = new Set<number>([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const parentId = queue.shift();
    for (const child of zones) {
      if (child.parentZoneId === parentId && !seen.has(child.id)) {
        seen.add(child.id);
        queue.push(child.id);
      }
    }
  }
  return [...seen];
}
