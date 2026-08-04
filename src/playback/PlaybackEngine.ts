import type { BassExercise, BassNoteEvent } from "../types/music";
import { getExerciseDurationBeats } from "../music/noteUtils";
import type { PlaybackSnapshot, PlaybackStatus } from "./playbackTypes";

export function millisecondsPerBeat(tempo: number): number {
  return 60000 / tempo;
}

export function beatToMilliseconds(beat: number, tempo: number): number {
  return beat * millisecondsPerBeat(tempo);
}

export function getActiveEventsAtBeat(
  events: readonly BassNoteEvent[],
  currentBeat: number,
): BassNoteEvent[] {
  return events.filter(
    (event) =>
      currentBeat >= event.startBeat &&
      currentBeat < event.startBeat + event.durationBeats,
  );
}

export function getCursorRatio(currentBeat: number, durationBeats: number): number {
  if (durationBeats <= 0) {
    return 0;
  }

  return Math.min(Math.max(currentBeat / durationBeats, 0), 1);
}

export function wrapBeatForLoop(currentBeat: number, durationBeats: number): number {
  if (durationBeats <= 0) {
    return 0;
  }

  return currentBeat % durationBeats;
}

export interface PlaybackEngineOptions {
  exercise: BassExercise;
  tempo: number;
  loop: boolean;
  now?: () => number;
}

export class PlaybackEngine {
  private readonly exercise: BassExercise;
  private readonly now: () => number;
  private tempo: number;
  private loop: boolean;
  private status: PlaybackStatus = "stopped";
  private startedAtMs = 0;
  private pausedBeat = 0;
  private currentBeat = 0;
  private readonly durationBeats: number;

  public constructor(options: PlaybackEngineOptions) {
    this.exercise = options.exercise;
    this.tempo = options.tempo;
    this.loop = options.loop;
    this.now = options.now ?? performance.now.bind(performance);
    this.durationBeats = getExerciseDurationBeats(this.exercise.events);
  }

  public play(): PlaybackSnapshot {
    if (this.status !== "playing") {
      this.startedAtMs =
        this.now() - beatToMilliseconds(this.pausedBeat, this.tempo);
      this.status = "playing";
    }

    return this.getSnapshot();
  }

  public playFromStart(): PlaybackSnapshot {
    this.currentBeat = 0;
    this.pausedBeat = 0;
    this.startedAtMs = this.now();
    this.status = "playing";
    return this.getSnapshot();
  }

  public pause(): PlaybackSnapshot {
    this.updateCurrentBeat();
    this.pausedBeat = this.currentBeat;
    this.status = "paused";
    return this.getSnapshot();
  }

  public stop(): PlaybackSnapshot {
    this.currentBeat = 0;
    this.pausedBeat = 0;
    this.status = "stopped";
    return this.getSnapshot();
  }

  public restart(): PlaybackSnapshot {
    this.currentBeat = 0;
    this.pausedBeat = 0;
    this.startedAtMs = this.now();

    if (this.status === "playing") {
      this.status = "playing";
    } else {
      this.status = "stopped";
    }

    return this.getSnapshot();
  }

  public setTempo(tempo: number): PlaybackSnapshot {
    this.updateCurrentBeat();
    this.tempo = tempo;

    if (this.status === "playing") {
      this.startedAtMs =
        this.now() - beatToMilliseconds(this.currentBeat, this.tempo);
    } else {
      this.pausedBeat = this.currentBeat;
    }

    return this.getSnapshot();
  }

  public setLoop(loop: boolean): PlaybackSnapshot {
    this.loop = loop;
    return this.getSnapshot();
  }

  public getSnapshot(): PlaybackSnapshot {
    this.updateCurrentBeat();

    return {
      status: this.status,
      currentBeat: this.currentBeat,
      cursorRatio: getCursorRatio(this.currentBeat, this.durationBeats),
      activeEvents:
        this.status === "stopped"
          ? []
          : getActiveEventsAtBeat(this.exercise.events, this.currentBeat),
      durationBeats: this.durationBeats,
    };
  }

  private updateCurrentBeat(): void {
    if (this.status !== "playing") {
      return;
    }

    const elapsedMs = this.now() - this.startedAtMs;
    const elapsedBeats = elapsedMs / millisecondsPerBeat(this.tempo);

    if (elapsedBeats >= this.durationBeats) {
      if (this.loop) {
        this.currentBeat = wrapBeatForLoop(elapsedBeats, this.durationBeats);
        return;
      }

      this.currentBeat = this.durationBeats;
      this.pausedBeat = 0;
      this.status = "stopped";
      return;
    }

    this.currentBeat = elapsedBeats;
  }
}
