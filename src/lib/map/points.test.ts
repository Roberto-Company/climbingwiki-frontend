import { describe, expect, it } from "vitest";
import { toMapPoints } from "./points";

describe("toMapPoints", () => {
  it("keeps only places with both coordinates and builds their links", () => {
    const points = toMapPoints(
      [
        { id: 1, name: "El Pasillo", latitude: 38.06, longitude: -1.49 },
        { id: 2, name: "No coordinates", latitude: null, longitude: null },
        { id: 3, name: "Half", latitude: 38, longitude: null },
      ],
      "/crags",
    );

    expect(points).toEqual([{ id: 1, name: "El Pasillo", position: [38.06, -1.49], href: "/crags/1" }]);
  });
});
