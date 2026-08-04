import { describe, expect, it } from "vitest";
import {
  getActiveEventsAtBeat,
  getCursorRatio,
  millisecondsPerBeat,
  PlaybackEngine,
} from "./PlaybackEngine";
import { exercise01 } from "../exercises/exercise01";

describe("PlaybackEngine", () => {
  it("convertit un tempo en millisecondes par temps", () => {
    expect(millisecondsPerBeat(120)).toBe(500);
    expect(millisecondsPerBeat(80)).toBe(750);
  });

  it("detecte une note active pendant toute sa duree", () => {
    const activeAtStart = getActiveEventsAtBeat(exercise01.events, 0.5);
    const inactiveAtEnd = getActiveEventsAtBeat(exercise01.events, 1);

    expect(activeAtStart.map((event) => event.id)).toEqual([
      "exercise-01-note-1",
    ]);
    expect(inactiveAtEnd.map((event) => event.id)).toEqual([
      "exercise-01-note-2",
    ]);
  });

  it("calcule la position du curseur dans l'exercice", () => {
    expect(getCursorRatio(4, 16)).toBe(0.25);
    expect(getCursorRatio(20, 16)).toBe(1);
  });

  it("redemarre l'exercice depuis le debut", () => {
    let now = 0;
    const engine = new PlaybackEngine({
      exercise: exercise01,
      tempo: 60,
      loop: false,
      now: () => now,
    });

    engine.play();
    now = 3200;
    expect(engine.getSnapshot().currentBeat).toBeCloseTo(3.2);

    const restarted = engine.restart();
    expect(restarted.currentBeat).toBe(0);
    expect(restarted.status).toBe("playing");
  });

  it("stoppe l'exercice et revient au debut", () => {
    let now = 0;
    const engine = new PlaybackEngine({
      exercise: exercise01,
      tempo: 60,
      loop: false,
      now: () => now,
    });

    engine.play();
    now = 2400;
    expect(engine.getSnapshot().currentBeat).toBeCloseTo(2.4);

    const stopped = engine.stop();
    expect(stopped.currentBeat).toBe(0);
    expect(stopped.status).toBe("stopped");
    expect(stopped.activeEvents).toEqual([]);
  });

  it("boucle en fin d'exercice quand la boucle est active", () => {
    let now = 0;
    const engine = new PlaybackEngine({
      exercise: exercise01,
      tempo: 60,
      loop: true,
      now: () => now,
    });

    engine.play();
    now = 17250;

    const snapshot = engine.getSnapshot();
    expect(snapshot.currentBeat).toBeCloseTo(1.25);
    expect(snapshot.status).toBe("playing");
  });

  it("peut lancer un nouvel exercice depuis le debut", () => {
    let now = 0;
    const engine = new PlaybackEngine({
      exercise: exercise01,
      tempo: 60,
      loop: true,
      now: () => now,
    });

    now = 4000;
    const snapshot = engine.playFromStart();

    expect(snapshot.currentBeat).toBe(0);
    expect(snapshot.status).toBe("playing");
  });
});
