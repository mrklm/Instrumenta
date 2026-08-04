import type { BassNoteEvent } from "../types/music";

export function midiNoteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function getExerciseDurationBeats(events: readonly BassNoteEvent[]): number {
  return events.reduce(
    (duration, event) =>
      Math.max(duration, event.startBeat + event.durationBeats),
    0,
  );
}
