export type BassStringName = "E" | "A" | "D" | "G";

export type Handedness = "right" | "left";

export type ExerciseCategory = "beginner" | "intermediate" | "expert";

export type IndicationType =
  | "objective"
  | "advice"
  | "listenFor"
  | "success";

export type LearningType =
  | "discovery"
  | "consolidation"
  | "application"
  | "challenge";

export interface ExerciseIndication {
  type: IndicationType;
  label: string;
  text: string;
}

export interface BassLearningModule {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface BassExerciseSkills {
  primary: string;
  secondary: string[];
}

export interface BassExercise {
  id: string;
  order?: number;
  category?: ExerciseCategory;
  moduleId?: string;
  title: string;
  subtitle?: string;
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  lengthBeats?: number;
  loop: boolean;
  learningType?: LearningType;
  skills?: BassExerciseSkills;
  prerequisites?: string[];
  indications?: ExerciseIndication[];
  indicationDisplayOrder?: IndicationType[];
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
