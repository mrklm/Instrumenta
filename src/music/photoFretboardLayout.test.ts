import { describe, expect, it } from "vitest";
import {
  getNoteHighlightRect,
  getPhotoFretX,
  getPhotoStringY,
} from "./photoFretboardLayout";

describe("photoFretboardLayout", () => {
  it("calcule une tache de note sur une case en mode droitier", () => {
    const rect = getNoteHighlightRect("E", 3, "right");

    expect(rect.centerX).toBe(715);
    expect(rect.centerY).toBe(490);
    expect(rect.width).toBe(84);
    expect(rect.height).toBe(22);
  });

  it("calcule une tache de note sur une case en mode gaucher", () => {
    const rect = getNoteHighlightRect("A", 5, "left");

    expect(rect.centerX).toBe(862.5);
    expect(rect.centerY).toBeCloseTo(448.99, 2);
    expect(rect.width).toBe(73);
    expect(rect.height).toBe(22);
  });

  it("calcule une tache distincte pour une corde a vide", () => {
    const rect = getNoteHighlightRect("E", 0, "right");

    expect(rect.centerX).toBe(428);
    expect(rect.centerY).toBe(485);
    expect(rect.width).toBe(60);
    expect(rect.height).toBe(22);
  });

  it("expose les positions photo de frettes et cordes", () => {
    expect(getPhotoFretX(12, "right")).toBe(1391);
    expect(getPhotoFretX(12, "left")).toBe(364);
    expect(getPhotoStringY("G", "right")).toBe(418);
    expect(getPhotoStringY("G", "left")).toBe(412);
  });
});
