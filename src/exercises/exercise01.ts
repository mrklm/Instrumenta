import type { BassNoteEvent } from "../types/music";
import { createFourMeasureExercise } from "./exerciseUtils";

const motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[] = [
  { string: "E", fret: 3, durationBeats: 1, midiNote: 31 },
  { string: "E", fret: 5, durationBeats: 1, midiNote: 33 },
  { string: "A", fret: 3, durationBeats: 1, midiNote: 36 },
  { string: "A", fret: 5, durationBeats: 1, midiNote: 38 },
];

export const exercise01 = createFourMeasureExercise(
  "exercise-01",
  "Exercice 1 — Déplacement E/A",
  80,
  motif,
);
