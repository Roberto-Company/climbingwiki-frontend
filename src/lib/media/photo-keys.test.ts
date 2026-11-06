import { describe, expect, it } from "vitest";
import { photoKeyForZone } from "./photo-keys";

describe("photoKeyForZone", () => {
  it("matches zone names regardless of accents and case", () => {
    expect(photoKeyForZone("Región de Murcia")).toBe("sierra-espuna");
    expect(photoKeyForZone("REGION DE MURCIA")).toBe("sierra-espuna");
    expect(photoKeyForZone(" Mula ")).toBe("embalse-la-cierva");
  });

  it("returns null for places without a photo of their own", () => {
    expect(photoKeyForZone("Cartagena")).toBeNull();
    expect(photoKeyForZone(null)).toBeNull();
  });
});
