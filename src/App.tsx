import { useState, useCallback } from 'react';
import type { TimerConfig } from './types';
import { useTimer } from './hooks/useTimer';
import { useSpeech } from './hooks/useSpeech';
import { useWakeLock } from './hooks/useWakeLock';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { Settings } from './components/Settings';

const DEFAULT_CONFIG: TimerConfig = {
  sessionMinutes: 90,
  blockMinutes: 15,
};

export default function App() {
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
  const timer = useTimer(config);
  const speech = useSpeech();
  const wakeLock = useWakeLock();
  const install = useInstallPrompt();

  // Wire up timer callbacks for speech and wake lock
  timer.onBlockChange.current = useCallback(
    (label: string) => speech.announce(label),
    [speech.announce], // eslint-disable-line react-hooks/exhaustive-deps
  );

  timer.onComplete.current = useCallback(
    () => {
      speech.announce('Session end');
      wakeLock.release();
    },
    [speech.announce, wakeLock.release], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleStart = useCallback(() => {
    speech.warmUp();
    wakeLock.acquire();
    timer.start();
  }, [speech, wakeLock, timer]);

  const handlePause = useCallback(() => {
    timer.pause();
    wakeLock.release();
  }, [timer, wakeLock]);

  const handleResume = useCallback(() => {
    timer.resume();
    wakeLock.acquire();
  }, [timer, wakeLock]);

  const handleReset = useCallback(() => {
    timer.reset();
    wakeLock.release();
  }, [timer, wakeLock]);

  return (
    <div className="flex flex-col min-h-dvh bg-slate-900 text-white select-none">
      <header className="pt-6 pb-2 text-center landscape:pt-2 landscape:pb-0">
        <h1 className="text-2xl font-medium text-slate-500 tracking-wider uppercase landscape:text-xl">
          Anna's Training Timer
        </h1>
      </header>

      {/* Install prompt banner */}
      {install.canPrompt && !install.isInstalled && timer.phase === 'idle' && (
        <div className="mx-4 mb-2 rounded-xl bg-emerald-900/60 border border-emerald-700 px-4 py-3 text-center">
          <button
            onClick={install.promptInstall}
            className="text-emerald-300 font-medium text-sm active:text-emerald-100"
          >
            📲 Tap to install this app on your home screen
          </button>
        </div>
      )}

      {/* iOS install guide overlay */}
      {install.showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-800 p-6 text-center">
            <p className="text-lg font-semibold text-white mb-3">Install on iPhone</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Tap the <span className="inline-block text-lg align-middle">⎙</span> Share button in Safari, then scroll down and tap <strong>"Add to Home Screen"</strong>
            </p>
            <button
              onClick={install.dismissIOSGuide}
              className="rounded-xl bg-emerald-600 px-6 py-2 text-white font-medium active:bg-emerald-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <main className="flex flex-col flex-1 px-4 landscape:flex-row landscape:items-stretch landscape:gap-2 landscape:px-6">
        {timer.phase === 'idle' ? (
          <div className="flex flex-col flex-1 justify-center landscape:justify-center">
            <Settings config={config} onChange={setConfig} />
          </div>
        ) : (
          <TimerDisplay
            block={timer.block!}
            totalElapsedSeconds={timer.totalElapsedSeconds}
            totalSessionSeconds={timer.totalSessionSeconds}
            isComplete={timer.phase === 'complete'}
          />
        )}

        <Controls
          phase={timer.phase}
          isMuted={speech.isMuted}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onToggleMute={speech.toggleMute}
        />
      </main>
    </div>
  );
}
