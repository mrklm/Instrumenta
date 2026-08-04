import type { BassNoteEvent } from "../types/music";

export interface AudioEngine {
  playNote(event: BassNoteEvent): void;
  stopNote(eventId: string): void;
  stopAll(): void;
  releaseAll(): void;
}
