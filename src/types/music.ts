export type BassStringName = "E" | "A" | "D" | "G";

export type Handedness = "right" | "left";

export interface BassExercise {
  id: string;
  title: string;
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  loop: boolean;
  events: BassNoteEvent[];
}

export interface BassNoteEvent {
  id: string;
  startBeat: number;
  durationBeats: number;
  string: BassStringName;
  fret: number;
  midiNote: number;
  velocity?: number;
}
