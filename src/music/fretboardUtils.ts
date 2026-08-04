import type { BassStringName, Handedness } from "../types/music";

export interface FretboardLayout {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

export function getFretX(
  fret: number,
  fretCount: number,
  width: number,
  handedness: Handedness,
  paddingX = 58,
): number {
  const playableWidth = width - paddingX * 2;
  const normalized = Math.min(Math.max(fret, 0), fretCount) / fretCount;
  const rightHandedX = paddingX + normalized * playableWidth;

  if (handedness === "right") {
    return rightHandedX;
  }

  return width - rightHandedX;
}

export function getFretCenterX(
  fret: number,
  fretCount: number,
  width: number,
  handedness: Handedness,
  paddingX = 58,
): number {
  if (fret === 0) {
    const nutX = getFretX(0, fretCount, width, handedness, paddingX);
    return handedness === "right" ? nutX - 24 : nutX + 24;
  }

  const previous = getFretX(fret - 1, fretCount, width, handedness, paddingX);
  const current = getFretX(fret, fretCount, width, handedness, paddingX);
  return (previous + current) / 2;
}

export function getStringY(
  string: BassStringName,
  visualOrder: readonly BassStringName[],
  height: number,
  paddingY = 46,
): number {
  const index = visualOrder.indexOf(string);
  const safeIndex = index >= 0 ? index : 0;
  const step = (height - paddingY * 2) / (visualOrder.length - 1);
  return paddingY + safeIndex * step;
}

export function isTextMirrored(handedness: Handedness): boolean {
  void handedness;
  return false;
}
