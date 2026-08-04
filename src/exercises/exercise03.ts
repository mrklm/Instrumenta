import type { BassNoteEvent } from "../types/music";
import { createFourMeasureExercise } from "./exerciseUtils";

const motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[] = [
  { string: "A", fret: 0, durationBeats: 1, midiNote: 33 },
  { string: "A", fret: 3, durationBeats: 1, midiNote: 36 },
  { string: "D", fret: 0, durationBeats: 1, midiNote: 38 },
  { string: "D", fret: 2, durationBeats: 1, midiNote: 40 },
];

export const exercise03 = createFourMeasureExercise(
  "exercise-03",
  "Exercice 3 — Passage A/D",
  88,
  motif,
);
