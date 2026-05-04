import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseWakeLockReturn {
  isActive: boolean;
  isSupported: boolean;
  acquire: () => Promise<void>;
  release: () => Promise<void>;
}

export function useWakeLock(): UseWakeLockReturn {
  const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const wantActiveRef = useRef(false);

  const acquire = useCallback(async () => {
    if (!isSupported || sentinelRef.current) return;
    wantActiveRef.current = true;
    try {
      sentinelRef.current = await navigator.wakeLock.request('screen');
      sentinelRef.current.addEventListener('release', () => {
        sentinelRef.current = null;
        setIsActive(false);
      });
      setIsActive(true);
    } catch {
      // Wake lock request failed (e.g. low battery, background tab)
    }
  }, [isSupported]);

  const release = useCallback(async () => {
    wantActiveRef.current = false;
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        // Sentinel may already be released
      }
      sentinelRef.current = null;
      setIsActive(false);
    }
  }, []);

  // Re-acquire on visibility change using ref to avoid stale closure
  useEffect(() => {
    if (!isSupported) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !sentinelRef.current && wantActiveRef.current) {
        acquire();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isSupported, acquire]);

  // Release on unmount
  useEffect(() => {
    return () => {
      sentinelRef.current?.release().catch(() => {});
    };
  }, []);

  return { isActive, isSupported, acquire, release };
}
