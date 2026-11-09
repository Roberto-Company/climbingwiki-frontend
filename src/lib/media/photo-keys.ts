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
  | "espuna-first-snow"
  | "siurana-el-pati"
  | "oliana-rumbau"
  | "montserrat-climbers"
  | "rodellar-arch"
  | "el-chorro-gorge"
  | "ceuse-biographie"
  | "verdon-wall"
  | "fontainebleau-boulders"
  | "hanshelleren-cave"
  | "el-capitan"
  | "midnight-lightning"
  | "pottensteiner-wand"
  | "smith-rock-monkey-face"
  | "joshua-tree-hidden-valley";

/**
 * Cover photos of zones and crags, by normalised name. Each photo was taken in or right next to the
 * place (e.g. Embalse de La Cierva sits beside the Mula crags); places without one get no photo rather
 * than an unrelated stock image.
 */
const PLACE_PHOTOS: Readonly<Record<string, PhotoKey>> = {
  // Zones
  "region de murcia": "sierra-espuna",
  "alhama de murcia": "morron-de-alhama",
  mula: "embalse-la-cierva",
  murcia: "cresta-del-gallo",
  ricote: "valle-de-ricote",
  totana: "espuna-first-snow",
  espana: "siurana-el-pati",
  cataluna: "catalonia-cave-roof",
  aragon: "rodellar-arch",
  andalucia: "el-chorro-gorge",
  francia: "ceuse-biographie",
  "provenza-alpes-costa azul": "verdon-wall",
  fontainebleau: "fontainebleau-boulders",
  alemania: "pottensteiner-wand",
  frankenjura: "pottensteiner-wand",
  noruega: "hanshelleren-cave",
  flatanger: "hanshelleren-cave",
  "estados unidos": "el-capitan",
  yosemite: "el-capitan",
  oregon: "smith-rock-monkey-face",
  "joshua tree": "joshua-tree-hidden-valley",
  // Crags
  siurana: "siurana-el-pati",
  margalef: "margalef-overhang",
  oliana: "oliana-rumbau",
  montserrat: "montserrat-climbers",
  rodellar: "rodellar-arch",
  "el chorro": "el-chorro-gorge",
  ceuse: "ceuse-biographie",
  "gorges du verdon": "verdon-wall",
  hanshelleren: "hanshelleren-cave",
  "el capitan": "el-capitan",
  "camp 4": "midnight-lightning",
  "smith rock": "smith-rock-monkey-face",
  "hidden valley": "joshua-tree-hidden-valley",
};

function normalise(name: string): string {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

export function photoKeyForPlace(placeName: string | null | undefined): PhotoKey | null {
  if (!placeName) {
    return null;
  }
  return PLACE_PHOTOS[normalise(placeName)] ?? null;
}
