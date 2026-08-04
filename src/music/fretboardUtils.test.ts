import { describe, expect, it } from "vitest";
import { getFretX, isTextMirrored } from "./fretboardUtils";

describe("fretboardUtils", () => {
  it("calcule la position d'une frette en mode droitier", () => {
    expect(getFretX(3, 12, 920, "right")).toBe(259);
  });

  it("calcule la position de la meme frette en mode gaucher", () => {
    expect(getFretX(3, 12, 920, "left")).toBe(661);
  });

  it("ne demande pas d'inversion des textes", () => {
    expect(isTextMirrored("right")).toBe(false);
    expect(isTextMirrored("left")).toBe(false);
  });
});
