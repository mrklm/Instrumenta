import type { BassExercise, BassNoteEvent } from "../../types/music";
import { DEFAULT_VISUAL_STRING_ORDER } from "../../music/bassTuning";
import { getExerciseDurationBeats } from "../../music/noteUtils";
import "./BassTablature.css";

interface BassTablatureProps {
  exercise: BassExercise;
  activeNotes: BassNoteEvent[];
  currentBeat: number;
}

const WIDTH = 920;
const ROW_HEIGHT = 42;
const LABEL_WIDTH = 42;
const TOP_PADDING = 30;
const BOTTOM_PADDING = 24;

export function BassTablature({
  exercise,
  activeNotes,
  currentBeat,
}: BassTablatureProps) {
  const durationBeats = getExerciseDurationBeats(exercise.events);
  const height =
    TOP_PADDING + BOTTOM_PADDING + ROW_HEIGHT * DEFAULT_VISUAL_STRING_ORDER.length;
  const noteAreaWidth = WIDTH - LABEL_WIDTH - 28;
  const activeIds = new Set(activeNotes.map((note) => note.id));
  const cursorX = LABEL_WIDTH + (currentBeat / durationBeats) * noteAreaWidth;

  return (
    <section className="tablaturePanel" aria-label="Tablature de basse">
      <svg className="tablatureSvg" viewBox={`0 0 ${WIDTH} ${height}`} role="img">
        {DEFAULT_VISUAL_STRING_ORDER.map((string, index) => {
          const y = TOP_PADDING + index * ROW_HEIGHT;
          return (
            <g key={string}>
              <text className="tabStringName" x="12" y={y + 6}>
                {string}
              </text>
              <line
                className="tabLine"
                x1={LABEL_WIDTH}
                x2={WIDTH - 28}
                y1={y}
                y2={y}
              />
            </g>
          );
        })}

        {Array.from({ length: Math.floor(durationBeats) + 1 }, (_, beat) => {
          const x = LABEL_WIDTH + (beat / durationBeats) * noteAreaWidth;
          const isMeasure = beat % exercise.timeSignature.numerator === 0;
          return (
            <line
              key={beat}
              className={isMeasure ? "measureLine" : "beatLine"}
              x1={x}
              x2={x}
              y1={TOP_PADDING - 18}
              y2={height - BOTTOM_PADDING + 10}
            />
          );
        })}

        {exercise.events.map((event) => {
          const rowIndex = DEFAULT_VISUAL_STRING_ORDER.indexOf(event.string);
          const x =
            LABEL_WIDTH + (event.startBeat / durationBeats) * noteAreaWidth;
          const y = TOP_PADDING + rowIndex * ROW_HEIGHT;
          const width =
            Math.max(event.durationBeats / durationBeats, 0.03) * noteAreaWidth;
          const isActive = activeIds.has(event.id);

          return (
            <g key={event.id} className={isActive ? "tabNote active" : "tabNote"}>
              <rect x={x - 12} y={y - 17} width={Math.max(width, 28)} height="34" rx="4" />
              <text x={x} y={y + 6} textAnchor="middle">
                {event.fret}
              </text>
            </g>
          );
        })}

        <line
          className="playhead"
          x1={Math.min(cursorX, WIDTH - 28)}
          x2={Math.min(cursorX, WIDTH - 28)}
          y1={TOP_PADDING - 22}
          y2={height - BOTTOM_PADDING + 14}
        />
      </svg>
    </section>
  );
}
