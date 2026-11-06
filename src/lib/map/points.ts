export interface MapPoint {
  id: number;
  name: string;
  position: [latitude: number, longitude: number];
  href: string;
  /** Short line under the name in the popup, e.g. "3 sectores". */
  detail?: string;
}

interface Located {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

/** Places that can go on a map; the rest are skipped. */
export function toMapPoints(places: readonly Located[], basePath: string): MapPoint[] {
  return places.flatMap((place) =>
    place.latitude !== null && place.longitude !== null
      ? [{ id: place.id, name: place.name, position: [place.latitude, place.longitude] as [number, number], href: `${basePath}/${place.id}` }]
      : [],
  );
}
