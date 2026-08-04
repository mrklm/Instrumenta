import type { BassExercise, BassNoteEvent, BassStringName } from "../types/music";

const strings: readonly BassStringName[] = ["E", "A", "D", "G"];
const openMidiByString: Record<BassStringName, number> = {
  E: 28,
  A: 33,
  D: 38,
  G: 43,
};

const events: BassNoteEvent[] = strings.flatMap((string, stringIndex) =>
  Array.from({ length: 13 }, (_, fret) => {
    const eventIndex = stringIndex * 13 + fret;
    return {
      id: `exercise-05-${string}-${fret}`,
      startBeat: eventIndex * 0.5,
      durationBeats: 0.5,
      string,
      fret,
      midiNote: openMidiByString[string] + fret,
    };
  }),
);

export const exercise05: BassExercise = {
  id: "exercise-05",
  title: "Exercice 5 — Vérification manche",
  tempo: 70,
  timeSignature: {
    numerator: 4,
    denominator: 4,
  },
  loop: true,
  events,
};
