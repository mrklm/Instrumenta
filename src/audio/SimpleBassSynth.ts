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

interface EffectNodes {
  input: GainNode;
  delay: DelayNode;
  delayFeedback: GainNode;
  delayWet: GainNode;
  reverb: ConvolverNode;
  reverbWet: GainNode;
}

export class SimpleBassSynth implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private effectNodes: EffectNodes | null = null;
  private readonly voices = new Map<string, PlayingVoice>();
  private settings: BassSoundSettings = {
    volume: 72,
    tone: 38,
    drive: 10,
    distortion: 0,
    delay: 0,
    reverb: 0,
  };

  public setSettings(settings: BassSoundSettings): void {
    this.settings = settings;

    if (!this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    this.updateEffectNodes(now);

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

    this.updateEffectNodes(now);
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
    gain.connect(this.getEffectNodes(context).input);
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

    this.clearEffectTails();
  }

  public releaseAll(): void {
    for (const voice of this.voices.values()) {
      if (this.audioContext) {
        const now = this.audioContext.currentTime;
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
        voice.oscillator.stop(now + 0.04);
      }
    }

    this.voices.clear();
  }

  private getContext(): AudioContext {
    if (this.audioContext) {
      return this.audioContext;
    }

    this.audioContext = new AudioContext();
    this.effectNodes = this.createEffectNodes(this.audioContext);
    this.updateEffectNodes(this.audioContext.currentTime);
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
    const amount =
      1 + this.settings.drive * 0.18 + this.settings.distortion * 0.46;

    for (let index = 0; index < samples; index += 1) {
      const x = (index * 2) / samples - 1;
      curve[index] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
    }

    return curve;
  }

  private getEffectNodes(context: AudioContext): EffectNodes {
    if (!this.effectNodes) {
      this.effectNodes = this.createEffectNodes(context);
    }

    return this.effectNodes;
  }

  private createEffectNodes(context: AudioContext): EffectNodes {
    const input = context.createGain();
    const delay = context.createDelay(0.75);
    const delayFeedback = context.createGain();
    const delayWet = context.createGain();
    const reverb = context.createConvolver();
    const reverbWet = context.createGain();

    input.gain.value = 1;
    delayFeedback.gain.value = 0;
    delayWet.gain.value = 0;
    reverbWet.gain.value = 0;
    delay.delayTime.value = 0.14;
    reverb.buffer = this.createReverbImpulse(context);
    input.connect(context.destination);
    input.connect(delay);
    input.connect(reverb);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(context.destination);
    reverb.connect(reverbWet);
    reverbWet.connect(context.destination);

    return {
      input,
      delay,
      delayFeedback,
      delayWet,
      reverb,
      reverbWet,
    };
  }

  private updateEffectNodes(now: number): void {
    if (!this.effectNodes) {
      return;
    }

    const delayAmount = this.settings.delay / 100;
    const reverbAmount = this.settings.reverb / 100;

    this.effectNodes.delay.delayTime.setTargetAtTime(
      0.09 + delayAmount * 0.28,
      now,
      0.04,
    );
    this.effectNodes.delayFeedback.gain.setTargetAtTime(
      delayAmount * 0.28,
      now,
      0.04,
    );
    this.effectNodes.delayWet.gain.setTargetAtTime(
      delayAmount * 0.18,
      now,
      0.04,
    );
    this.effectNodes.reverbWet.gain.setTargetAtTime(
      reverbAmount * 0.16,
      now,
      0.04,
    );
  }

  private clearEffectTails(): void {
    if (!this.audioContext || !this.effectNodes) {
      return;
    }

    const now = this.audioContext.currentTime;
    this.effectNodes.delayFeedback.gain.cancelScheduledValues(now);
    this.effectNodes.delayWet.gain.cancelScheduledValues(now);
    this.effectNodes.reverbWet.gain.cancelScheduledValues(now);
    this.effectNodes.delayFeedback.gain.setValueAtTime(0, now);
    this.effectNodes.delayWet.gain.setValueAtTime(0, now);
    this.effectNodes.reverbWet.gain.setValueAtTime(0, now);
  }

  private createReverbImpulse(context: AudioContext): AudioBuffer {
    const duration = 0.85;
    const length = Math.floor(context.sampleRate * duration);
    const impulse = context.createBuffer(2, length, context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);

      for (let index = 0; index < length; index += 1) {
        const progress = index / length;
        data[index] = (Math.random() * 2 - 1) * (1 - progress) ** 2.4;
      }
    }

    return impulse;
  }
}
