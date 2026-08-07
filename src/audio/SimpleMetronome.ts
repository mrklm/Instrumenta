export type MetronomeSound = "click" | "wood" | "bell" | "beep" | "noise";

export interface MetronomeSettings {
  volume: number;
  sound: MetronomeSound;
}

export const METRONOME_SOUND_OPTIONS: readonly {
  value: MetronomeSound;
  label: string;
}[] = [
  { value: "click", label: "Studio" },
  { value: "wood", label: "Bois sec" },
  { value: "bell", label: "Cloche" },
  { value: "beep", label: "Beep digital" },
  { value: "noise", label: "Tac feutre" },
];

export class SimpleMetronome {
  private audioContext: AudioContext | null = null;
  private settings: MetronomeSettings = {
    volume: 70,
    sound: "click",
  };

  public setSettings(settings: MetronomeSettings): void {
    this.settings = settings;
  }

  public enable(): void {
    this.getContext();
  }

  public playBeat(isDownbeat: boolean): void {
    const context = this.getContext();
    const now = context.currentTime;
    const output = context.createGain();

    output.gain.setValueAtTime(0.0001, now);
    output.gain.exponentialRampToValueAtTime(this.getGain(isDownbeat), now + 0.006);
    output.gain.exponentialRampToValueAtTime(0.0001, now + this.getDecay());
    output.connect(context.destination);

    if (this.settings.sound === "noise") {
      this.playNoiseTick(context, output, now);
      return;
    }

    this.playOscillatorTick(context, output, now, isDownbeat);
  }

  public stop(): void {}

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => undefined);
    }

    return this.audioContext;
  }

  private playOscillatorTick(
    context: AudioContext,
    output: GainNode,
    now: number,
    isDownbeat: boolean,
  ): void {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();

    oscillator.type = this.getOscillatorType();
    oscillator.frequency.setValueAtTime(this.getFrequency(isDownbeat), now);
    filter.type = this.settings.sound === "wood" ? "bandpass" : "highpass";
    filter.frequency.setValueAtTime(this.getFilterFrequency(), now);
    filter.Q.setValueAtTime(this.settings.sound === "wood" ? 8 : 1.2, now);

    oscillator.connect(filter);
    filter.connect(output);
    oscillator.start(now);
    oscillator.stop(now + this.getDecay() + 0.02);
  }

  private playNoiseTick(context: AudioContext, output: GainNode, now: number): void {
    const samples = Math.floor(context.sampleRate * 0.045);
    const buffer = context.createBuffer(1, samples, context.sampleRate);
    const channelData = buffer.getChannelData(0);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();

    for (let index = 0; index < samples; index += 1) {
      channelData[index] = (Math.random() * 2 - 1) * (1 - index / samples);
    }

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3.5, now);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(output);
    source.start(now);
    source.stop(now + 0.05);
  }

  private getGain(isDownbeat: boolean): number {
    const accent = isDownbeat ? 1.25 : 1;
    return (0.12 + this.settings.volume * 0.0116) * accent;
  }

  private getDecay(): number {
    if (this.settings.sound === "bell") {
      return 0.16;
    }

    if (this.settings.sound === "beep") {
      return 0.08;
    }

    return 0.045;
  }

  private getFrequency(isDownbeat: boolean): number {
    const accentOffset = isDownbeat ? 1.55 : 1;

    switch (this.settings.sound) {
      case "wood":
        return 960 * accentOffset;
      case "bell":
        return 1320 * accentOffset;
      case "beep":
        return 1760 * accentOffset;
      case "click":
      default:
        return 2200 * accentOffset;
    }
  }

  private getFilterFrequency(): number {
    return this.settings.sound === "wood" ? 1050 : 1600;
  }

  private getOscillatorType(): OscillatorType {
    if (this.settings.sound === "bell") {
      return "sine";
    }

    if (this.settings.sound === "beep") {
      return "square";
    }

    return "triangle";
  }
}
