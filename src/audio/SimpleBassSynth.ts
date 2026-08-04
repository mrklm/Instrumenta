import type { BassNoteEvent } from "../types/music";
import { midiNoteToFrequency } from "../music/noteUtils";
import type { BassSoundSettings } from "./bassSoundPresets";
import type { AudioEngine } from "./AudioEngine";

interface PlayingVoice {
  oscillator: OscillatorNode;
  filter: BiquadFilterNode;
  shaper: WaveShaperNode;
  gain: GainNode;
}

export class SimpleBassSynth implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private readonly voices = new Map<string, PlayingVoice>();
  private settings: BassSoundSettings = {
    volume: 72,
    tone: 38,
    drive: 10,
  };

  public setSettings(settings: BassSoundSettings): void {
    this.settings = settings;

    if (!this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    for (const voice of this.voices.values()) {
      voice.filter.frequency.setTargetAtTime(this.getToneFrequency(), now, 0.02);
      voice.shaper.curve = this.createDriveCurve();
      voice.oscillator.type = this.getOscillatorType();
    }
  }

  public playNote(event: BassNoteEvent): void {
    if (this.voices.has(event.id)) {
      return;
    }

    const context = this.getContext();
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const shaper = context.createWaveShaper();
    const gain = context.createGain();
    const now = context.currentTime;
    const velocity = event.velocity ?? 0.74;

    oscillator.type = this.getOscillatorType();
    oscillator.frequency.setValueAtTime(midiNoteToFrequency(event.midiNote), now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.getToneFrequency(), now);
    filter.Q.setValueAtTime(0.75 + this.settings.drive / 80, now);
    shaper.curve = this.createDriveCurve();
    shaper.oversample = "2x";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      this.getOutputGain() * velocity,
      now + 0.018,
    );
    gain.gain.exponentialRampToValueAtTime(
      this.getOutputGain() * 0.58 * velocity,
      now + 0.16,
    );

    oscillator.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);

    this.voices.set(event.id, { oscillator, filter, shaper, gain });
  }

  public stopNote(eventId: string): void {
    const voice = this.voices.get(eventId);

    if (!voice || !this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    voice.oscillator.stop(now + 0.06);
    this.voices.delete(eventId);
  }

  public stopAll(): void {
    for (const eventId of this.voices.keys()) {
      this.stopNote(eventId);
    }
  }

  private getContext(): AudioContext {
    if (this.audioContext) {
      return this.audioContext;
    }

    this.audioContext = new AudioContext();
    return this.audioContext;
  }

  private getToneFrequency(): number {
    return 250 + this.settings.tone * 52;
  }

  private getOutputGain(): number {
    return 0.045 + this.settings.volume * 0.0017;
  }

  private getOscillatorType(): OscillatorType {
    if (this.settings.tone <= 14 && this.settings.drive <= 8) {
      return "triangle";
    }

    if (this.settings.drive >= 34) {
      return "sawtooth";
    }

    return "square";
  }

  private createDriveCurve(): Float32Array<ArrayBuffer> {
    const samples = 256;
    const curve = new Float32Array(
      new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT),
    );
    const amount = 1 + this.settings.drive * 0.18;

    for (let index = 0; index < samples; index += 1) {
      const x = (index * 2) / samples - 1;
      curve[index] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
    }

    return curve;
  }
}
