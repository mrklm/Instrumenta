import type { BassNoteEvent } from "../types/music";
import { createFourMeasureExercise } from "./exerciseUtils";

const motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[] = [
  { string: "E", fret: 0, durationBeats: 1, midiNote: 28 },
  { string: "E", fret: 2, durationBeats: 1, midiNote: 30 },
  { string: "E", fret: 3, durationBeats: 1, midiNote: 31 },
  { string: "E", fret: 5, durationBeats: 1, midiNote: 33 },
];

export const exercise02 = createFourMeasureExercise(
  "exercise-02",
  "Exercice 2 — Corde E en mouvement",
  72,
  motif,
);
