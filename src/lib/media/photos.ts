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
import siuranaElPati from "@/assets/photos/siurana-el-pati.jpg";
import olianaRumbau from "@/assets/photos/oliana-rumbau.jpg";
import montserratClimbers from "@/assets/photos/montserrat-climbers.jpg";
import rodellarArch from "@/assets/photos/rodellar-arch.jpg";
import elChorroGorge from "@/assets/photos/el-chorro-gorge.jpg";
import ceuseBiographie from "@/assets/photos/ceuse-biographie.jpg";
import verdonWall from "@/assets/photos/verdon-wall.jpg";
import fontainebleauBoulders from "@/assets/photos/fontainebleau-boulders.jpg";
import hanshellerenCave from "@/assets/photos/hanshelleren-cave.jpg";
import elCapitan from "@/assets/photos/el-capitan.jpg";
import midnightLightning from "@/assets/photos/midnight-lightning.jpg";
import pottensteinerWand from "@/assets/photos/pottensteiner-wand.jpg";
import smithRockMonkeyFace from "@/assets/photos/smith-rock-monkey-face.jpg";
import joshuaTreeHiddenValley from "@/assets/photos/joshua-tree-hidden-valley.jpg";
import { photoKeyForPlace, type PhotoKey } from "./photo-keys";

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
const CC_BY_SA_3 = { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
const PUBLIC_DOMAIN = { license: "Public domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
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
  "siurana-el-pati": {
    key: "siurana-el-pati",
    image: siuranaElPati,
    place: "El Pati, Siurana",
    author: "Thomas Charbonneau",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Siurana_secteur_El_Pati.jpg`,
    focus: "50% 55%",
  },
  "oliana-rumbau": {
    key: "oliana-rumbau",
    image: olianaRumbau,
    place: "Contrafort de Rumbau, Oliana",
    author: "Alex Muntada",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}Rock_Climbing_Contrafort_de_Rumbau_Oliana_Spain.jpg`,
    focus: "35% 60%",
  },
  "montserrat-climbers": {
    key: "montserrat-climbers",
    image: montserratClimbers,
    place: "Montserrat",
    author: "DagafeSQV",
    ...CC_BY_SA_3,
    sourceUrl: `${COMMONS}Escalant_a_Montserrat.JPG`,
    focus: "35% 50%",
  },
  "rodellar-arch": {
    key: "rodellar-arch",
    image: rodellarArch,
    place: "Mascún, Rodellar",
    author: "Miquel Simon",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}El_Delfin_7c+_5.13a_Mascun_Rodellar_Spain.jpg`,
    focus: "45% 45%",
  },
  "el-chorro-gorge": {
    key: "el-chorro-gorge",
    image: elChorroGorge,
    place: "Desfiladero de los Gaitanes, El Chorro",
    author: "Falk2",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}S01_992_Desfiladero_de_los_Gaitanos.jpg`,
    focus: "50% 45%",
  },
  "ceuse-biographie": {
    key: "ceuse-biographie",
    image: ceuseBiographie,
    place: "Sectores Berlin y Biographie, Céüse",
    author: "Thomas Charbonneau",
    ...CC_BY_SA_3,
    sourceUrl: `${COMMONS}C%C3%A9%C3%BCse_secteurs_Berlin_et_Biographie.jpg`,
    focus: "50% 45%",
  },
  "verdon-wall": {
    key: "verdon-wall",
    image: verdonWall,
    place: "Gorges du Verdon",
    author: "maarjaara",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Climbing_in_the_Verdon_Gorge.jpg`,
    focus: "50% 40%",
  },
  "fontainebleau-boulders": {
    key: "fontainebleau-boulders",
    image: fontainebleauBoulders,
    place: "Bosque de Fontainebleau",
    author: "Protolanguage17",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Forest_of_Fontainebleau,_Bouldering.jpg`,
    focus: "50% 60%",
  },
  "hanshelleren-cave": {
    key: "hanshelleren-cave",
    image: hanshellerenCave,
    place: "Hanshelleren, Flatanger",
    author: "Mountain Master",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Hanshelleren_view.jpg`,
    focus: "55% 55%",
  },
  "el-capitan": {
    key: "el-capitan",
    image: elCapitan,
    place: "El Capitan, Yosemite",
    author: "Dave Riggs",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}El_Capitan_4.jpg`,
    focus: "50% 35%",
  },
  "midnight-lightning": {
    key: "midnight-lightning",
    image: midnightLightning,
    place: "Midnight Lightning, Camp 4",
    author: "Mark Donoher",
    ...CC_BY_2,
    sourceUrl: `${COMMONS}Midnight_Lightning_yosemite.jpg`,
    focus: "45% 35%",
  },
  "pottensteiner-wand": {
    key: "pottensteiner-wand",
    image: pottensteinerWand,
    place: "Pottensteiner Wand, Frankenjura",
    author: "Nemracc",
    ...CC_BY_SA_4,
    sourceUrl: `${COMMONS}Rock_climbing,_Pottensteiner_Wand,_Franconian_Switzerland_01.jpg`,
    focus: "45% 45%",
  },
  "smith-rock-monkey-face": {
    key: "smith-rock-monkey-face",
    image: smithRockMonkeyFace,
    place: "Monkey Face, Smith Rock",
    author: "Los Paseos from Earth",
    ...CC_BY_SA_2,
    sourceUrl: `${COMMONS}Monkey_Face_(21666728519).jpg`,
    focus: "60% 40%",
  },
  "joshua-tree-hidden-valley": {
    key: "joshua-tree-hidden-valley",
    image: joshuaTreeHiddenValley,
    place: "Hidden Valley, Joshua Tree",
    author: "Joshua Tree National Park (NPS)",
    ...PUBLIC_DOMAIN,
    sourceUrl: `${COMMONS}Climbing_in_Hidden_Valley_(26105723740).jpg`,
    focus: "40% 40%",
  },
};

export function placePhoto(placeName: string | null | undefined): Photo | null {
  const key = photoKeyForPlace(placeName);
  return key ? PHOTOS[key] : null;
}
