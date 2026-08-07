import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { BassExercise, ExerciseIndication } from "../../types/music";
import "./ExerciseTicker.css";

interface ExerciseTickerProps {
  exercise: BassExercise;
}

const TICKER_PIXELS_PER_SECOND = 52.27;
const MIN_TICKER_DURATION_SECONDS = 18;
const MIN_INITIAL_SCROLL_DURATION_SECONDS = 6;
const TICKER_START_DELAY_MS = 10_000;
const MIN_SPEED_MULTIPLIER = 0.5;
const MAX_SPEED_MULTIPLIER = 3.5;

export function ExerciseTicker({ exercise }: ExerciseTickerProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeedPanelOpen, setIsSpeedPanelOpen] = useState(false);
  const [hasCompletedInitialScroll, setHasCompletedInitialScroll] =
    useState(false);
  const [speedPercent, setSpeedPercent] = useState(50);
  const [durationSeconds, setDurationSeconds] = useState(
    MIN_TICKER_DURATION_SECONDS,
  );
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(
    MIN_INITIAL_SCROLL_DURATION_SECONDS,
  );
  const tickerText = useMemo(
    () => getExerciseTickerText(exercise),
    [exercise],
  );
  const speedMultiplier = getSpeedMultiplier(speedPercent);

  useLayoutEffect(() => {
    const updateDuration = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      const contentWidth = contentRef.current?.scrollWidth ?? 0;
      const pixelsPerSecond = TICKER_PIXELS_PER_SECOND * speedMultiplier;
      const travelDistance = containerWidth + contentWidth;
      const nextDuration = Math.max(
        MIN_TICKER_DURATION_SECONDS,
        travelDistance / pixelsPerSecond,
      );
      const nextInitialDuration = Math.max(
        MIN_INITIAL_SCROLL_DURATION_SECONDS,
        contentWidth / pixelsPerSecond,
      );

      setDurationSeconds(nextDuration);
      setInitialDurationSeconds(nextInitialDuration);
    };

    updateDuration();

    const resizeObserver = new ResizeObserver(updateDuration);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [speedMultiplier, tickerText]);

  useEffect(() => {
    setIsScrolling(false);
    setIsPaused(false);
    setIsSpeedPanelOpen(false);
    setHasCompletedInitialScroll(false);

    const timeoutId = window.setTimeout(() => {
      setIsScrolling(true);
    }, TICKER_START_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [tickerText]);

  const toggleSpeedPanel = () => {
    const nextIsOpen = !isSpeedPanelOpen;

    setIsSpeedPanelOpen(nextIsOpen);
    setIsPaused(nextIsOpen);
  };

  const handleAnimationEnd = () => {
    if (isScrolling && !hasCompletedInitialScroll) {
      setHasCompletedInitialScroll(true);
    }
  };

  return (
    <div className="exerciseTickerShell">
      <button
        type="button"
        className={[
          "exerciseTicker",
          isScrolling ? "scrolling" : "",
          isScrolling && !hasCompletedInitialScroll ? "initialScroll" : "",
          isScrolling && hasCompletedInitialScroll ? "loopScroll" : "",
          isPaused ? "paused" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        ref={containerRef}
        aria-label={`Indications pour l'exercice : ${exercise.title}`}
        aria-pressed={isPaused}
        onClick={toggleSpeedPanel}
        onAnimationEnd={handleAnimationEnd}
        style={
          {
            "--exercise-ticker-duration": `${durationSeconds}s`,
            "--exercise-ticker-initial-duration": `${initialDurationSeconds}s`,
          } as CSSProperties
        }
      >
        <span ref={contentRef}>{tickerText}</span>
      </button>

      {isSpeedPanelOpen ? (
        <div
          className="exerciseTickerSpeedPanel"
          onClick={(event) => event.stopPropagation()}
        >
          <label>
            <span>Vitesse de défilement</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={speedPercent}
              onChange={(event) =>
                setSpeedPercent(Number(event.currentTarget.value))
              }
            />
          </label>
          <strong>{speedPercent}%</strong>
        </div>
      ) : null}
    </div>
  );
}

function getSpeedMultiplier(speedPercent: number): number {
  return (
    MIN_SPEED_MULTIPLIER +
    (speedPercent / 100) * (MAX_SPEED_MULTIPLIER - MIN_SPEED_MULTIPLIER)
  );
}

function getExerciseTickerText(exercise: BassExercise): string {
  const orderedIndications = getOrderedIndications(exercise);

  if (orderedIndications.length === 0) {
    return exercise.subtitle
      ? `${exercise.title} ◆ ${exercise.subtitle}`
      : exercise.title;
  }

  return orderedIndications
    .map((indication) => `${indication.label} — ${indication.text}`)
    .join(" ◆ ");
}

function getOrderedIndications(exercise: BassExercise): ExerciseIndication[] {
  if (!exercise.indications || !exercise.indicationDisplayOrder) {
    return [];
  }

  return exercise.indicationDisplayOrder.flatMap((type) =>
    exercise.indications?.filter((indication) => indication.type === type) ?? [],
  );
}
