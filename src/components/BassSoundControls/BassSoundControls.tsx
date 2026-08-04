import type { CSSProperties } from "react";
import type { BassSoundSettings } from "../../audio/bassSoundPresets";
import "./BassSoundControls.css";

interface BassSoundControlsProps {
  presetName: string;
  settings: BassSoundSettings;
  onSettingsChange: (settings: BassSoundSettings) => void;
  onPreviousPreset: () => void;
  onNextPreset: () => void;
}

type KnobKey = keyof BassSoundSettings;
type BassToneKnobKey = "volume" | "tone" | "drive";
type BassEffectKnobKey = "distortion" | "delay" | "reverb";

const toneKnobLabels: Record<BassToneKnobKey, string> = {
  volume: "Volume",
  tone: "Tonalité",
  drive: "Drive",
};

const effectKnobLabels: Record<BassEffectKnobKey, string> = {
  distortion: "Disto",
  delay: "Delay",
  reverb: "Reverb",
};

export function BassSoundControls({
  presetName,
  settings,
  onSettingsChange,
  onPreviousPreset,
  onNextPreset,
}: BassSoundControlsProps) {
  const updateKnob = (key: KnobKey, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="bassSoundStack" aria-label="Réglages du son de basse">
      <section className="bassSoundDock">
        <div className="bassSoundKnobs">
          {renderKnobs(toneKnobLabels, settings, updateKnob)}
        </div>

        <div className="presetStepper">
          <button type="button" onClick={onPreviousPreset} aria-label="Son précédent">
            -
          </button>
          <div className="presetDisplay" aria-label={`Son actuel : ${presetName}`}>
            <span>{presetName}</span>
          </div>
          <button type="button" onClick={onNextPreset} aria-label="Son suivant">
            +
          </button>
        </div>
      </section>

      <section className="bassSoundDock bassEffectsDock" aria-label="Effets de basse">
        <div className="bassSoundKnobs">
          {renderKnobs(effectKnobLabels, settings, updateKnob)}
        </div>
      </section>
    </div>
  );
}

function renderKnobs<T extends KnobKey>(
  labels: Record<T, string>,
  settings: BassSoundSettings,
  onChange: (key: T, value: number) => void,
) {
  return (Object.keys(labels) as T[]).map((key) => (
    <label className="rotaryKnob" key={key}>
      <span>{labels[key]}</span>
      <span
        className="knobFace"
        style={
          {
            "--knob-rotation": `${settings[key] * 2.7 - 135}deg`,
          } as CSSProperties
        }
      >
        <span className="knobIndicator" />
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={settings[key]}
        aria-label={labels[key]}
        onChange={(event) => onChange(key, Number(event.currentTarget.value))}
      />
    </label>
  ));
}
