import type { StaticImageData } from "next/image";
import cataloniaCaveRoof from "@/assets/photos/catalonia-cave-roof.jpg";
import climberOnGranite from "@/assets/photos/climber-on-granite.jpg";
import crestaDelGallo from "@/assets/photos/cresta-del-gallo.jpg";
import embalseLaCierva from "@/assets/photos/embalse-la-cierva.jpg";
import espunaFirstSnow from "@/assets/photos/espuna-first-snow.jpg";
import margalefOverhang from "@/assets/photos/margalef-overhang.jpg";
import morronDeAlhama from "@/assets/photos/morron-de-alhama.jpg";
import sierraEspuna from "@/assets/photos/sierra-espuna.jpg";
import valleDeRicote from "@/assets/photos/valle-de-ricote.jpg";
import { photoKeyForZone, type PhotoKey } from "./photo-keys";

export interface Photo {
  key: PhotoKey;
  image: StaticImageData;
  /** Where it was taken; shown as the caption. */
  place: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** The file's Wikimedia Commons page. */
  sourceUrl: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  focus?: string;
}

const COMMONS = "https://commons.wikimedia.org/wiki/File:";
const CC_BY_2 = { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
const CC_BY_SA_2 = { license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" };
const CC_BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

/** Every photo is from Wikimedia Commons, resized and recompressed; nothing else is changed. */
export const PHOTOS: Readonly<Record<PhotoKey, Photo>> = {
  "catalonia-cave-roof": {
    key: "catalonia-cave-roof",
    image: cataloniaCaveRoof,
    place: "Cataluña",
    author: "NKBV / Zout Fotografie",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}Catalonia_2016_Zout_Fotografie_(196_van_196)_(32589506286).jpg`,
    focus: "42% 35%",
  },
  "margalef-overhang": {
    key: "margalef-overhang",
    image: margalefOverhang,
    place: "Margalef, Tarragona",
    author: "N McQ",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Al,_Margalef,_Spain.jpg`,
    focus: "30% 60%",
  },
  "climber-on-granite": {
    key: "climber-on-granite",
    image: climberOnGranite,
    place: "Portugal",
    author: "Carlos Baquero",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}Happy_climber.jpg`,
    focus: "50% 20%",
  },
  "sierra-espuna": {
    key: "sierra-espuna",
    image: sierraEspuna,
    place: "Sierra Espuña",
    author: "Werner Wilmes",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Sierra_Espuna_-_52309636526.jpg`,
  },
  "morron-de-alhama": {
    key: "morron-de-alhama",
    image: morronDeAlhama,
    place: "Morrón de Alhama",
    author: "Lorenzo Soriano",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Morr%C3%B3n_de_Alhama.jpg`,
    focus: "50% 40%",
  },
  "embalse-la-cierva": {
    key: "embalse-la-cierva",
    image: embalseLaCierva,
    place: "Embalse de La Cierva, Mula",
    author: "Werner Wilmes",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Embalse_Cierva_-_52481085381.jpg`,
    focus: "70% 50%",
  },
  "cresta-del-gallo": {
    key: "cresta-del-gallo",
    image: crestaDelGallo,
    place: "Cresta del Gallo, El Valle",
    author: "Gregorico",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Crestadelgallo.JPG`,
    focus: "50% 40%",
  },
  "valle-de-ricote": {
    key: "valle-de-ricote",
    image: valleDeRicote,
    place: "Valle de Ricote",
    author: "Gregorico",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Ricoteysuhuerta.jpg`,
  },
  "espuna-first-snow": {
    key: "espuna-first-snow",
    image: espunaFirstSnow,
    place: "Sierra Espuña",
    author: "Werner Wilmes",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Erster_Schnee_in_der_Sierra_Espuna_-_52444264054.jpg`,
  },
};

export function zonePhoto(zoneName: string | null | undefined): Photo | null {
  const key = photoKeyForZone(zoneName);
  return key ? PHOTOS[key] : null;
}
