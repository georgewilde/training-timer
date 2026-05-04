export interface TimerConfig {
  sessionMinutes: number;
  blockMinutes: number;
}

export type TimerPhase = 'idle' | 'running' | 'paused' | 'complete';

export interface BlockInfo {
  /** 0-based block index */
  index: number;
  /** Total number of blocks */
  total: number;
  /** e.g. "Second 15 minutes" */
  label: string;
  /** Actual duration of this block in seconds (may be shorter for final block) */
  durationSeconds: number;
  /** Seconds remaining in this block */
  remainingSeconds: number;
}

export interface TimerSnapshot {
  phase: TimerPhase;
  block: BlockInfo | null;
  totalElapsedSeconds: number;
  totalSessionSeconds: number;
}

const ORDINALS = [
  'First', 'Second', 'Third', 'Fourth', 'Fifth',
  'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
  'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth',
  'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth',
];

function numericOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = n % 100;
  const suffix = suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0];
  return `${n}${suffix}`;
}

export function ordinal(n: number): string {
  if (n >= 1 && n <= ORDINALS.length) return ORDINALS[n - 1];
  return numericOrdinal(n);
}

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
