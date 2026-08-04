import type { BassStringName } from "../types/music";

export interface BassStringTuning {
  name: BassStringName;
  midiNote: number;
}

export const STANDARD_BASS_TUNING: readonly BassStringTuning[] = [
  { name: "E", midiNote: 28 },
  { name: "A", midiNote: 33 },
  { name: "D", midiNote: 38 },
  { name: "G", midiNote: 43 },
];

export const DEFAULT_VISUAL_STRING_ORDER: readonly BassStringName[] = [
  "G",
  "D",
  "A",
  "E",
];
