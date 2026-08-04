export interface BassSoundSettings {
  volume: number;
  tone: number;
  drive: number;
  distortion: number;
  delay: number;
  reverb: number;
}

export interface BassSoundPreset {
  id: string;
  name: string;
  settings: BassSoundSettings;
}

export const BASS_SOUND_PRESETS: readonly BassSoundPreset[] = [
  {
    id: "round-vintage",
    name: "Vintage rond",
    settings: { volume: 72, tone: 38, drive: 10, distortion: 0, delay: 0, reverb: 0 },
  },
  {
    id: "finger-warm",
    name: "Doigts chaud",
    settings: { volume: 76, tone: 48, drive: 16, distortion: 4, delay: 0, reverb: 0 },
  },
  {
    id: "clean-modern",
    name: "Moderne clair",
    settings: { volume: 70, tone: 72, drive: 8, distortion: 0, delay: 6, reverb: 4 },
  },
  {
    id: "pick-bright",
    name: "Mediator brillant",
    settings: { volume: 74, tone: 88, drive: 18, distortion: 8, delay: 4, reverb: 0 },
  },
  {
    id: "dub-deep",
    name: "Dub profond",
    settings: { volume: 80, tone: 24, drive: 6, distortion: 0, delay: 16, reverb: 8 },
  },
  {
    id: "rock-growl",
    name: "Rock grondant",
    settings: { volume: 78, tone: 58, drive: 48, distortion: 24, delay: 0, reverb: 4 },
  },
  {
    id: "funk-pop",
    name: "Funk claquant",
    settings: { volume: 73, tone: 82, drive: 24, distortion: 10, delay: 5, reverb: 0 },
  },
  {
    id: "upright-muted",
    name: "Contrebasse feutrée",
    settings: { volume: 84, tone: 10, drive: 3, distortion: 0, delay: 0, reverb: 18 },
  },
  {
    id: "garage-dirty",
    name: "Garage sale",
    settings: { volume: 77, tone: 46, drive: 72, distortion: 36, delay: 3, reverb: 6 },
  },
  {
    id: "synth-bass",
    name: "Synth basse",
    settings: { volume: 68, tone: 64, drive: 36, distortion: 14, delay: 12, reverb: 10 },
  },
];

export const DEFAULT_BASS_SOUND_PRESET_INDEX = 0;
