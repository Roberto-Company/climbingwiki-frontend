import type {
  CragRequest,
  PitchRequest,
  RouteRequest,
  RouteType,
  SectorRequest,
  ZoneRequest,
} from "@/lib/types";

/** Error codes for form fields; the forms translate them (Catalog.edit.errors.*). */
export type FieldErrorCode =
  | "required"
  | "tooLong"
  | "invalidNumber"
  | "outOfRange"
  | "invalidDate"
  | "invalidChoice";

export type FieldErrors = Record<string, FieldErrorCode>;

export type ParseResult<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

export interface FirstPitch {
  gradeId: number | null;
  lengthM: number | null;
}

export interface RouteFormValue {
  route: RouteRequest;
  /** Pitch 1 to create with a new route, when the form gave a grade or length. */
  firstPitch: FirstPitch | null;
}

const NAME_MAX_LENGTH = 150;
const SHORT_TEXT_MAX_LENGTH = 100;
const ROUTE_TYPES: readonly RouteType[] = ["SPORT", "BOULDER", "TRAD"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

interface NumberRule {
  min: number;
  max: number;
  integer?: boolean;
  required?: boolean;
}

const RULES = {
  id: { min: 1, max: Number.MAX_SAFE_INTEGER, integer: true },
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
  altitudeM: { min: -500, max: 9000, integer: true },
  lengthM: { min: 1, max: 2000, integer: true },
  boltsCount: { min: 0, max: 300, integer: true },
  orderIndex: { min: 1, max: 99, integer: true, required: true },
} satisfies Record<string, NumberRule>;

/** Collects field errors while reading values, so every problem is reported at once. */
class FormReader {
  readonly errors: FieldErrors = {};

  constructor(private readonly data: FormData) {}

  private raw(key: string): string {
    const value = this.data.get(key);
    return typeof value === "string" ? value.trim() : "";
  }

  text(key: string, maxLength = NAME_MAX_LENGTH): string | null {
    const value = this.raw(key);
    if (value.length > maxLength) {
      this.errors[key] = "tooLong";
    }
    return value === "" ? null : value;
  }

  longText(key: string): string | null {
    const value = this.raw(key);
    return value === "" ? null : value;
  }

  requiredText(key: string): string {
    const value = this.text(key);
    if (value === null) {
      this.errors[key] = "required";
      return "";
    }
    return value;
  }

  number(key: string, rule: NumberRule): number | null {
    const raw = this.raw(key);
    if (raw === "") {
      if (rule.required) {
        this.errors[key] = "required";
      }
      return null;
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || (rule.integer && !Number.isInteger(value))) {
      this.errors[key] = "invalidNumber";
      return null;
    }
    if (value < rule.min || value > rule.max) {
      this.errors[key] = "outOfRange";
      return null;
    }
    return value;
  }

  requiredId(key: string): number {
    return this.number(key, { ...RULES.id, required: true }) ?? 0;
  }

  /** Latitude and longitude only make sense together. */
  coordinates(): { latitude: number | null; longitude: number | null } {
    const latitude = this.number("latitude", RULES.latitude);
    const longitude = this.number("longitude", RULES.longitude);
    const hasLatitude = this.raw("latitude") !== "";
    const hasLongitude = this.raw("longitude") !== "";
    if (hasLatitude && !hasLongitude) {
      this.errors.longitude = "required";
    }
    if (hasLongitude && !hasLatitude) {
      this.errors.latitude = "required";
    }
    return { latitude, longitude };
  }

  date(key: string): string | null {
    const value = this.raw(key);
    if (value === "") {
      return null;
    }
    if (!ISO_DATE.test(value) || Number.isNaN(Date.parse(value))) {
      this.errors[key] = "invalidDate";
      return null;
    }
    return value;
  }

  idList(key: string): number[] {
    return this.raw(key)
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);
  }

  result<T>(value: T): ParseResult<T> {
    return Object.keys(this.errors).length > 0 ? { ok: false, errors: this.errors } : { ok: true, value };
  }
}

export function parseZoneForm(data: FormData): ParseResult<ZoneRequest> {
  const form = new FormReader(data);
  const value: ZoneRequest = {
    name: form.requiredText("name"),
    description: form.longText("description"),
    parentZoneId: form.number("parentZoneId", RULES.id),
  };
  return form.result(value);
}

export function parseCragForm(data: FormData): ParseResult<CragRequest> {
  const form = new FormReader(data);
  const value: CragRequest = {
    zoneId: form.number("zoneId", RULES.id),
    name: form.requiredText("name"),
    description: form.longText("description"),
    ...form.coordinates(),
    altitudeM: form.number("altitudeM", RULES.altitudeM),
    orientation: form.text("orientation", SHORT_TEXT_MAX_LENGTH),
    rockType: form.text("rockType", SHORT_TEXT_MAX_LENGTH),
    approachDescription: form.longText("approachDescription"),
  };
  return form.result(value);
}

export function parseSectorForm(data: FormData): ParseResult<SectorRequest> {
  const form = new FormReader(data);
  const value: SectorRequest = {
    cragId: form.requiredId("cragId"),
    name: form.requiredText("name"),
    description: form.longText("description"),
    ...form.coordinates(),
  };
  return form.result(value);
}

export function parseRouteForm(data: FormData): ParseResult<RouteFormValue> {
  const form = new FormReader(data);
  const routeType = form.requiredText("routeType");
  if (routeType !== "" && !ROUTE_TYPES.includes(routeType as RouteType)) {
    form.errors.routeType = "invalidChoice";
  }
  const route: RouteRequest = {
    sectorId: form.requiredId("sectorId"),
    name: form.requiredText("name"),
    routeType: routeType as RouteType,
    description: form.longText("description"),
    equipmentNotes: form.longText("equipmentNotes"),
    firstAscentBy: form.text("firstAscentBy"),
    firstAscentDate: form.date("firstAscentDate"),
    ...form.coordinates(),
    tagIds: form.idList("tagIds"),
  };
  const gradeId = form.number("gradeId", RULES.id);
  const lengthM = form.number("lengthM", RULES.lengthM);
  const firstPitch = gradeId !== null || lengthM !== null ? { gradeId, lengthM } : null;
  return form.result({ route, firstPitch });
}

export function parsePitchForm(data: FormData): ParseResult<PitchRequest> {
  const form = new FormReader(data);
  const value: PitchRequest = {
    routeId: form.requiredId("routeId"),
    orderIndex: form.number("orderIndex", RULES.orderIndex) ?? 0,
    gradeId: form.number("gradeId", RULES.id),
    lengthM: form.number("lengthM", RULES.lengthM),
    boltsCount: form.number("boltsCount", RULES.boltsCount),
    description: form.longText("description"),
  };
  return form.result(value);
}
