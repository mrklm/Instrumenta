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

const knobLabels: Record<KnobKey, string> = {
  volume: "Volume",
  tone: "Tonalité",
  drive: "Drive",
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
    <section className="bassSoundDock" aria-label="Réglages du son de basse">
      <div className="bassSoundKnobs">
        {(Object.keys(knobLabels) as KnobKey[]).map((key) => (
          <label className="rotaryKnob" key={key}>
            <span>{knobLabels[key]}</span>
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
              aria-label={knobLabels[key]}
              onChange={(event) =>
                updateKnob(key, Number(event.currentTarget.value))
              }
            />
          </label>
        ))}
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
  );
}
