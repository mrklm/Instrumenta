import type { BassNoteEvent, Handedness } from "../../types/music";
import { DEFAULT_VISUAL_STRING_ORDER } from "../../music/bassTuning";
import {
  getFretLabelX,
  getFretLabelY,
  getNoteHighlightRect,
  getStringLabelPosition,
  PHOTO_FRETBOARD_SIZE,
} from "../../music/photoFretboardLayout";
import rightFretboardImage from "../../../assets/basse droitier.png";
import leftFretboardImage from "../../../assets/basse gaucher.png";
import "./BassFretboard.css";

interface BassFretboardProps {
  activeNotes: BassNoteEvent[];
  handedness: Handedness;
  fretCount: number;
}

const { width, imageHeight, viewBoxY, viewBoxHeight } = PHOTO_FRETBOARD_SIZE;

export function BassFretboard({
  activeNotes,
  handedness,
  fretCount,
}: BassFretboardProps) {
  const frets = Array.from({ length: fretCount + 1 }, (_, fret) => fret);
  const fretboardImage =
    handedness === "right" ? rightFretboardImage : leftFretboardImage;
  const activeReadoutY = handedness === "left" ? 232 : 252;
  const activeReadoutTextY = handedness === "left" ? 306 : 326;

  return (
    <section className="fretboardPanel" aria-label="Manche de basse">
      <svg
        className="fretboardSvg"
        viewBox={`0 ${viewBoxY} ${width} ${viewBoxHeight}`}
        role="img"
      >
        <image
          className="fretboardPhoto"
          href={fretboardImage}
          x="0"
          y="0"
          width={width}
          height={imageHeight}
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
          const highlight = getNoteHighlightRect(
            note.string,
            note.fret,
            handedness,
          );
          const label = note.fret === 0 ? "0" : String(note.fret);
          return (
            <g key={note.id} className="activeFret">
              <rect
                className={
                  note.fret === 0 ? "activeOpenStringCell" : "activeNoteCell"
                }
                x={highlight.x}
                y={highlight.y}
                width={highlight.width}
                height={highlight.height}
                rx="8"
              />
            </g>
          );
        })}

        {activeNotes[0] ? (
          <g className="activeFretReadout">
            <rect x="815" y={activeReadoutY} width="128" height="96" rx="12" />
            <text x="879" y={activeReadoutTextY} textAnchor="middle">
              {activeNotes[0].fret}
            </text>
          </g>
        ) : null}

        <g className="fretboardLegend" aria-hidden="true">
          <rect className="legendOpenString" x="696" y="622" width="44" height="18" rx="5" />
          <text x="750" y="637">
            = Corde à vide
          </text>
          <rect className="legendPressedFret" x="934" y="622" width="44" height="18" rx="5" />
          <text x="988" y="637">
            = Case appuyée
          </text>
        </g>
      </svg>
    </section>
  );
}
