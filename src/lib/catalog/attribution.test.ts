import { describe, expect, it } from "vitest";
import { splitAttribution, uniqueSources } from "./attribution";

describe("splitAttribution", () => {
  it("separates the trailing source sentence from the description", () => {
    expect(
      splitAttribution("Vía muy bonita. Grado indicado: 6a/a+. Fuente: theCrag contributors (CC BY-NC-SA) – https://www.thecrag.com/x."),
    ).toEqual({
      body: "Vía muy bonita. Grado indicado: 6a/a+.",
      source: "theCrag contributors (CC BY-NC-SA) – https://www.thecrag.com/x",
    });
  });

  it("returns a null body when the description is only the source", () => {
    expect(splitAttribution("Fuente: theCrag contributors (CC BY-NC-SA).")).toEqual({
      body: null,
      source: "theCrag contributors (CC BY-NC-SA)",
    });
  });

  it("leaves descriptions without a source untouched", () => {
    expect(splitAttribution("Placa técnica.")).toEqual({ body: "Placa técnica.", source: null });
  });

  it("handles a missing description", () => {
    expect(splitAttribution(null)).toEqual({ body: null, source: null });
  });

  it("only treats 'Fuente:' as a source at the start of a sentence", () => {
    expect(splitAttribution("Junto a la Fuente: cuidado con el agua.")).toEqual({
      body: "Junto a la Fuente: cuidado con el agua.",
      source: null,
    });
  });
});

describe("uniqueSources", () => {
  it("drops nulls, duplicates and sources that a longer one already covers", () => {
    expect(
      uniqueSources([
        "theCrag contributors (CC BY-NC-SA)",
        null,
        "theCrag contributors (CC BY-NC-SA) – https://www.thecrag.com",
        "theCrag contributors (CC BY-NC-SA) – https://www.thecrag.com",
        "© OpenStreetMap contributors (ODbL)",
      ]),
    ).toEqual(["theCrag contributors (CC BY-NC-SA) – https://www.thecrag.com", "© OpenStreetMap contributors (ODbL)"]);
  });
});
