import beginnerExerciseLibraryJson from "./instrumenta_bass_beginner_v1.json";
import type {
  BassExercise,
  BassLearningModule,
  BassNoteEvent,
  BassStringName,
  ExerciseIndication,
  IndicationType,
  LearningType,
} from "../types/music";

interface InstrumentTuningEntry {
  string: BassStringName;
  label: string;
  openMidiNote: number;
}

interface BassBeginnerExerciseJson {
  schemaVersion: string;
  libraryId: string;
  instrument: {
    id: string;
    label: string;
    tuning: InstrumentTuningEntry[];
  };
  indicationDisplayOrder: IndicationType[];
  modules: BassLearningModule[];
  exercises: JsonBeginnerExercise[];
}

interface JsonBeginnerExercise {
  id: string;
  order: number;
  category: "beginner";
  moduleId: string;
  title: string;
  subtitle: string;
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  lengthBeats: number;
  loop: boolean;
  learningType: LearningType;
  skills: {
    primary: string;
    secondary: string[];
  };
  prerequisites: string[];
  indications: ExerciseIndication[];
  events: BassNoteEvent[];
}

const openMidiByString: Record<BassStringName, number> = {
  E: 28,
  A: 33,
  D: 38,
  G: 43,
};

const beginnerLibrary =
  beginnerExerciseLibraryJson as unknown as BassBeginnerExerciseJson;

validateBeginnerLibrary(beginnerLibrary);

export const beginnerExerciseModules = beginnerLibrary.modules;

export const beginnerIndicationDisplayOrder =
  beginnerLibrary.indicationDisplayOrder;

export const beginnerExercises: readonly BassExercise[] =
  beginnerLibrary.exercises
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((exercise) => ({
      ...exercise,
      indicationDisplayOrder: beginnerLibrary.indicationDisplayOrder,
      events: exercise.events.map((event, index) => ({
        ...event,
        id: `${exercise.id}-note-${index + 1}`,
      })),
    }));

function validateBeginnerLibrary(library: BassBeginnerExerciseJson): void {
  const exerciseIds = new Set<string>();

  for (const exercise of library.exercises) {
    if (exerciseIds.has(exercise.id)) {
      throw new Error(`Identifiant d'exercice en doublon : ${exercise.id}`);
    }

    exerciseIds.add(exercise.id);

    for (const event of exercise.events) {
      const expectedMidiNote = openMidiByString[event.string] + event.fret;

      if (event.midiNote !== expectedMidiNote) {
        throw new Error(
          `Note MIDI incohérente dans ${exercise.id} : ${event.string}${event.fret}`,
        );
      }
    }
  }
}
