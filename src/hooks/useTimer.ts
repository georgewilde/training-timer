import { useState, useRef, useCallback, useEffect } from 'react';
import type { TimerConfig, TimerPhase, BlockInfo } from '../types';
import { ordinal } from '../types';

const TICK_INTERVAL_MS = 250;

function computeBlockInfo(
  elapsedMs: number,
  sessionMs: number,
  blockMs: number,
  totalBlocks: number,
  blockMinutes: number,
): BlockInfo {
  const clampedElapsed = Math.min(elapsedMs, sessionMs);
  const blockIndex = Math.min(
    Math.floor(clampedElapsed / blockMs),
    totalBlocks - 1,
  );

  const blockStartMs = blockIndex * blockMs;
  const blockEndMs = Math.min(blockStartMs + blockMs, sessionMs);
  const actualDurationMs = blockEndMs - blockStartMs;
  const blockElapsedMs = clampedElapsed - blockStartMs;
  const remainingMs = Math.max(0, actualDurationMs - blockElapsedMs);

  const actualDurationMinutes = Math.round(actualDurationMs / 60_000);
  const displayMinutes = actualDurationMinutes !== blockMinutes
    ? actualDurationMinutes
    : blockMinutes;

  return {
    index: blockIndex,
    total: totalBlocks,
    label: `${ordinal(blockIndex + 1)} ${displayMinutes} minutes`,
    durationSeconds: Math.round(actualDurationMs / 1000),
    remainingSeconds: Math.ceil(remainingMs / 1000),
  };
}

export interface UseTimerReturn {
  phase: TimerPhase;
  block: BlockInfo | null;
  totalElapsedSeconds: number;
  totalSessionSeconds: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  /** Fires when block index changes — returns the new block label */
  onBlockChange: React.MutableRefObject<((label: string) => void) | null>;
  /** Fires when session completes */
  onComplete: React.MutableRefObject<(() => void) | null>;
}

export function useTimer(config: TimerConfig): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef(0);
  const accumulatedMsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBlockIndexRef = useRef(-1);

  const onBlockChange = useRef<((label: string) => void) | null>(null);
  const onComplete = useRef<(() => void) | null>(null);

  const sessionMs = config.sessionMinutes * 60 * 1000;
  const blockMs = config.blockMinutes * 60 * 1000;
  const totalBlocks = Math.ceil(sessionMs / blockMs);
  const totalSessionSeconds = config.sessionMinutes * 60;

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const total = accumulatedMsRef.current + (now - startedAtRef.current);
    setElapsedMs(total);

    if (total >= sessionMs) {
      clearTick();
      setPhase('complete');
    }
  }, [sessionMs, clearTick]);

  const startTick = useCallback(() => {
    clearTick();
    startedAtRef.current = Date.now();
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
  }, [tick, clearTick]);

  const start = useCallback(() => {
    if (phase !== 'idle') return;
    accumulatedMsRef.current = 0;
    prevBlockIndexRef.current = -1;
    setElapsedMs(0);
    setPhase('running');
    startTick();
  }, [startTick, phase]);

  const pause = useCallback(() => {
    if (phase !== 'running') return;
    clearTick();
    accumulatedMsRef.current += Date.now() - startedAtRef.current;
    setPhase('paused');
  }, [clearTick, phase]);

  const resume = useCallback(() => {
    if (phase !== 'paused') return;
    setPhase('running');
    startTick();
  }, [startTick, phase]);

  const reset = useCallback(() => {
    clearTick();
    accumulatedMsRef.current = 0;
    prevBlockIndexRef.current = -1;
    setElapsedMs(0);
    setPhase('idle');
  }, [clearTick]);

  // Derive block info from elapsed time
  const block = phase === 'idle'
    ? null
    : computeBlockInfo(elapsedMs, sessionMs, blockMs, totalBlocks, config.blockMinutes);

  // Detect block transitions and session completion
  useEffect(() => {
    if (!block) return;

    if (block.index !== prevBlockIndexRef.current) {
      prevBlockIndexRef.current = block.index;
      onBlockChange.current?.(block.label);
    }
  }, [block?.index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'complete') {
      onComplete.current?.();
    }
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => clearTick, [clearTick]);

  return {
    phase,
    block,
    totalElapsedSeconds: Math.min(Math.floor(elapsedMs / 1000), totalSessionSeconds),
    totalSessionSeconds,
    start,
    pause,
    resume,
    reset,
    onBlockChange,
    onComplete,
  };
}
