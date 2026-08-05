import type { BassExercise, BassNoteEvent } from "../types/music";

export function createExerciseEvents(
  exerciseId: string,
  motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[],
  lengthBeats = 16,
): BassNoteEvent[] {
  return Array.from({ length: lengthBeats }, (_, index) => {
    const note = motif[index % motif.length];
    return {
      ...note,
      id: `${exerciseId}-note-${index + 1}`,
      startBeat: index,
    };
  });
}

export function createFourMeasureExercise(
  id: string,
  title: string,
  tempo: number,
  motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[],
): BassExercise {
  return {
    id,
    title,
    tempo,
    timeSignature: {
      numerator: 4,
      denominator: 4,
    },
    loop: true,
    events: createExerciseEvents(id, motif),
  };
}

export function createPatternExercise(
  id: string,
  title: string,
  tempo: number,
  motif: readonly Omit<BassNoteEvent, "id" | "startBeat">[],
  lengthBeats = 16,
): BassExercise {
  return {
    id,
    title,
    tempo,
    timeSignature: {
      numerator: 4,
      denominator: 4,
    },
    loop: true,
    events: createExerciseEvents(id, motif, lengthBeats),
  };
}
