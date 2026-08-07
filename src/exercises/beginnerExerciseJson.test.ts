import { describe, expect, it } from "vitest";
import {
  bassBeginnerModules,
  bassExerciseCategories,
} from "./bassExerciseLibrary";
import { getExerciseDurationBeats } from "../music/noteUtils";

describe("beginnerExerciseJson", () => {
  it("charge les 20 exercices debutants depuis le JSON", () => {
    const beginnerCategory = bassExerciseCategories.find(
      (category) => category.id === "beginner",
    );

    expect(bassBeginnerModules).toHaveLength(4);
    expect(beginnerCategory?.exercises).toHaveLength(20);
    expect(beginnerCategory?.exercises[0]).toMatchObject({
      id: "beginner-01",
      title: "Jouer sur la pulsation",
      subtitle: "Corde E à vide",
      tempo: 60,
    });
  });

  it("conserve la duree lengthBeats meme quand des silences existent", () => {
    const beginnerCategory = bassExerciseCategories.find(
      (category) => category.id === "beginner",
    );
    const exerciseWithSilence = beginnerCategory?.exercises.find(
      (exercise) => exercise.id === "beginner-02",
    );

    expect(exerciseWithSilence).toBeDefined();
    expect(getExerciseDurationBeats(exerciseWithSilence!)).toBe(16);
  });
});
