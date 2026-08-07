import type {
  BassExercise,
  BassLearningModule,
  BassNoteEvent,
  BassStringName,
} from "../types/music";
import {
  beginnerExerciseModules,
  beginnerExercises,
} from "./beginnerExerciseJson";
import { createPatternExercise } from "./exerciseUtils";

export type BassExerciseCategoryId = "beginner" | "intermediate" | "expert";

export interface BassExerciseCategory {
  id: BassExerciseCategoryId;
  label: string;
  exercises: readonly BassExercise[];
}

type NoteDraft = Omit<BassNoteEvent, "id" | "startBeat">;

const openMidiByString: Record<BassStringName, number> = {
  E: 28,
  A: 33,
  D: 38,
  G: 43,
};

const n = (
  string: BassStringName,
  fret: number,
  durationBeats = 1,
): NoteDraft => ({
  string,
  fret,
  durationBeats,
  midiNote: openMidiByString[string] + fret,
});

const make = (
  id: string,
  title: string,
  tempo: number,
  motif: readonly NoteDraft[],
  lengthBeats = 16,
) => createPatternExercise(id, title, tempo, motif, lengthBeats);

const intermediateExercises: readonly BassExercise[] = [
  make("intermediate-01", "Intermédiaire 1 — Do majeur", 92, [
    n("A", 3),
    n("A", 5),
    n("D", 2),
    n("D", 3),
    n("D", 5),
    n("G", 2),
    n("G", 4),
    n("G", 5),
  ]),
  make("intermediate-02", "Intermédiaire 2 — Sol majeur", 94, [
    n("E", 3),
    n("E", 5),
    n("A", 2),
    n("A", 3),
    n("A", 5),
    n("D", 2),
    n("D", 4),
    n("D", 5),
  ]),
  make("intermediate-03", "Intermédiaire 3 — Ré majeur", 96, [
    n("A", 5),
    n("A", 7),
    n("D", 4),
    n("D", 5),
    n("D", 7),
    n("G", 4),
    n("G", 6),
    n("G", 7),
  ]),
  make("intermediate-04", "Intermédiaire 4 — La mineur", 90, [
    n("E", 5),
    n("E", 7),
    n("E", 8),
    n("A", 5),
    n("A", 7),
    n("A", 8),
    n("D", 5),
    n("D", 7),
  ]),
  make("intermediate-05", "Intermédiaire 5 — Mi mineur", 92, [
    n("E", 0),
    n("E", 2),
    n("E", 3),
    n("E", 5),
    n("A", 2),
    n("A", 3),
    n("A", 5),
    n("D", 2),
  ]),
  make("intermediate-06", "Intermédiaire 6 — Pentatonique mineure", 96, [
    n("E", 5),
    n("E", 8),
    n("A", 5),
    n("A", 7),
    n("D", 5),
    n("D", 7),
    n("G", 5),
    n("G", 8),
  ]),
  make("intermediate-07", "Intermédiaire 7 — Pentatonique majeure", 96, [
    n("E", 5),
    n("E", 7),
    n("A", 4),
    n("A", 7),
    n("D", 4),
    n("D", 7),
    n("G", 4),
    n("G", 6),
  ]),
  make("intermediate-08", "Intermédiaire 8 — Octaves", 92, [
    n("E", 3),
    n("D", 5),
    n("A", 3),
    n("G", 5),
  ]),
  make("intermediate-09", "Intermédiaire 9 — Quintes", 96, [
    n("E", 3),
    n("A", 5),
    n("A", 3),
    n("D", 5),
  ]),
  make("intermediate-10", "Intermédiaire 10 — Tierces", 88, [
    n("E", 3),
    n("A", 2),
    n("E", 5),
    n("A", 3),
  ]),
  make("intermediate-11", "Intermédiaire 11 — Walking I-V", 104, [
    n("E", 3),
    n("A", 2),
    n("A", 5),
    n("D", 2),
  ]),
  make("intermediate-12", "Intermédiaire 12 — Approches chromatiques", 94, [
    n("E", 3),
    n("E", 4),
    n("E", 5),
    n("A", 3),
  ]),
  make("intermediate-13", "Intermédiaire 13 — Position 5", 98, [
    n("E", 5),
    n("A", 5),
    n("D", 5),
    n("G", 5),
    n("G", 7),
    n("D", 7),
    n("A", 7),
    n("E", 7),
  ]),
  make("intermediate-14", "Intermédiaire 14 — Tonalité de Fa", 88, [
    n("E", 1),
    n("E", 3),
    n("A", 0),
    n("A", 1),
    n("A", 3),
    n("D", 0),
    n("D", 2),
    n("D", 3),
  ]),
  make("intermediate-15", "Intermédiaire 15 — Tonalité de Sib", 90, [
    n("A", 1),
    n("A", 3),
    n("D", 0),
    n("D", 1),
    n("D", 3),
    n("G", 0),
    n("G", 2),
    n("G", 3),
  ]),
  make("intermediate-16", "Intermédiaire 16 — Sauts de cordes", 100, [
    n("E", 5),
    n("D", 7),
    n("A", 5),
    n("G", 7),
  ]),
  make("intermediate-17", "Intermédiaire 17 — Descente de gamme", 94, [
    n("G", 5),
    n("G", 4),
    n("G", 2),
    n("D", 5),
    n("D", 3),
    n("D", 2),
    n("A", 5),
    n("A", 3),
  ]),
  make("intermediate-18", "Intermédiaire 18 — Rythme croches", 104, [
    n("E", 3, 0.5),
    n("E", 5, 0.5),
    n("A", 3, 0.5),
    n("A", 5, 0.5),
  ]),
  make("intermediate-19", "Intermédiaire 19 — Arpège majeur", 92, [
    n("E", 3),
    n("A", 2),
    n("A", 5),
    n("D", 5),
  ]),
  make("intermediate-20", "Intermédiaire 20 — Arpège mineur", 92, [
    n("E", 5),
    n("A", 3),
    n("A", 7),
    n("D", 7),
  ]),
];

const expertExercises: readonly BassExercise[] = [
  make("expert-01", "Avancé 1 — Chromatismes position 5", 116, [
    n("E", 5, 0.5),
    n("E", 6, 0.5),
    n("E", 7, 0.5),
    n("E", 8, 0.5),
    n("A", 5, 0.5),
    n("A", 6, 0.5),
    n("A", 7, 0.5),
    n("A", 8, 0.5),
  ]),
  make("expert-02", "Avancé 2 — Chromatismes inversés", 116, [
    n("G", 8, 0.5),
    n("G", 7, 0.5),
    n("G", 6, 0.5),
    n("G", 5, 0.5),
    n("D", 8, 0.5),
    n("D", 7, 0.5),
    n("D", 6, 0.5),
    n("D", 5, 0.5),
  ]),
  make("expert-03", "Avancé 3 — Modes trois notes par corde", 112, [
    n("E", 3, 0.5),
    n("E", 5, 0.5),
    n("E", 7, 0.5),
    n("A", 3, 0.5),
    n("A", 5, 0.5),
    n("A", 7, 0.5),
  ]),
  make("expert-04", "Avancé 4 — Arpèges septième", 108, [
    n("E", 3),
    n("A", 2),
    n("A", 5),
    n("D", 3),
    n("D", 5),
    n("G", 4),
  ]),
  make("expert-05", "Avancé 5 — Dominante 7", 108, [
    n("E", 3),
    n("A", 2),
    n("A", 5),
    n("D", 3),
  ]),
  make("expert-06", "Avancé 6 — Mineur 7", 108, [
    n("E", 5),
    n("A", 3),
    n("A", 7),
    n("D", 5),
  ]),
  make("expert-07", "Avancé 7 — Triades brisées", 116, [
    n("E", 3, 0.5),
    n("A", 2, 0.5),
    n("D", 5, 0.5),
    n("A", 2, 0.5),
  ]),
  make("expert-08", "Avancé 8 — Sauts d'octave rapides", 118, [
    n("E", 3, 0.5),
    n("D", 5, 0.5),
    n("A", 5, 0.5),
    n("G", 7, 0.5),
  ]),
  make("expert-09", "Avancé 9 — Extensions 9e", 106, [
    n("E", 3),
    n("A", 2),
    n("A", 5),
    n("D", 5),
    n("G", 4),
  ]),
  make("expert-10", "Avancé 10 — Motif fusion", 124, [
    n("E", 5, 0.5),
    n("A", 7, 0.5),
    n("D", 5, 0.5),
    n("G", 7, 0.5),
    n("D", 7, 0.5),
    n("A", 5, 0.5),
  ]),
  make("expert-11", "Avancé 11 — Traversée diagonale", 112, [
    n("E", 1),
    n("A", 3),
    n("D", 5),
    n("G", 7),
  ]),
  make("expert-12", "Avancé 12 — Retour diagonal", 112, [
    n("G", 7),
    n("D", 5),
    n("A", 3),
    n("E", 1),
  ]),
  make("expert-13", "Avancé 13 — Positions hautes", 104, [
    n("E", 8),
    n("A", 10),
    n("D", 10),
    n("G", 9),
  ]),
  make("expert-14", "Avancé 14 — Démanchés 3 à 9", 100, [
    n("E", 3),
    n("E", 5),
    n("A", 7),
    n("D", 9),
  ]),
  make("expert-15", "Avancé 15 — Cellule bebop", 118, [
    n("E", 3, 0.5),
    n("E", 4, 0.5),
    n("E", 5, 0.5),
    n("A", 2, 0.5),
    n("A", 3, 0.5),
    n("A", 5, 0.5),
  ]),
  make("expert-16", "Avancé 16 — Pédale et mélodie", 108, [
    n("E", 0, 0.5),
    n("D", 5, 0.5),
    n("E", 0, 0.5),
    n("G", 7, 0.5),
  ]),
  make("expert-17", "Avancé 17 — Motif metal", 126, [
    n("E", 0, 0.5),
    n("E", 3, 0.5),
    n("E", 5, 0.5),
    n("A", 5, 0.5),
  ]),
  make("expert-18", "Avancé 18 — Motif funk avancé", 120, [
    n("E", 5, 0.5),
    n("E", 7, 0.5),
    n("A", 5, 0.5),
    n("D", 7, 0.5),
    n("A", 7, 0.5),
    n("E", 5, 0.5),
  ]),
  make("expert-19", "Avancé 19 — Accords arpégés", 102, [
    n("E", 3),
    n("A", 5),
    n("D", 4),
    n("G", 5),
  ]),
  make("expert-20", "Avancé 20 — Synthèse manche", 116, [
    n("E", 0, 0.5),
    n("A", 3, 0.5),
    n("D", 5, 0.5),
    n("G", 7, 0.5),
    n("D", 9, 0.5),
    n("A", 10, 0.5),
    n("E", 12, 0.5),
    n("G", 12, 0.5),
  ]),
];

export const bassExerciseCategories: readonly BassExerciseCategory[] = [
  {
    id: "beginner",
    label: "Débutant",
    exercises: beginnerExercises,
  },
  {
    id: "intermediate",
    label: "Intermédiaires",
    exercises: intermediateExercises,
  },
  {
    id: "expert",
    label: "Avancé",
    exercises: expertExercises,
  },
];

export const bassExercises = bassExerciseCategories.flatMap(
  (category) => category.exercises,
);

export const bassBeginnerModules: readonly BassLearningModule[] =
  beginnerExerciseModules;
