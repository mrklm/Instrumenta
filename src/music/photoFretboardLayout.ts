import type { BassStringName, Handedness } from "../types/music";

export interface Point {
  x: number;
  y: number;
}

export interface NoteHighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export const PHOTO_FRETBOARD_SIZE = {
  width: 1758,
  imageHeight: 895,
  viewBoxY: 230,
  viewBoxHeight: 430,
};

const RIGHT_HANDED_FRET_X = [
  462, 572, 668, 762, 851, 937, 1015, 1091, 1163, 1227, 1285, 1341, 1391,
] as const;

const LEFT_HANDED_FRET_X = [
  1292, 1188, 1089, 994, 904, 821, 742, 668, 596, 530, 470, 415, 364,
] as const;

const LEFT_HANDED_LABEL_X = [
  1330, 1240, 1138, 1042, 949, 862, 782, 705, 632, 563, 500, 443, 390,
] as const;

const RIGHT_HANDED_STRING_Y: Record<BassStringName, number> = {
  G: 418,
  D: 448,
  A: 478,
  E: 508,
};

const LEFT_HANDED_STRING_Y: Record<BassStringName, number> = {
  G: 412,
  D: 443,
  A: 474,
  E: 505,
};

const RIGHT_HANDED_STRING_GUIDE: Record<BassStringName, Point[]> = {
  G: [
    { x: 516, y: 418 },
    { x: 715, y: 420 },
    { x: 893, y: 421 },
    { x: 1052, y: 419 },
    { x: 1195, y: 420 },
    { x: 1314, y: 421 },
    { x: 1368, y: 419 },
  ],
  D: [
    { x: 516, y: 440 },
    { x: 715, y: 445 },
    { x: 893, y: 445 },
    { x: 1052, y: 446 },
    { x: 1195, y: 448 },
    { x: 1314, y: 449 },
    { x: 1368, y: 449 },
  ],
  A: [
    { x: 516, y: 462 },
    { x: 715, y: 468 },
    { x: 893, y: 469 },
    { x: 1052, y: 471 },
    { x: 1195, y: 474 },
    { x: 1314, y: 477 },
    { x: 1368, y: 477 },
  ],
  E: [
    { x: 516, y: 485 },
    { x: 715, y: 490 },
    { x: 893, y: 495 },
    { x: 1052, y: 497 },
    { x: 1195, y: 501 },
    { x: 1314, y: 505 },
    { x: 1368, y: 506 },
  ],
};

const LEFT_HANDED_STRING_GUIDE: Record<BassStringName, Point[]> = {
  G: [
    { x: 389, y: 388 },
    { x: 443, y: 389 },
    { x: 562, y: 393 },
    { x: 705, y: 397 },
    { x: 864, y: 400 },
    { x: 1041, y: 404 },
    { x: 1241, y: 408 },
  ],
  D: [
    { x: 389, y: 417 },
    { x: 443, y: 417 },
    { x: 562, y: 420 },
    { x: 705, y: 423 },
    { x: 864, y: 425 },
    { x: 1041, y: 427 },
    { x: 1241, y: 431 },
  ],
  A: [
    { x: 389, y: 446 },
    { x: 443, y: 445 },
    { x: 562, y: 447 },
    { x: 705, y: 448 },
    { x: 864, y: 449 },
    { x: 1041, y: 449 },
    { x: 1241, y: 453 },
  ],
  E: [
    { x: 389, y: 475 },
    { x: 443, y: 474 },
    { x: 562, y: 474 },
    { x: 705, y: 475 },
    { x: 864, y: 473 },
    { x: 1041, y: 474 },
    { x: 1241, y: 475 },
  ],
};

const RIGHT_HANDED_TOUCH_OFFSET: Record<BassStringName, number> = {
  G: 0,
  D: 0,
  A: 0,
  E: 0,
};

const LEFT_HANDED_TOUCH_OFFSET: Record<BassStringName, number> = {
  G: 0,
  D: 0,
  A: 0,
  E: 0,
};

const RIGHT_HANDED_STRING_LABEL: Record<BassStringName, Point> = {
  G: { x: 374, y: 374 },
  D: { x: 289, y: 390 },
  A: { x: 202, y: 400 },
  E: { x: 112, y: 410 },
};

const LEFT_HANDED_STRING_LABEL: Record<BassStringName, Point> = {
  G: { x: 1660, y: 494 },
  D: { x: 1568, y: 510 },
  A: { x: 1480, y: 526 },
  E: { x: 1392, y: 536 },
};

export function getPhotoStringY(
  string: BassStringName,
  handedness: Handedness,
): number {
  return getLayout(handedness).stringY[string];
}

export function getPhotoStringYAtX(
  string: BassStringName,
  x: number,
  handedness: Handedness,
): number {
  const layout = getLayout(handedness);
  return interpolateY(layout.stringGuide[string], x);
}

export function getStringLabelPosition(
  string: BassStringName,
  handedness: Handedness,
): Point {
  return getLayout(handedness).stringLabel[string];
}

export function getPhotoFretX(fret: number, handedness: Handedness): number {
  const safeFret = clampFret(fret);
  return getLayout(handedness).fretX[safeFret];
}

export function getPhotoFretCenterX(
  fret: number,
  handedness: Handedness,
): number {
  if (fret === 0) {
    const nutX = getPhotoFretX(0, handedness);
    return handedness === "right" ? nutX - 34 : nutX + 34;
  }

  const previous = getPhotoFretX(fret - 1, handedness);
  const current = getPhotoFretX(fret, handedness);
  return (previous + current) / 2;
}

export function getFretLabelX(fret: number, handedness: Handedness): number {
  if (handedness === "left") {
    return LEFT_HANDED_LABEL_X[clampFret(fret)];
  }

  if (fret === 0) {
    return getPhotoFretX(0, handedness) - 34;
  }

  return getPhotoFretCenterX(fret, handedness);
}

export function getFretLabelY(handedness: Handedness): number {
  return handedness === "left" ? 356 : 390;
}

export function getNoteHighlightRect(
  string: BassStringName,
  fret: number,
  handedness: Handedness,
): NoteHighlightRect {
  const height = 22;

  if (fret === 0) {
    const centerX = getPhotoFretCenterX(0, handedness);
    const centerY =
      getPhotoStringYAtX(string, centerX, handedness) +
      getTouchOffset(string, handedness);
    return {
      x: centerX - 30,
      y: centerY - height / 2,
      width: 60,
      height,
      centerX,
      centerY,
    };
  }

  const leftBoundary = getPhotoFretX(fret - 1, handedness);
  const rightBoundary = getPhotoFretX(fret, handedness);
  const x = Math.min(leftBoundary, rightBoundary);
  const width = Math.abs(rightBoundary - leftBoundary);
  const centerX = x + width / 2;
  const centerY =
    getPhotoStringYAtX(string, centerX, handedness) +
    getTouchOffset(string, handedness);

  return {
    x: x + 5,
    y: centerY - height / 2,
    width: Math.max(width - 10, 30),
    height,
    centerX,
    centerY,
  };
}

function getLayout(handedness: Handedness) {
  if (handedness === "right") {
    return {
      fretX: RIGHT_HANDED_FRET_X,
      stringY: RIGHT_HANDED_STRING_Y,
      stringGuide: RIGHT_HANDED_STRING_GUIDE,
      stringLabel: RIGHT_HANDED_STRING_LABEL,
    };
  }

  return {
    fretX: LEFT_HANDED_FRET_X,
    stringY: LEFT_HANDED_STRING_Y,
    stringGuide: LEFT_HANDED_STRING_GUIDE,
    stringLabel: LEFT_HANDED_STRING_LABEL,
  };
}

function clampFret(fret: number): number {
  return Math.min(Math.max(Math.round(fret), 0), 12);
}

function getTouchOffset(
  string: BassStringName,
  handedness: Handedness,
): number {
  return handedness === "right"
    ? RIGHT_HANDED_TOUCH_OFFSET[string]
    : LEFT_HANDED_TOUCH_OFFSET[string];
}

function interpolateY(points: Point[], x: number): number {
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  if (x <= sortedPoints[0].x) {
    return sortedPoints[0].y;
  }

  for (let index = 1; index < sortedPoints.length; index += 1) {
    const previous = sortedPoints[index - 1];
    const current = sortedPoints[index];

    if (x <= current.x) {
      const progress = (x - previous.x) / (current.x - previous.x);
      return previous.y + (current.y - previous.y) * progress;
    }
  }

  return sortedPoints[sortedPoints.length - 1].y;
}
