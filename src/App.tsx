import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASS_SOUND_PRESETS,
  DEFAULT_BASS_SOUND_PRESET_INDEX,
  type BassSoundSettings,
} from "./audio/bassSoundPresets";
import { APP_VERSION } from "./appVersion";
import { DEFAULT_HAND_SKIN_ID, getHandSkinById } from "./assets/handSkins";
import { SimpleBassSynth } from "./audio/SimpleBassSynth";
import { BassFretboard } from "./components/BassFretboard/BassFretboard";
import { BassSoundControls } from "./components/BassSoundControls/BassSoundControls";
import { BassTablature } from "./components/BassTablature/BassTablature";
import {
  SettingsDialog,
  type Instrument,
} from "./components/SettingsDialog/SettingsDialog";
import { bassExercises } from "./exercises";
import { PlaybackEngine } from "./playback/PlaybackEngine";
import type { PlaybackSnapshot } from "./playback/playbackTypes";
import {
  DEFAULT_THEME_NAME,
  THEMES,
  type ThemeName,
} from "./theme/themes";
import type { Handedness } from "./types/music";
import "./App.css";

const FRET_COUNT = 12;

function App() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentExercise = bassExercises[exerciseIndex];
  const [tempo, setTempo] = useState(currentExercise.tempo);
  const [loop, setLoop] = useState(currentExercise.loop);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [handedness, setHandedness] = useState<Handedness>("right");
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME_NAME);
  const [instrument, setInstrument] = useState<Instrument>("bass");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bassSoundPresetIndex, setBassSoundPresetIndex] = useState(
    DEFAULT_BASS_SOUND_PRESET_INDEX,
  );
  const [bassSoundSettings, setBassSoundSettings] =
    useState<BassSoundSettings>(
      BASS_SOUND_PRESETS[DEFAULT_BASS_SOUND_PRESET_INDEX].settings,
    );
  const theme = THEMES[themeName];
  const handSkin = getHandSkinById(DEFAULT_HAND_SKIN_ID);
  const themeStyle = {
    "--color-bg": theme.BG,
    "--color-panel": theme.PANEL,
    "--color-field": theme.FIELD,
    "--color-fg": theme.FG,
    "--color-field-fg": theme.FIELD_FG,
    "--color-accent": theme.ACCENT,
  } as React.CSSProperties;

  const playbackEngineRef = useRef(
    new PlaybackEngine({
      exercise: currentExercise,
      tempo: currentExercise.tempo,
      loop: currentExercise.loop,
    }),
  );
  const synth = useMemo(() => new SimpleBassSynth(), []);
  const activeSoundIdsRef = useRef<Set<string>>(new Set());
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot>(
    playbackEngineRef.current.getSnapshot(),
  );

  useEffect(() => {
    synth.setSettings(bassSoundSettings);
  }, [bassSoundSettings, synth]);

  useEffect(() => {
    if (snapshot.status !== "playing") {
      return;
    }

    let animationFrameId = 0;

    const tick = () => {
      const nextSnapshot = playbackEngineRef.current.getSnapshot();
      setSnapshot(nextSnapshot);

      if (nextSnapshot.status === "playing") {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [snapshot.status]);

  useEffect(() => {
    if (!soundEnabled || snapshot.status !== "playing") {
      synth.stopAll();
      activeSoundIdsRef.current.clear();
      return;
    }

    const activeIds = new Set(snapshot.activeEvents.map((event) => event.id));

    for (const event of snapshot.activeEvents) {
      if (!activeSoundIdsRef.current.has(event.id)) {
        synth.playNote(event);
      }
    }

    for (const eventId of activeSoundIdsRef.current) {
      if (!activeIds.has(eventId)) {
        synth.stopNote(eventId);
      }
    }

    activeSoundIdsRef.current = activeIds;
  }, [snapshot, soundEnabled, synth]);

  const handlePlay = () => {
    setSnapshot(playbackEngineRef.current.play());
  };

  const handleStop = () => {
    synth.stopAll();
    activeSoundIdsRef.current.clear();
    setSnapshot(playbackEngineRef.current.stop());
  };

  const handleTempoChange = (nextTempo: number) => {
    setTempo(nextTempo);
    setSnapshot(playbackEngineRef.current.setTempo(nextTempo));
  };

  const handleLoopChange = (nextLoop: boolean) => {
    setLoop(nextLoop);
    setSnapshot(playbackEngineRef.current.setLoop(nextLoop));
  };

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);

    if (!enabled) {
      synth.stopAll();
      activeSoundIdsRef.current.clear();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || shouldIgnorePlaybackShortcut(event.target)) {
        return;
      }

      event.preventDefault();

      if (playbackEngineRef.current.getSnapshot().status === "playing") {
        setSnapshot(playbackEngineRef.current.pause());
      } else {
        setSnapshot(playbackEngineRef.current.play());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectExercise = (nextIndex: number) => {
    const normalizedIndex =
      (nextIndex + bassExercises.length) % bassExercises.length;
    const nextExercise = bassExercises[normalizedIndex];
    const wasPlaying =
      playbackEngineRef.current.getSnapshot().status === "playing";

    synth.releaseAll();
    activeSoundIdsRef.current.clear();
    setExerciseIndex(normalizedIndex);
    setTempo(nextExercise.tempo);
    setLoop(nextExercise.loop);
    playbackEngineRef.current = new PlaybackEngine({
      exercise: nextExercise,
      tempo: nextExercise.tempo,
      loop: nextExercise.loop,
    });
    setSnapshot(
      wasPlaying
        ? playbackEngineRef.current.playFromStart()
        : playbackEngineRef.current.getSnapshot(),
    );
  };

  const selectBassSoundPreset = (nextIndex: number) => {
    const normalizedIndex =
      (nextIndex + BASS_SOUND_PRESETS.length) % BASS_SOUND_PRESETS.length;
    const preset = BASS_SOUND_PRESETS[normalizedIndex];

    setBassSoundPresetIndex(normalizedIndex);
    setBassSoundSettings(preset.settings);
  };
  const tempoRotation = ((tempo - 40) / 160) * 270 - 135;

  return (
    <main className="appRoot" style={themeStyle}>
      <nav className="menuBar" aria-label="Menu principal">
        <div className="menuSpacer" />
        <div className="menuTitle">
          <button
            type="button"
            className={
              handedness === "left" ? "handModeButton active" : "handModeButton"
            }
            aria-label="Passer en mode main gauche"
            title="Mode gaucher"
            onClick={() => setHandedness("left")}
          >
            <img className="leftHandImage" src={handSkin.leftImage} alt="" />
          </button>
          <span className="brandTitle">Instrumenta</span>
          <small>v{APP_VERSION}</small>
          <button
            type="button"
            className={
              handedness === "right" ? "handModeButton active" : "handModeButton"
            }
            aria-label="Passer en mode main droite"
            title="Mode droitier"
            onClick={() => setHandedness("right")}
          >
            <img className="rightHandImage" src={handSkin.rightImage} alt="" />
          </button>
        </div>
        <button
          type="button"
          className="menuButton"
          onClick={() => setIsSettingsOpen(true)}
        >
          Menu
        </button>
      </nav>

      <div className="tempoDock">
        <label className="tempoKnob">
          <input
            type="range"
            min="40"
            max="200"
            value={tempo}
            aria-label={`Tempo : ${tempo} BPM`}
            onChange={(event) =>
              handleTempoChange(Number(event.currentTarget.value))
            }
          />
          <span
            className="tempoKnobFace"
            style={
              {
                "--tempo-knob-rotation": `${tempoRotation}deg`,
              } as React.CSSProperties
            }
          >
            <span className="tempoKnobIndicator" />
          </span>
          <span className="tempoKnobLabel">Tempo</span>
          <strong>{tempo} BPM</strong>
        </label>

        <div className="tempoTransportControls" aria-label="Contrôles de lecture">
          <button type="button" onClick={handlePlay} disabled={snapshot.status === "playing"}>
            Lecture
          </button>
          <button type="button" onClick={handleStop} disabled={snapshot.status === "stopped"}>
            Stop
          </button>
          <label>
            <input
              type="checkbox"
              checked={loop}
              onChange={(event) => handleLoopChange(event.currentTarget.checked)}
            />
            Boucle
          </label>
          <label>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) =>
                handleSoundEnabledChange(event.currentTarget.checked)
              }
            />
            Son
          </label>
        </div>
      </div>

      <div className="topControls">
        <BassSoundControls
          presetName={BASS_SOUND_PRESETS[bassSoundPresetIndex].name}
          settings={bassSoundSettings}
          onSettingsChange={setBassSoundSettings}
          onPreviousPreset={() => selectBassSoundPreset(bassSoundPresetIndex - 1)}
          onNextPreset={() => selectBassSoundPreset(bassSoundPresetIndex + 1)}
        />
      </div>

      <div className="appShell">
      <header className="appHeader">
        <button
          type="button"
          className="exerciseNavButton"
          aria-label="Exercice précédent"
          onClick={() => selectExercise(exerciseIndex - 1)}
        >
          ←
        </button>
        <h1>{currentExercise.title}</h1>
        <button
          type="button"
          className="exerciseNavButton"
          aria-label="Exercice suivant"
          onClick={() => selectExercise(exerciseIndex + 1)}
        >
          →
        </button>
        <div className="readout" aria-label="Position de lecture">
          <span>{snapshot.currentBeat.toFixed(2)}</span>
          <small>temps</small>
        </div>
      </header>

      <BassFretboard
        activeNotes={snapshot.activeEvents}
        handedness={handedness}
        fretCount={FRET_COUNT}
      />

      <BassTablature
        exercise={currentExercise}
        activeNotes={snapshot.activeEvents}
        currentBeat={snapshot.currentBeat}
      />
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        themeName={themeName}
        handedness={handedness}
        instrument={instrument}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={setThemeName}
        onHandednessChange={setHandedness}
        onInstrumentChange={setInstrument}
      />
    </main>
  );
}

export default App;

function shouldIgnorePlaybackShortcut(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea" ||
    target.isContentEditable
  );
}
