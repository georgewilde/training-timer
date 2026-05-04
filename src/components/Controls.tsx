import type { TimerPhase } from '../types';

interface ControlsProps {
  phase: TimerPhase;
  isMuted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onToggleMute: () => void;
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M17.65 6.35A7.96 7.96 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.77v6.46A4.49 4.49 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M16.5 12A4.5 4.5 0 0014 8.77v2.06l2.47 2.47c.03-.1.03-.2.03-.3zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export function Controls({
  phase,
  isMuted,
  onStart,
  onPause,
  onResume,
  onReset,
  onToggleMute,
}: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6 landscape:flex-col landscape:justify-center landscape:py-2 landscape:gap-3 landscape:shrink-0 landscape:w-36">
      {phase === 'idle' && (
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-10 py-4 text-xl font-semibold text-white active:bg-emerald-700 transition-colors landscape:px-6 landscape:py-8 landscape:w-full landscape:text-2xl"
        >
          <PlayIcon />
          Start
        </button>
      )}

      {phase === 'running' && (
        <button
          onClick={onPause}
          className="flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-8 py-4 text-xl font-semibold text-white active:bg-amber-700 transition-colors landscape:px-4 landscape:py-3 landscape:w-full"
        >
          <PauseIcon />
          Pause
        </button>
      )}

      {phase === 'paused' && (
        <button
          onClick={onResume}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-xl font-semibold text-white active:bg-emerald-700 transition-colors landscape:px-4 landscape:py-3 landscape:w-full"
        >
          <PlayIcon />
          Resume
        </button>
      )}

      {(phase === 'running' || phase === 'paused' || phase === 'complete') && (
        <>
          <button
            onClick={onReset}
            className="flex items-center justify-center rounded-2xl bg-slate-700 p-4 text-white active:bg-slate-600 transition-colors landscape:w-full landscape:p-3"
            aria-label="Reset"
          >
            <ResetIcon />
          </button>

          <button
            onClick={onToggleMute}
            className={`flex items-center justify-center rounded-2xl p-4 text-white transition-colors landscape:w-full landscape:p-3 ${
              isMuted ? 'bg-red-700 active:bg-red-600' : 'bg-slate-700 active:bg-slate-600'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MutedIcon /> : <SpeakerIcon />}
          </button>
        </>
      )}
    </div>
  );
}
