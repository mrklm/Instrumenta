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
const RIGHT_HANDED_NUT_X = 452;
const RIGHT_HANDED_TWELFTH_FRET_X = 1422;
const LEFT_HANDED_NUT_X = 1288;
const LEFT_HANDED_TWELFTH_FRET_X = 318;
const PHOTO_STRING_Y = {
  G: 421,
  D: 450,
  A: 479,
  E: 508,
} as const;

export function BassFretboard({
  activeNotes,
  handedness,
  fretCount,
}: BassFretboardProps) {
  const frets = Array.from({ length: fretCount + 1 }, (_, fret) => fret);
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
            <text key={fret} className="fretNumber" x={x} y={390} textAnchor="middle">
              {fret}
            </text>
          );
        })}

        {DEFAULT_VISUAL_STRING_ORDER.map((string) => {
          const y = PHOTO_STRING_Y[string];
          const x = handedness === "right" ? 418 : WIDTH - 418;
          return (
            <text key={string} className="stringName" x={x} y={y + 6}>
              {string}
            </text>
          );
        })}

        {activeNotes.map((note) => {
          const x = getPhotoFretCenterX(note.fret, handedness);
          const y = PHOTO_STRING_Y[note.string];
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

function getPhotoFretX(fret: number, handedness: Handedness): number {
  const safeFret = Math.min(Math.max(Math.round(fret), 0), 12);
  const fretDistanceRatio = 1 - Math.pow(2, -safeFret / 12);

  if (handedness === "right") {
    const scaleLength =
      (RIGHT_HANDED_TWELFTH_FRET_X - RIGHT_HANDED_NUT_X) / 0.5;
    return RIGHT_HANDED_NUT_X + scaleLength * fretDistanceRatio;
  }

  const scaleLength =
    (LEFT_HANDED_NUT_X - LEFT_HANDED_TWELFTH_FRET_X) / 0.5;
  return LEFT_HANDED_NUT_X - scaleLength * fretDistanceRatio;
}

function getFretLabelX(fret: number, handedness: Handedness): number {
  if (fret === 0) {
    const nutX = getPhotoFretX(0, handedness);
    return handedness === "right" ? nutX - 34 : nutX + 34;
  }

  return getPhotoFretCenterX(fret, handedness);
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
