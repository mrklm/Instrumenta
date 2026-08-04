export interface BassSoundSettings {
  volume: number;
  tone: number;
  drive: number;
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
    settings: { volume: 72, tone: 38, drive: 10 },
  },
  {
    id: "finger-warm",
    name: "Doigts chaud",
    settings: { volume: 76, tone: 48, drive: 16 },
  },
  {
    id: "clean-modern",
    name: "Moderne clair",
    settings: { volume: 70, tone: 72, drive: 8 },
  },
  {
    id: "pick-bright",
    name: "Mediator brillant",
    settings: { volume: 74, tone: 88, drive: 18 },
  },
  {
    id: "dub-deep",
    name: "Dub profond",
    settings: { volume: 80, tone: 24, drive: 6 },
  },
  {
    id: "rock-growl",
    name: "Rock grondant",
    settings: { volume: 78, tone: 58, drive: 48 },
  },
  {
    id: "funk-pop",
    name: "Funk claquant",
    settings: { volume: 73, tone: 82, drive: 24 },
  },
  {
    id: "upright-muted",
    name: "Contrebasse feutrée",
    settings: { volume: 84, tone: 10, drive: 3 },
  },
  {
    id: "garage-dirty",
    name: "Garage sale",
    settings: { volume: 77, tone: 46, drive: 72 },
  },
  {
    id: "synth-bass",
    name: "Synth basse",
    settings: { volume: 68, tone: 64, drive: 36 },
  },
];

export const DEFAULT_BASS_SOUND_PRESET_INDEX = 0;
