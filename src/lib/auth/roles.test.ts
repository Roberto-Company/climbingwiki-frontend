import { describe, expect, it } from "vitest";
import { canEditCatalogItem, canVerifyCatalogItems } from "./roles";

const owner = { userId: 1, role: "USER" as const };
const other = { userId: 2, role: "USER" as const };
const moderator = { userId: 3, role: "MODERATOR" as const };
const admin = { userId: 4, role: "ADMIN" as const };

describe("canEditCatalogItem (mirrors the backend's CatalogAccess)", () => {
  it("lets owners edit their own unverified items", () => {
    expect(canEditCatalogItem(owner, { createdById: 1, verified: false })).toBe(true);
  });

  it("stops owners once the item is verified", () => {
    expect(canEditCatalogItem(owner, { createdById: 1, verified: true })).toBe(false);
  });

  it("stops other users and anonymous visitors", () => {
    expect(canEditCatalogItem(other, { createdById: 1, verified: false })).toBe(false);
    expect(canEditCatalogItem(null, { createdById: 1, verified: false })).toBe(false);
  });

  it("stops regular users on items without a recorded creator", () => {
    expect(canEditCatalogItem(owner, { createdById: null, verified: false })).toBe(false);
  });

  it("lets moderators and admins edit anything", () => {
    expect(canEditCatalogItem(moderator, { createdById: 1, verified: true })).toBe(true);
    expect(canEditCatalogItem(admin, { createdById: null, verified: true })).toBe(true);
  });
});

describe("canVerifyCatalogItems", () => {
  it("is limited to moderators and admins", () => {
    expect(canVerifyCatalogItems(moderator)).toBe(true);
    expect(canVerifyCatalogItems(admin)).toBe(true);
    expect(canVerifyCatalogItems(owner)).toBe(false);
    expect(canVerifyCatalogItems(null)).toBe(false);
  });
});
