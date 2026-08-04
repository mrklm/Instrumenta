import type { BassNoteEvent, Handedness } from "../../types/music";
import { DEFAULT_VISUAL_STRING_ORDER } from "../../music/bassTuning";
import rightFretboardImage from "../../../assets/basse droitier.png";
import leftFretboardImage from "../../../assets/basse gaucher.png";
import "./BassFretboard.css";

interface BassFretboardProps {
  activeNotes: BassNoteEvent[];
  handedness: Handedness;
  fretCount: number;
}

const WIDTH = 1758;
const IMAGE_HEIGHT = 895;
const VIEWBOX_Y = 230;
const VIEWBOX_HEIGHT = 430;
const RIGHT_HANDED_FRET_X = [
  462, 572, 668, 762, 851, 937, 1015, 1091, 1163, 1227, 1285, 1341, 1391,
] as const;
const LEFT_HANDED_FRET_X = [
  1292, 1188, 1089, 994, 904, 821, 742, 668, 596, 530, 470, 415, 364,
] as const;
const LEFT_HANDED_LABEL_X = [
  1330, 1240, 1138, 1042, 949, 862, 782, 705, 632, 563, 500, 443, 390,
] as const;
const RIGHT_HANDED_STRING_Y = {
  G: 418,
  D: 448,
  A: 478,
  E: 508,
} as const;
const LEFT_HANDED_STRING_Y = {
  G: 412,
  D: 443,
  A: 474,
  E: 505,
} as const;
const RIGHT_HANDED_STRING_LABEL = {
  G: { x: 374, y: 374 },
  D: { x: 289, y: 390 },
  A: { x: 202, y: 400 },
  E: { x: 112, y: 410 },
} as const;
const LEFT_HANDED_STRING_LABEL = {
  G: { x: 1660, y: 494 },
  D: { x: 1568, y: 510 },
  A: { x: 1480, y: 526 },
  E: { x: 1392, y: 536 },
} as const;

export function BassFretboard({
  activeNotes,
  handedness,
  fretCount,
}: BassFretboardProps) {
  const frets = Array.from({ length: fretCount }, (_, index) => index + 1);
  const fretboardImage =
    handedness === "right" ? rightFretboardImage : leftFretboardImage;

  return (
    <section className="fretboardPanel" aria-label="Manche de basse">
      <svg
        className="fretboardSvg"
        viewBox={`0 ${VIEWBOX_Y} ${WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
      >
        <image
          className="fretboardPhoto"
          href={fretboardImage}
          x="0"
          y="0"
          width={WIDTH}
          height={IMAGE_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
        />

        {frets.map((fret) => {
          const x = getFretLabelX(fret, handedness);
          return (
            <text
              key={fret}
              className="fretNumber"
              x={x}
              y={getFretLabelY(handedness)}
              textAnchor="middle"
            >
              {fret}
            </text>
          );
        })}

        {DEFAULT_VISUAL_STRING_ORDER.map((string) => {
          const { x, y } = getStringLabelPosition(string, handedness);
          return (
            <text
              key={string}
              className="stringName"
              x={x}
              y={y}
              textAnchor="middle"
            >
              {string}
            </text>
          );
        })}

        {activeNotes.map((note) => {
          const x = getPhotoFretCenterX(note.fret, handedness);
          const y = getPhotoStringY(note.string, handedness);
          const label = note.fret === 0 ? "0" : String(note.fret);
          return (
            <g key={note.id} className="activeFret">
              {note.fret === 0 ? (
                <rect x={x - 20} y={y - 20} width="40" height="40" rx="5" />
              ) : (
                <circle cx={x} cy={y} r="22" />
              )}
              <text x={x} y={y + 6} textAnchor="middle">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function getPhotoStringY(
  string: (typeof DEFAULT_VISUAL_STRING_ORDER)[number],
  handedness: Handedness,
): number {
  const stringPositions =
    handedness === "right" ? RIGHT_HANDED_STRING_Y : LEFT_HANDED_STRING_Y;
  return stringPositions[string];
}

function getStringLabelPosition(
  string: (typeof DEFAULT_VISUAL_STRING_ORDER)[number],
  handedness: Handedness,
): { x: number; y: number } {
  const labelPositions =
    handedness === "right"
      ? RIGHT_HANDED_STRING_LABEL
      : LEFT_HANDED_STRING_LABEL;
  return labelPositions[string];
}

function getPhotoFretX(fret: number, handedness: Handedness): number {
  const safeFret = Math.min(Math.max(Math.round(fret), 0), 12);
  const fretPositions =
    handedness === "right" ? RIGHT_HANDED_FRET_X : LEFT_HANDED_FRET_X;
  return fretPositions[safeFret];
}

function getFretLabelX(fret: number, handedness: Handedness): number {
  if (handedness === "left") {
    const safeFret = Math.min(Math.max(Math.round(fret), 0), 12);
    return LEFT_HANDED_LABEL_X[safeFret];
  }

  if (fret === 0) {
    const nutX = getPhotoFretX(0, handedness);
    return nutX - 34;
  }

  return getPhotoFretCenterX(fret, handedness);
}

function getFretLabelY(handedness: Handedness): number {
  return handedness === "left" ? 356 : 390;
}

function getPhotoFretCenterX(fret: number, handedness: Handedness): number {
  if (fret === 0) {
    const nutX = getPhotoFretX(0, handedness);
    return handedness === "right" ? nutX - 34 : nutX + 34;
  }

  const previous = getPhotoFretX(fret - 1, handedness);
  const current = getPhotoFretX(fret, handedness);
  return (previous + current) / 2;
}
