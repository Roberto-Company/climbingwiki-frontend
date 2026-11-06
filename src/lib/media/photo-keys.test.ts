import { describe, expect, it } from "vitest";
import { photoKeyForPlace } from "./photo-keys";

describe("photoKeyForPlace", () => {
  it("matches zone names regardless of accents and case", () => {
    expect(photoKeyForPlace("Región de Murcia")).toBe("sierra-espuna");
    expect(photoKeyForPlace("REGION DE MURCIA")).toBe("sierra-espuna");
    expect(photoKeyForPlace(" Mula ")).toBe("embalse-la-cierva");
    expect(photoKeyForPlace("Cataluña")).toBe("catalonia-cave-roof");
  });

  it("matches crag names too", () => {
    expect(photoKeyForPlace("Céüse")).toBe("ceuse-biographie");
    expect(photoKeyForPlace("Camp 4")).toBe("midnight-lightning");
  });

  it("returns null for places without a photo of their own", () => {
    expect(photoKeyForPlace("Cartagena")).toBeNull();
    expect(photoKeyForPlace("Frankenjura")).toBeNull();
    expect(photoKeyForPlace(null)).toBeNull();
  });
});
