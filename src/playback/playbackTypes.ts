import type { BassNoteEvent } from "../types/music";

export type PlaybackStatus = "stopped" | "playing" | "paused";

export interface PlaybackSnapshot {
  status: PlaybackStatus;
  currentBeat: number;
  cursorRatio: number;
  activeEvents: BassNoteEvent[];
  durationBeats: number;
}
