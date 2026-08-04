import type { PlaybackStatus } from "../../playback/playbackTypes";
import "./TransportControls.css";

interface TransportControlsProps {
  status: PlaybackStatus;
  tempo: number;
  loop: boolean;
  soundEnabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onTempoChange: (tempo: number) => void;
  onLoopChange: (loop: boolean) => void;
  onSoundEnabledChange: (enabled: boolean) => void;
}

export function TransportControls({
  status,
  tempo,
  loop,
  soundEnabled,
  onPlay,
  onPause,
  onRestart,
  onTempoChange,
  onLoopChange,
  onSoundEnabledChange,
}: TransportControlsProps) {
  return (
    <section className="transport" aria-label="Contrôles de lecture">
      <div className="transportButtons">
        <button type="button" onClick={onPlay} disabled={status === "playing"}>
          Lecture
        </button>
        <button type="button" onClick={onPause} disabled={status !== "playing"}>
          Pause
        </button>
        <button type="button" onClick={onRestart}>
          Recommencer
        </button>
      </div>

      <label className="tempoControl">
        <span>Tempo : {tempo} BPM</span>
        <input
          type="range"
          min="40"
          max="200"
          value={tempo}
          onChange={(event) => onTempoChange(Number(event.currentTarget.value))}
        />
      </label>

      <div className="toggleRow">
        <label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(event) => onLoopChange(event.currentTarget.checked)}
          />
          Boucle
        </label>
        <label>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(event) =>
              onSoundEnabledChange(event.currentTarget.checked)
            }
          />
          Son
        </label>
      </div>

    </section>
  );
}
