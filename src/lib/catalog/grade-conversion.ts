import type { GradingSystemCategory, RouteType } from "@/lib/types";

/**
 * Approximate equivalences between grading systems, one row per step of the reference scale
 * (French for roped climbing, Font for bouldering). The first label of each cell is the one shown;
 * the others are grades that convert to that row. Grade conversion is never exact: this follows the
 * usual guidebook tables, with French 5 covering 5a/5b and 5+ covering 5c, as stored in the catalog.
 */
type EquivalenceRow = Readonly<Record<string, readonly string[]>>;

const ROPED_SYSTEMS = ["French", "YDS", "UIAA", "Ewbank"] as const;
const BOULDER_SYSTEMS = ["Font", "V-Scale"] as const;

export type GradeSystemName = (typeof ROPED_SYSTEMS)[number] | (typeof BOULDER_SYSTEMS)[number];

const ROPED_ROWS: readonly EquivalenceRow[] = [
  { French: ["3"], YDS: ["5.4", "5.3", "5.2"], UIAA: ["IV", "III", "II", "I"], Ewbank: ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"] },
  { French: ["4"], YDS: ["5.6", "5.5"], UIAA: ["V", "IV+", "V-"], Ewbank: ["13"] },
  { French: ["4+"], YDS: ["5.7"], UIAA: ["V+"], Ewbank: ["14", "15"] },
  { French: ["5"], YDS: ["5.8", "5.9"], UIAA: ["VI-", "VI"], Ewbank: ["16", "17"] },
  { French: ["5+"], YDS: ["5.10a"], UIAA: ["VI+"], Ewbank: ["18"] },
  { French: ["6a"], YDS: ["5.10b"], UIAA: ["VII-"], Ewbank: ["19"] },
  { French: ["6a+"], YDS: ["5.10c"], UIAA: ["VII"], Ewbank: ["20"] },
  { French: ["6b"], YDS: ["5.10d"], UIAA: ["VII+"], Ewbank: ["20"] },
  { French: ["6b+"], YDS: ["5.11a"], UIAA: ["VII+"], Ewbank: ["21"] },
  { French: ["6c"], YDS: ["5.11b"], UIAA: ["VIII-"], Ewbank: ["22"] },
  { French: ["6c+"], YDS: ["5.11c"], UIAA: ["VIII"], Ewbank: ["22"] },
  { French: ["7a"], YDS: ["5.11d"], UIAA: ["VIII+"], Ewbank: ["23"] },
  { French: ["7a+"], YDS: ["5.12a"], UIAA: ["VIII+"], Ewbank: ["24"] },
  { French: ["7b"], YDS: ["5.12b"], UIAA: ["IX-"], Ewbank: ["25"] },
  { French: ["7b+"], YDS: ["5.12c"], UIAA: ["IX"], Ewbank: ["26"] },
  { French: ["7c"], YDS: ["5.12d"], UIAA: ["IX"], Ewbank: ["27"] },
  { French: ["7c+"], YDS: ["5.13a"], UIAA: ["IX+"], Ewbank: ["28"] },
  { French: ["8a"], YDS: ["5.13b"], UIAA: ["X-"], Ewbank: ["29"] },
  { French: ["8a+"], YDS: ["5.13c"], UIAA: ["X"], Ewbank: ["30"] },
  { French: ["8b"], YDS: ["5.13d"], UIAA: ["X"], Ewbank: ["31"] },
  { French: ["8b+"], YDS: ["5.14a"], UIAA: ["X+"], Ewbank: ["32"] },
  { French: ["8c"], YDS: ["5.14b"], UIAA: ["XI-"], Ewbank: ["33"] },
  { French: ["8c+"], YDS: ["5.14c"], UIAA: ["XI"], Ewbank: ["34"] },
  { French: ["9a"], YDS: ["5.14d"], UIAA: ["XI+"], Ewbank: ["35"] },
  { French: ["9a+"], YDS: ["5.15a"], UIAA: ["XI+"], Ewbank: ["36"] },
  { French: ["9b"], YDS: ["5.15b"], UIAA: ["XII-"], Ewbank: ["37"] },
  { French: ["9b+"], YDS: ["5.15c"], UIAA: ["XII"], Ewbank: ["38"] },
  { French: ["9c"], YDS: ["5.15d"], UIAA: ["XII+"], Ewbank: ["39"] },
];

const BOULDER_ROWS: readonly EquivalenceRow[] = [
  { Font: ["3"], "V-Scale": ["VB", "V-easy"] },
  { Font: ["4"], "V-Scale": ["V0"] },
  { Font: ["4+"], "V-Scale": ["V0"] },
  { Font: ["5"], "V-Scale": ["V1"] },
  { Font: ["5+"], "V-Scale": ["V2"] },
  { Font: ["6A"], "V-Scale": ["V3"] },
  { Font: ["6A+"], "V-Scale": ["V3"] },
  { Font: ["6B"], "V-Scale": ["V4"] },
  { Font: ["6B+"], "V-Scale": ["V4"] },
  { Font: ["6C"], "V-Scale": ["V5"] },
  { Font: ["6C+"], "V-Scale": ["V5"] },
  { Font: ["7A"], "V-Scale": ["V6"] },
  { Font: ["7A+"], "V-Scale": ["V7"] },
  { Font: ["7B"], "V-Scale": ["V8"] },
  { Font: ["7B+"], "V-Scale": ["V8"] },
  { Font: ["7C"], "V-Scale": ["V9"] },
  { Font: ["7C+"], "V-Scale": ["V10"] },
  { Font: ["8A"], "V-Scale": ["V11"] },
  { Font: ["8A+"], "V-Scale": ["V12"] },
  { Font: ["8B"], "V-Scale": ["V13"] },
  { Font: ["8B+"], "V-Scale": ["V14"] },
  { Font: ["8C"], "V-Scale": ["V15"] },
  { Font: ["8C+"], "V-Scale": ["V16"] },
  { Font: ["9A"], "V-Scale": ["V17"] },
];

function rowsFor(systemName: string): readonly EquivalenceRow[] | null {
  if ((ROPED_SYSTEMS as readonly string[]).includes(systemName)) {
    return ROPED_ROWS;
  }
  return (BOULDER_SYSTEMS as readonly string[]).includes(systemName) ? BOULDER_ROWS : null;
}

/** The systems a grade of this category can be displayed in, reference system first. */
export function systemsForCategory(category: GradingSystemCategory): readonly GradeSystemName[] {
  return category === "BOULDER" ? BOULDER_SYSTEMS : ROPED_SYSTEMS;
}

/** Boulders are graded in boulder systems; sport and trad routes in roped ones. */
export function routeGradeCategory(routeType: RouteType): GradingSystemCategory {
  return routeType === "BOULDER" ? "BOULDER" : "ROPED";
}

/**
 * The equivalent of `label` (a grade of `fromSystem`) in `toSystem`, or null when there is none:
 * unknown grade or system, or systems of different categories (roped vs. boulder).
 */
export function convertGradeLabel(label: string, fromSystem: string, toSystem: string): string | null {
  if (fromSystem === toSystem) {
    return label;
  }
  const rows = rowsFor(fromSystem);
  if (rows === null || rows !== rowsFor(toSystem)) {
    return null;
  }
  const row = rows.find((candidate) => candidate[fromSystem]?.includes(label));
  return row?.[toSystem]?.[0] ?? null;
}
