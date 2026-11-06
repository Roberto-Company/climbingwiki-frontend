import { describe, expect, it } from "vitest";
import type { UnverifiedItem } from "@/lib/types";
import { groupByKind, itemHref } from "./moderation";

function item(kind: UnverifiedItem["kind"], id: number, parentId: number | null = null): UnverifiedItem {
  return {
    kind,
    id,
    name: `${kind} ${id}`,
    pitchNumber: kind === "pitch" ? 1 : null,
    parentId,
    parentName: null,
    createdById: null,
    createdByUsername: null,
  };
}

describe("itemHref", () => {
  it("links each kind to its page; pitches to their route", () => {
    expect(itemHref(item("zone", 1))).toBe("/zones/1");
    expect(itemHref(item("crag", 2))).toBe("/crags/2");
    expect(itemHref(item("sector", 3))).toBe("/sectors/3");
    expect(itemHref(item("route", 4))).toBe("/routes/4");
    expect(itemHref(item("pitch", 5, 4))).toBe("/routes/4");
  });
});

describe("groupByKind", () => {
  it("keeps catalog order and skips kinds with nothing to review", () => {
    const groups = groupByKind([item("route", 4), item("crag", 2), item("route", 6)]);
    expect(groups.map((group) => [group.kind, group.items.map((entry) => entry.id)])).toEqual([
      ["crag", [2]],
      ["route", [4, 6]],
    ]);
  });
});
