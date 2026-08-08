import type { BassNoteEvent } from "../types/music";
import { midiNoteToFrequency } from "../music/noteUtils";
import type { BassSoundSettings } from "./bassSoundPresets";
import type { AudioEngine } from "./AudioEngine";

interface PlayingVoice {
  oscillator: OscillatorNode;
  harmonicOscillator: OscillatorNode;
  gain: GainNode;
  velocity: number;
}

interface EffectNodes {
  master: GainNode;
  dry: GainNode;
  delaySend: GainNode;
  delay: DelayNode;
  delayFeedback: GainNode;
  delayWet: GainNode;
  reverbSend: GainNode;
  reverb: ConvolverNode;
  reverbWet: GainNode;
}

export class SimpleBassSynth implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private effectNodes: EffectNodes | null = null;
  private readonly voices = new Map<string, PlayingVoice>();
  private previewNoteId = 0;
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

    if (this.settings.volume <= 0) {
      this.stopAll();
      return;
    }

    this.updateEffectNodes(this.audioContext.currentTime);
    this.updateVoiceGains(this.audioContext.currentTime);
  }

  public enable(): void {
    this.getContext();
  }

  public playPreviewNote(): void {
    const eventId = `bass-preview-${this.previewNoteId}`;
    this.previewNoteId += 1;

    this.playNote({
      id: eventId,
      startBeat: 0,
      durationBeats: 0.5,
      string: "A",
      fret: 7,
      midiNote: 40,
      velocity: 1,
    });

    window.setTimeout(() => this.stopNote(eventId), 320);
  }

  public playNote(event: BassNoteEvent): void {
    if (this.voices.has(event.id)) {
      return;
    }

    const outputGain = this.getOutputGain();

    if (outputGain <= 0) {
      return;
    }

    const context = this.getContext();
    const now = context.currentTime;
    const frequency = midiNoteToFrequency(event.midiNote);
    const velocity = event.velocity ?? 0.8;
    const oscillator = context.createOscillator();
    const harmonicOscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const drive = context.createWaveShaper();
    const gain = context.createGain();

    this.updateEffectNodes(now);

    oscillator.type = this.getOscillatorType();
    oscillator.frequency.setValueAtTime(frequency, now);
    harmonicOscillator.type = "triangle";
    harmonicOscillator.frequency.setValueAtTime(frequency * 2, now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.getToneFrequency(), now);
    filter.Q.setValueAtTime(0.75 + this.settings.drive / 140, now);
    drive.curve = this.createDriveCurve();
    drive.oversample = "2x";

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(outputGain * velocity, now + 0.012);
    gain.gain.linearRampToValueAtTime(outputGain * 0.64 * velocity, now + 0.18);

    oscillator.connect(filter);
    harmonicOscillator.connect(filter);
    filter.connect(drive);
    drive.connect(gain);
    gain.connect(this.getEffectNodes(context).master);
    oscillator.start(now);
    harmonicOscillator.start(now);

    this.voices.set(event.id, {
      oscillator,
      harmonicOscillator,
      gain,
      velocity,
    });
  }

  public stopNote(eventId: string): void {
    const voice = this.voices.get(eventId);

    if (!voice || !this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0), now);
    voice.gain.gain.linearRampToValueAtTime(0, now + 0.05);
    voice.oscillator.stop(now + 0.07);
    voice.harmonicOscillator.stop(now + 0.07);
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
      if (!this.audioContext) {
        continue;
      }

      const now = this.audioContext.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0), now);
      voice.gain.gain.linearRampToValueAtTime(0, now + 0.035);
      voice.oscillator.stop(now + 0.05);
      voice.harmonicOscillator.stop(now + 0.05);
    }

    this.voices.clear();
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.effectNodes = this.createEffectNodes(this.audioContext);
      this.updateEffectNodes(this.audioContext.currentTime);
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => undefined);
    }

    return this.audioContext;
  }

  private getToneFrequency(): number {
    return 900 + this.settings.tone * 44;
  }

  private getOutputGain(): number {
    if (this.settings.volume <= 0) {
      return 0;
    }

    return this.settings.volume * 0.0036;
  }

  private updateVoiceGains(now: number): void {
    const outputGain = this.getOutputGain();

    for (const voice of this.voices.values()) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0), now);
      voice.gain.gain.linearRampToValueAtTime(
        outputGain * 0.64 * voice.velocity,
        now + 0.035,
      );
    }
  }

  private getOscillatorType(): OscillatorType {
    if (this.settings.drive >= 45 || this.settings.distortion >= 24) {
      return "sawtooth";
    }

    if (this.settings.tone <= 18) {
      return "triangle";
    }

    return "square";
  }

  private createDriveCurve(): Float32Array<ArrayBuffer> {
    const samples = 256;
    const curve = new Float32Array(
      new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT),
    );
    const amount = 1 + this.settings.drive * 0.18 + this.settings.distortion * 0.32;

    for (let index = 0; index < samples; index += 1) {
      const x = (index * 2) / samples - 1;
      curve[index] = Math.tanh(x * amount);
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
    const master = context.createGain();
    const dry = context.createGain();
    const delaySend = context.createGain();
    const delay = context.createDelay(0.75);
    const delayFeedback = context.createGain();
    const delayWet = context.createGain();
    const reverbSend = context.createGain();
    const reverb = context.createConvolver();
    const reverbWet = context.createGain();

    master.gain.value = 1;
    dry.gain.value = 1;
    delaySend.gain.value = 0;
    delayFeedback.gain.value = 0;
    delayWet.gain.value = 0;
    reverbSend.gain.value = 0;
    reverbWet.gain.value = 0;
    delay.delayTime.value = 0.14;
    reverb.buffer = this.createReverbImpulse(context);

    master.connect(dry);
    dry.connect(context.destination);
    master.connect(delaySend);
    delaySend.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(context.destination);
    master.connect(reverbSend);
    reverbSend.connect(reverb);
    reverb.connect(reverbWet);
    reverbWet.connect(context.destination);

    return {
      master,
      dry,
      delaySend,
      delay,
      delayFeedback,
      delayWet,
      reverbSend,
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
    const effectDucking = Math.min(
      delayAmount * 0.12 + reverbAmount * 0.22,
      0.32,
    );

    this.effectNodes.dry.gain.setTargetAtTime(1 - effectDucking, now, 0.025);
    this.effectNodes.delaySend.gain.setTargetAtTime(
      delayAmount * 0.85,
      now,
      0.025,
    );
    this.effectNodes.delay.delayTime.setTargetAtTime(
      0.12 + delayAmount * 0.34,
      now,
      0.025,
    );
    this.effectNodes.delayFeedback.gain.setTargetAtTime(
      delayAmount * 0.42,
      now,
      0.025,
    );
    this.effectNodes.delayWet.gain.setTargetAtTime(
      delayAmount * 0.48,
      now,
      0.025,
    );
    this.effectNodes.reverbSend.gain.setTargetAtTime(
      reverbAmount * 1.2,
      now,
      0.025,
    );
    this.effectNodes.reverbWet.gain.setTargetAtTime(
      reverbAmount * 0.7,
      now,
      0.025,
    );
  }

  private clearEffectTails(): void {
    if (!this.audioContext || !this.effectNodes) {
      return;
    }

    const now = this.audioContext.currentTime;
    this.effectNodes.delaySend.gain.cancelScheduledValues(now);
    this.effectNodes.delayFeedback.gain.cancelScheduledValues(now);
    this.effectNodes.delayWet.gain.cancelScheduledValues(now);
    this.effectNodes.reverbSend.gain.cancelScheduledValues(now);
    this.effectNodes.reverbWet.gain.cancelScheduledValues(now);
    this.effectNodes.dry.gain.setValueAtTime(1, now);
    this.effectNodes.delaySend.gain.setValueAtTime(0, now);
    this.effectNodes.delayFeedback.gain.setValueAtTime(0, now);
    this.effectNodes.delayWet.gain.setValueAtTime(0, now);
    this.effectNodes.reverbSend.gain.setValueAtTime(0, now);
    this.effectNodes.reverbWet.gain.setValueAtTime(0, now);
  }

  private createReverbImpulse(context: AudioContext): AudioBuffer {
    const duration = 4.6;
    const length = Math.floor(context.sampleRate * duration);
    const impulse = context.createBuffer(2, length, context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);

      for (let index = 0; index < length; index += 1) {
        const progress = index / length;
        const earlyReflection = Math.sin(index * 0.013 + channel) * 0.18;
        const wideTail = Math.random() * 2 - 1;
        data[index] =
          (wideTail + earlyReflection) *
          (1 - progress) ** 1.18 *
          (channel === 0 ? 1 : -0.96);
      }
    }

    return impulse;
  }
}
