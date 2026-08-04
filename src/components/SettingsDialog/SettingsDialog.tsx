import type { Handedness } from "../../types/music";
import { THEME_NAMES, type ThemeName } from "../../theme/themes";
import "./SettingsDialog.css";

type Instrument = "bass";

interface SettingsDialogProps {
  isOpen: boolean;
  themeName: ThemeName;
  handedness: Handedness;
  instrument: Instrument;
  onClose: () => void;
  onThemeChange: (themeName: ThemeName) => void;
  onHandednessChange: (handedness: Handedness) => void;
  onInstrumentChange: (instrument: Instrument) => void;
}

export function SettingsDialog({
  isOpen,
  themeName,
  handedness,
  instrument,
  onClose,
  onThemeChange,
  onHandednessChange,
  onInstrumentChange,
}: SettingsDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settingsOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="settingsDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="settingsHeader">
          <h2 id="settings-title">Réglages</h2>
          <button type="button" className="settingsClose" onClick={onClose}>
            Fermer
          </button>
        </header>

        <label className="settingsField">
          <span>Thème</span>
          <select
            value={themeName}
            onChange={(event) =>
              onThemeChange(event.currentTarget.value as ThemeName)
            }
          >
            {THEME_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="settingsField">
          <span>Instrument</span>
          <select
            value={instrument}
            onChange={(event) =>
              onInstrumentChange(event.currentTarget.value as Instrument)
            }
          >
            <option value="bass">Basse</option>
          </select>
        </label>

        <fieldset className="settingsFieldset">
          <legend>Orientation</legend>
          <label>
            <input
              type="radio"
              name="settings-handedness"
              checked={handedness === "right"}
              onChange={() => onHandednessChange("right")}
            />
            Mode droitier
          </label>
          <label>
            <input
              type="radio"
              name="settings-handedness"
              checked={handedness === "left"}
              onChange={() => onHandednessChange("left")}
            />
            Mode gaucher
          </label>
        </fieldset>
      </section>
    </div>
  );
}

export type { Instrument };
