import type { BlockInfo } from '../types';
import { formatTime } from '../types';

interface TimerDisplayProps {
  block: BlockInfo;
  totalElapsedSeconds: number;
  totalSessionSeconds: number;
  isComplete: boolean;
}

export function TimerDisplay({
  block,
  totalElapsedSeconds,
  totalSessionSeconds,
  isComplete,
}: TimerDisplayProps) {
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 flex-1 landscape:gap-1">
        <p className="text-2xl font-medium text-slate-400 tracking-wide landscape:text-lg">
          Session Complete
        </p>
        <p className="text-8xl font-mono font-bold text-white tabular-nums sm:text-9xl landscape:text-6xl">
          {formatTime(totalSessionSeconds)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1 landscape:gap-1">
      <p className="text-xl font-medium text-slate-400 tracking-wide sm:text-2xl landscape:text-lg">
        {block.label}
      </p>
      <p className="text-8xl font-mono font-bold text-white tabular-nums sm:text-9xl landscape:text-6xl">
        {formatTime(block.remainingSeconds)}
      </p>
      <p className="text-base text-slate-500 landscape:text-sm">
        Block {block.index + 1} of {block.total}
        <span className="mx-3">·</span>
        {formatTime(totalElapsedSeconds)} elapsed
      </p>
    </div>
  );
}
