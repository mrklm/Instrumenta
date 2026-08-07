import { describe, expect, it } from "vitest";
import { getExerciseTickerText } from "./ExerciseTicker";
import type { BassExercise } from "../../types/music";

const exercise: BassExercise = {
  id: "test",
  title: "Test",
  tempo: 80,
  timeSignature: {
    numerator: 4,
    denominator: 4,
  },
  loop: true,
  indicationDisplayOrder: ["objective", "advice"],
  indications: [
    {
      type: "objective",
      label: "OBJECTIF",
      text: "Gardez la main droite détendue.",
    },
    {
      type: "advice",
      label: "CONSEIL",
      text: "Ne regardez pas constamment la main gauche.",
    },
  ],
  events: [],
};

describe("getExerciseTickerText", () => {
  it("conserve les indications en mode droitier", () => {
    expect(getExerciseTickerText(exercise, "right")).toContain(
      "main droite détendue",
    );
    expect(getExerciseTickerText(exercise, "right")).toContain("main gauche");
  });

  it("inverse les indications de mains en mode gaucher", () => {
    const text = getExerciseTickerText(exercise, "left");

    expect(text).toContain("main gauche détendue");
    expect(text).toContain("main droite");
  });
});
