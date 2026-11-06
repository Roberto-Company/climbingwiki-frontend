import { describe, expect, it } from "vitest";
import { subtreeZoneIds } from "./zone-tree";

const zone = (id: number, parentZoneId: number | null) => ({ id, parentZoneId });

describe("subtreeZoneIds", () => {
  const zones = [zone(1, null), zone(2, 1), zone(3, 2), zone(4, 1), zone(5, null), zone(6, 5)];

  it("returns the zone and every zone below it, at any depth", () => {
    expect(subtreeZoneIds(1, zones).toSorted()).toEqual([1, 2, 3, 4]);
  });

  it("returns only the zone itself when it has no children", () => {
    expect(subtreeZoneIds(3, zones)).toEqual([3]);
  });

  it("does not loop forever on a cycle in bad data", () => {
    const cyclic = [zone(1, 2), zone(2, 1)];
    expect(subtreeZoneIds(1, cyclic).toSorted()).toEqual([1, 2]);
  });
});
