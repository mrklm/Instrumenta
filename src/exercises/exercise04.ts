import type { BassNoteEvent } from "../types/music";
import { createFourMeasureExercise } from "./exerciseUtils";

const motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[] = [
  { string: "E", fret: 3, durationBeats: 1, midiNote: 31 },
  { string: "A", fret: 5, durationBeats: 1, midiNote: 38 },
  { string: "D", fret: 5, durationBeats: 1, midiNote: 43 },
  { string: "G", fret: 5, durationBeats: 1, midiNote: 48 },
];

export const exercise04 = createFourMeasureExercise(
  "exercise-04",
  "Exercice 4 — Montée de cordes",
  96,
  motif,
);
