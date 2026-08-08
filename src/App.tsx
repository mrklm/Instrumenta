import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASS_SOUND_PRESETS,
  DEFAULT_BASS_SOUND_PRESET_INDEX,
  type BassSoundSettings,
} from "./audio/bassSoundPresets";
import { APP_VERSION } from "./appVersion";
import { DEFAULT_HAND_SKIN_ID, getHandSkinById } from "./assets/handSkins";
import instrumentaLogo from "../assets/instrumenta.png";
import {
  METRONOME_SOUND_OPTIONS,
  SimpleMetronome,
  type MetronomeSound,
} from "./audio/SimpleMetronome";
import { SimpleBassSynth } from "./audio/SimpleBassSynth";
import { BassFretboard } from "./components/BassFretboard/BassFretboard";
import { BassSoundControls } from "./components/BassSoundControls/BassSoundControls";
import { BassTablature } from "./components/BassTablature/BassTablature";
import { ExerciseTicker } from "./components/ExerciseTicker/ExerciseTicker";
import { HelpDialog } from "./components/HelpDialog/HelpDialog";
import {
  SettingsDialog,
  type Instrument,
} from "./components/SettingsDialog/SettingsDialog";
import { bassExerciseCategories, bassExercises } from "./exercises";
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
const DEFAULT_BASS_KNOB_SETTINGS = {
  volume: 50,
  tone: 0,
  drive: 10,
} as const;

const getExerciseSignature = (exercise: typeof bassExercises[number]) =>
  `${exercise.id}:${exercise.title}:${exercise.events
    .map((event) => `${event.string}${event.fret}@${event.startBeat}`)
    .join("|")}`;

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [metronomeVolume, setMetronomeVolume] = useState(70);
  const [metronomeSound, setMetronomeSound] =
    useState<MetronomeSound>("click");
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
  const playbackExerciseSignatureRef = useRef(
    getExerciseSignature(currentExercise),
  );
  const synth = useMemo(() => new SimpleBassSynth(), []);
  const metronome = useMemo(() => new SimpleMetronome(), []);
  const activeSoundIdsRef = useRef<Set<string>>(new Set());
  const lastMetronomeBeatRef = useRef<number | null>(null);
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot>(
    playbackEngineRef.current.getSnapshot(),
  );

  useEffect(() => {
    synth.setSettings(bassSoundSettings);
  }, [bassSoundSettings, synth]);

  useEffect(() => {
    metronome.setSettings({
      volume: metronomeVolume,
      sound: metronomeSound,
    });
  }, [metronome, metronomeSound, metronomeVolume]);

  useEffect(() => {
    const nextSignature = getExerciseSignature(currentExercise);

    if (playbackExerciseSignatureRef.current === nextSignature) {
      return;
    }

    const wasPlaying =
      playbackEngineRef.current.getSnapshot().status === "playing";

    synth.releaseAll();
    activeSoundIdsRef.current.clear();
    setTempo(currentExercise.tempo);
    setLoop(currentExercise.loop);
    playbackEngineRef.current = new PlaybackEngine({
      exercise: currentExercise,
      tempo: currentExercise.tempo,
      loop: currentExercise.loop,
    });
    playbackExerciseSignatureRef.current = nextSignature;
    setSnapshot(
      wasPlaying
        ? playbackEngineRef.current.playFromStart()
        : playbackEngineRef.current.getSnapshot(),
    );
  }, [currentExercise, synth]);

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
    if (!soundEnabled) {
      synth.stopAll();
      activeSoundIdsRef.current.clear();
      return;
    }

    if (snapshot.status !== "playing") {
      for (const eventId of activeSoundIdsRef.current) {
        synth.stopNote(eventId);
      }

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

  useEffect(() => {
    if (!metronomeEnabled || snapshot.status !== "playing") {
      lastMetronomeBeatRef.current = null;
      metronome.stop();
      return;
    }

    const beatIndex = Math.floor(snapshot.currentBeat);

    if (beatIndex === lastMetronomeBeatRef.current) {
      return;
    }

    lastMetronomeBeatRef.current = beatIndex;
    metronome.playBeat(
      beatIndex % currentExercise.timeSignature.numerator === 0,
    );
  }, [
    currentExercise.timeSignature.numerator,
    metronome,
    metronomeEnabled,
    snapshot.currentBeat,
    snapshot.status,
  ]);

  const handlePlay = () => {
    if (soundEnabled) {
      synth.enable();
    }

    if (metronomeEnabled) {
      metronome.enable();
    }

    setSnapshot(playbackEngineRef.current.play());
  };

  const handleStop = () => {
    synth.stopAll();
    activeSoundIdsRef.current.clear();
    lastMetronomeBeatRef.current = null;
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

    if (enabled) {
      synth.enable();
      synth.playPreviewNote();
    } else {
      synth.stopAll();
      activeSoundIdsRef.current.clear();
    }
  };

  const handleMetronomeEnabledChange = (enabled: boolean) => {
    setMetronomeEnabled(enabled);
    lastMetronomeBeatRef.current = null;

    if (enabled) {
      metronome.enable();
      metronome.playBeat(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || shouldIgnorePlaybackShortcut(event.target)) {
        return;
      }

      event.preventDefault();

      if (playbackEngineRef.current.getSnapshot().status === "playing") {
        synth.stopAll();
        activeSoundIdsRef.current.clear();
        lastMetronomeBeatRef.current = null;
        setSnapshot(playbackEngineRef.current.stop());
      } else {
        if (soundEnabled) {
          synth.enable();
        }

        if (metronomeEnabled) {
          metronome.enable();
        }

        setSnapshot(playbackEngineRef.current.play());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [metronome, metronomeEnabled, soundEnabled, synth]);

  const selectExercise = (nextIndex: number) => {
    const normalizedIndex =
      (nextIndex + bassExercises.length) % bassExercises.length;
    const nextExercise = bassExercises[normalizedIndex];
    const wasPlaying =
      playbackEngineRef.current.getSnapshot().status === "playing";

    synth.releaseAll();
    activeSoundIdsRef.current.clear();
    lastMetronomeBeatRef.current = null;
    setExerciseIndex(normalizedIndex);
    setTempo(nextExercise.tempo);
    setLoop(nextExercise.loop);
    playbackEngineRef.current = new PlaybackEngine({
      exercise: nextExercise,
      tempo: nextExercise.tempo,
      loop: nextExercise.loop,
    });
    playbackExerciseSignatureRef.current = getExerciseSignature(nextExercise);
    setSnapshot(
      wasPlaying
        ? playbackEngineRef.current.playFromStart()
        : playbackEngineRef.current.getSnapshot(),
    );
  };

  const selectExerciseById = (exerciseId: string) => {
    const nextIndex = bassExercises.findIndex(
      (exercise) => exercise.id === exerciseId,
    );

    if (nextIndex >= 0) {
      selectExercise(nextIndex);
    }
  };

  const selectBassSoundPreset = (nextIndex: number) => {
    const normalizedIndex =
      (nextIndex + BASS_SOUND_PRESETS.length) % BASS_SOUND_PRESETS.length;
    const preset = BASS_SOUND_PRESETS[normalizedIndex];

    setBassSoundPresetIndex(normalizedIndex);
    setBassSoundSettings(preset.settings);
  };
  const tempoRotation = ((tempo - 40) / 160) * 270 - 135;
  const metronomeVolumeRotation = (metronomeVolume / 100) * 270 - 135;

  return (
    <main className="appRoot" style={themeStyle}>
      <nav className="menuBar" aria-label="Menu principal">
        <div className="menuBrandMark" aria-hidden="true">
          <img src={instrumentaLogo} alt="" />
        </div>
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
        <div className="menuActions">
          <button
            type="button"
            className="menuIconButton"
            aria-label="Ouvrir les options"
            title="Options"
            onClick={() => setIsSettingsOpen(true)}
          >
            <svg
              className="menuGearIcon"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M10.2 2h3.6l.5 3.1 1.2.5 2.6-1.8 2.6 2.6-1.8 2.6.5 1.2 3.1.5v3.6l-3.1.5-.5 1.2 1.8 2.6-2.6 2.6-2.6-1.8-1.2.5-.5 3.1h-3.6l-.5-3.1-1.2-.5-2.6 1.8-2.6-2.6L5.1 16l-.5-1.2-3.1-.5v-3.6l3.1-.5.5-1.2-1.8-2.6 2.6-2.6 2.6 1.8 1.2-.5L10.2 2Zm1.8 6.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" />
            </svg>
          </button>
          <button
            type="button"
            className="menuIconButton"
            aria-label="Ouvrir l'aide"
            title="Aide"
            onClick={() => setIsHelpOpen(true)}
          >
            <span aria-hidden="true">?</span>
          </button>
        </div>
      </nav>

      <div className="tempoDock">
        <label
          className="tempoKnob"
          onDoubleClickCapture={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleTempoChange(currentExercise.tempo);
          }}
        >
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
            title="Double-clic : tempo de l'exercice"
            style={
              {
                "--tempo-knob-rotation": `${tempoRotation}deg`,
              } as React.CSSProperties
            }
          >
            <span className="tempoKnobIndicator" />
            <span className="tempoKnobValue">{tempo}</span>
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

        <section className="metronomePanel" aria-label="Réglages du métronome">
          <div className="metronomeHeader">
            <h2>Metronome</h2>
            <button
              type="button"
              className={
                metronomeEnabled
                  ? "metronomePowerButton active"
                  : "metronomePowerButton"
              }
              aria-label={
                metronomeEnabled
                  ? "Désactiver le métronome"
                  : "Activer le métronome"
              }
              aria-pressed={metronomeEnabled}
              onClick={() =>
                handleMetronomeEnabledChange(!metronomeEnabled)
              }
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 3v8" />
                <path d="M7.1 6.4a7 7 0 1 0 9.8 0" />
              </svg>
            </button>
          </div>

          <label
            className="metronomeKnob"
            onDoubleClickCapture={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMetronomeVolume(70);
            }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={metronomeVolume}
              aria-label={`Volume du métronome : ${metronomeVolume}%`}
              onChange={(event) =>
                setMetronomeVolume(Number(event.currentTarget.value))
              }
            />
            <span
              className="metronomeKnobFace"
              title="Double-clic : valeur d'origine"
              style={
                {
                  "--metronome-knob-rotation": `${metronomeVolumeRotation}deg`,
                } as React.CSSProperties
              }
            >
              <span className="metronomeKnobIndicator" />
              <span className="metronomeKnobValue">{metronomeVolume}%</span>
            </span>
            <span>Volume</span>
            <strong>{metronomeVolume}%</strong>
          </label>

          <label className="metronomeSoundSelect">
            <span>Son</span>
            <select
              value={metronomeSound}
              onChange={(event) =>
                setMetronomeSound(event.currentTarget.value as MetronomeSound)
              }
            >
              {METRONOME_SOUND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>
      </div>

      <div className="topControls">
        <BassSoundControls
          presetName={BASS_SOUND_PRESETS[bassSoundPresetIndex].name}
          settings={bassSoundSettings}
          defaultSettings={{
            ...BASS_SOUND_PRESETS[bassSoundPresetIndex].settings,
            ...DEFAULT_BASS_KNOB_SETTINGS,
          }}
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
        <label className="exerciseSelectLabel">
          <span>Exercice</span>
          <select
            value={currentExercise.id}
            onChange={(event) => selectExerciseById(event.currentTarget.value)}
          >
            {bassExerciseCategories.map((category) => (
              <optgroup key={category.id} label={category.label}>
                {category.exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="exerciseNavButton"
          aria-label="Exercice suivant"
          onClick={() => selectExercise(exerciseIndex + 1)}
        >
          →
        </button>
      </header>

      <BassFretboard
        activeNotes={snapshot.activeEvents}
        handedness={handedness}
        fretCount={FRET_COUNT}
      />

      <ExerciseTicker exercise={currentExercise} handedness={handedness} />

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
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
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
