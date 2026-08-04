import type { BassNoteEvent, Handedness } from "../../types/music";
import { DEFAULT_VISUAL_STRING_ORDER } from "../../music/bassTuning";
import { getFretCenterX, getFretX, getStringY } from "../../music/fretboardUtils";
import "./BassFretboard.css";

interface BassFretboardProps {
  activeNotes: BassNoteEvent[];
  handedness: Handedness;
  fretCount: number;
}

const WIDTH = 920;
const HEIGHT = 240;
const PADDING_X = 58;
const PADDING_Y = 46;
const MARKER_FRETS = [3, 5, 7, 9, 12] as const;
const STRING_WIDTHS = {
  E: 4.8,
  A: 4,
  D: 3.2,
  G: 2.4,
} as const;

export function BassFretboard({
  activeNotes,
  handedness,
  fretCount,
}: BassFretboardProps) {
  const frets = Array.from({ length: fretCount + 1 }, (_, fret) => fret);

  return (
    <section className="fretboardPanel" aria-label="Manche de basse">
      <svg className="fretboardSvg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
        <rect
          className="fretboardWood"
          x={PADDING_X}
          y={PADDING_Y - 26}
          width={WIDTH - PADDING_X * 2}
          height={HEIGHT - PADDING_Y * 2 + 52}
          rx="6"
        />

        {MARKER_FRETS.map((fret) => {
          const x = getFretCenterX(fret, fretCount, WIDTH, handedness, PADDING_X);
          const yCenter = HEIGHT / 2;
          const markerYs = fret === 12 ? [yCenter - 28, yCenter + 28] : [yCenter];

          return markerYs.map((y) => (
            <circle
              key={`${fret}-${y}`}
              className="fretMarker"
              cx={x}
              cy={y}
              r="8"
            />
          ));
        })}

        {frets.map((fret) => {
          const x = getFretX(fret, fretCount, WIDTH, handedness, PADDING_X);
          return (
            <g key={fret}>
              <line
                className={fret === 0 ? "nutLine" : "fretLine"}
                x1={x}
                x2={x}
                y1={PADDING_Y - 24}
                y2={HEIGHT - PADDING_Y + 24}
              />
              <text className="fretNumber" x={x} y={24} textAnchor="middle">
                {fret}
              </text>
            </g>
          );
        })}

        {DEFAULT_VISUAL_STRING_ORDER.map((string) => {
          const y = getStringY(string, DEFAULT_VISUAL_STRING_ORDER, HEIGHT, PADDING_Y);
          return (
            <g key={string}>
              <text className="stringName" x={24} y={y + 5}>
                {string}
              </text>
              <line
                className="bassString"
                x1={PADDING_X}
                x2={WIDTH - PADDING_X}
                y1={y}
                y2={y}
                strokeWidth={STRING_WIDTHS[string]}
              />
            </g>
          );
        })}

        {activeNotes.map((note) => {
          const x = getFretCenterX(
            note.fret,
            fretCount,
            WIDTH,
            handedness,
            PADDING_X,
          );
          const y = getStringY(note.string, DEFAULT_VISUAL_STRING_ORDER, HEIGHT, PADDING_Y);
          const label = note.fret === 0 ? "0" : String(note.fret);
          return (
            <g key={note.id} className="activeFret">
              {note.fret === 0 ? (
                <rect x={x - 19} y={y - 19} width="38" height="38" rx="4" />
              ) : (
                <circle cx={x} cy={y} r="20" />
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
