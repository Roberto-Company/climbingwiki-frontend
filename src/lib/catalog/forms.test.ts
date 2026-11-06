import { describe, expect, it } from "vitest";
import {
  parseCragForm,
  parsePitchForm,
  parseRouteForm,
  parseSectorForm,
  parseZoneForm,
} from "./forms";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

describe("parseZoneForm", () => {
  it("trims text and turns empty optional fields into null", () => {
    expect(parseZoneForm(form({ name: "  Murcia  ", description: "  ", parentZoneId: "" }))).toEqual({
      ok: true,
      value: { name: "Murcia", description: null, parentZoneId: null },
    });
  });

  it("keeps the parent zone", () => {
    const result = parseZoneForm(form({ name: "Mula", parentZoneId: "4" }));
    expect(result.ok && result.value.parentZoneId).toBe(4);
  });

  it("requires a name and limits its length", () => {
    expect(parseZoneForm(form({ name: " " }))).toEqual({ ok: false, errors: { name: "required" } });
    expect(parseZoneForm(form({ name: "x".repeat(151) }))).toEqual({ ok: false, errors: { name: "tooLong" } });
  });
});

describe("parseCragForm", () => {
  it("parses numbers and optional text", () => {
    const result = parseCragForm(
      form({ zoneId: "2", name: "El Cejo", latitude: "38.04", longitude: "-1.49", altitudeM: "600", rockType: "caliza" }),
    );
    expect(result).toEqual({
      ok: true,
      value: {
        zoneId: 2,
        name: "El Cejo",
        description: null,
        latitude: 38.04,
        longitude: -1.49,
        altitudeM: 600,
        orientation: null,
        rockType: "caliza",
        approachDescription: null,
      },
    });
  });

  it("rejects coordinates outside the globe and non-numbers", () => {
    const result = parseCragForm(form({ name: "X", latitude: "95", longitude: "abc", altitudeM: "12.5" }));
    expect(result).toEqual({
      ok: false,
      errors: { latitude: "outOfRange", longitude: "invalidNumber", altitudeM: "invalidNumber" },
    });
  });

  it("needs both coordinates or neither", () => {
    expect(parseCragForm(form({ name: "X", latitude: "38" }))).toEqual({
      ok: false,
      errors: { longitude: "required" },
    });
  });
});

describe("parseSectorForm", () => {
  it("requires the crag it belongs to", () => {
    expect(parseSectorForm(form({ name: "Gruyère" }))).toEqual({ ok: false, errors: { cragId: "required" } });
  });

  it("parses a valid sector", () => {
    expect(parseSectorForm(form({ cragId: "3", name: "Gruyère", description: "Placas" }))).toEqual({
      ok: true,
      value: { cragId: 3, name: "Gruyère", description: "Placas", latitude: null, longitude: null },
    });
  });
});

describe("parseRouteForm", () => {
  const valid = { sectorId: "5", name: "Marta", routeType: "SPORT" };

  it("parses a route and keeps existing tags", () => {
    const result = parseRouteForm(form({ ...valid, tagIds: "2,7", firstAscentDate: "1998-05-01" }));
    expect(result.ok && result.value.route).toMatchObject({
      sectorId: 5,
      name: "Marta",
      routeType: "SPORT",
      firstAscentDate: "1998-05-01",
      tagIds: [2, 7],
    });
  });

  it("builds a first pitch only when a grade or length is given", () => {
    const withPitch = parseRouteForm(form({ ...valid, gradeId: "12", lengthM: "25" }));
    expect(withPitch.ok && withPitch.value.firstPitch).toEqual({ gradeId: 12, lengthM: 25 });

    const withoutPitch = parseRouteForm(form(valid));
    expect(withoutPitch.ok && withoutPitch.value.firstPitch).toBeNull();
  });

  it("rejects unknown route types, bad dates and bad lengths", () => {
    const result = parseRouteForm(
      form({ sectorId: "5", name: "Marta", routeType: "ALPINE", firstAscentDate: "05/01/1998", lengthM: "0" }),
    );
    expect(result).toEqual({
      ok: false,
      errors: { routeType: "invalidChoice", firstAscentDate: "invalidDate", lengthM: "outOfRange" },
    });
  });
});

describe("parsePitchForm", () => {
  it("parses a pitch", () => {
    expect(parsePitchForm(form({ routeId: "9", orderIndex: "2", gradeId: "", lengthM: "30", boltsCount: "11" }))).toEqual({
      ok: true,
      value: { routeId: 9, orderIndex: 2, gradeId: null, lengthM: 30, boltsCount: 11, description: null },
    });
  });

  it("requires a positive pitch number", () => {
    expect(parsePitchForm(form({ routeId: "9", orderIndex: "0" }))).toEqual({
      ok: false,
      errors: { orderIndex: "outOfRange" },
    });
    expect(parsePitchForm(form({ routeId: "9" }))).toEqual({ ok: false, errors: { orderIndex: "required" } });
  });
});
