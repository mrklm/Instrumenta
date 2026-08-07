import type { BassExercise, BassNoteEvent } from "../types/music";

export function midiNoteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function getExerciseDurationBeats(
  source: Pick<BassExercise, "events" | "lengthBeats"> | readonly BassNoteEvent[],
): number {
  const isExercise = "events" in source;
  const events = isExercise ? source.events : source;
  const eventDuration = events.reduce<number>(
    (duration, event) =>
      Math.max(duration, event.startBeat + event.durationBeats),
    0,
  );

  if (isExercise && source.lengthBeats !== undefined) {
    return Math.max(source.lengthBeats, eventDuration);
  }

  return eventDuration;
}
