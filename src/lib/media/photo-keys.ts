/** Photos bundled with the site (see `photos.ts` for files and credits). */
export type PhotoKey =
  | "catalonia-cave-roof"
  | "margalef-overhang"
  | "climber-on-granite"
  | "sierra-espuna"
  | "morron-de-alhama"
  | "embalse-la-cierva"
  | "cresta-del-gallo"
  | "valle-de-ricote"
  | "espuna-first-snow";

/**
 * Zone cover photos, by normalised zone name. Each photo was taken in or right next to the zone
 * (e.g. Embalse de La Cierva sits beside the Mula crags); places without one get no photo rather
 * than an unrelated stock image.
 */
const ZONE_PHOTOS: Readonly<Record<string, PhotoKey>> = {
  "region de murcia": "sierra-espuna",
  "alhama de murcia": "morron-de-alhama",
  mula: "embalse-la-cierva",
  murcia: "cresta-del-gallo",
  ricote: "valle-de-ricote",
  totana: "espuna-first-snow",
};

function normalise(name: string): string {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

export function photoKeyForZone(zoneName: string | null | undefined): PhotoKey | null {
  if (!zoneName) {
    return null;
  }
  return ZONE_PHOTOS[normalise(zoneName)] ?? null;
}
