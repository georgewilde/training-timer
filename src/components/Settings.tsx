import { useState } from 'react';
import type { TimerConfig } from '../types';

interface SettingsProps {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
}

export function Settings({ config, onChange }: SettingsProps) {
  const [session, setSession] = useState(String(config.sessionMinutes));
  const [block, setBlock] = useState(String(config.blockMinutes));

  const sessionNum = parseInt(session, 10);
  const blockNum = parseInt(block, 10);
  const isValid = sessionNum > 0 && blockNum > 0 && blockNum <= sessionNum;
  const isUneven = isValid && sessionNum % blockNum !== 0;
  const totalBlocks = isValid ? Math.ceil(sessionNum / blockNum) : 0;

  const handleSessionChange = (value: string) => {
    setSession(value);
    const n = parseInt(value, 10);
    if (n > 0 && blockNum > 0 && blockNum <= n) {
      onChange({ sessionMinutes: n, blockMinutes: blockNum });
    }
  };

  const handleBlockChange = (value: string) => {
    setBlock(value);
    const n = parseInt(value, 10);
    if (n > 0 && sessionNum > 0 && n <= sessionNum) {
      onChange({ sessionMinutes: sessionNum, blockMinutes: n });
    }
  };

  const presets: { label: string; session: number; block: number }[] = [
    { label: '90 min / 15 min', session: 90, block: 15 },
    { label: '60 min / 15 min', session: 60, block: 15 },
    { label: '60 min / 10 min', session: 60, block: 10 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setSession(String(preset.session));
    setBlock(String(preset.block));
    onChange({ sessionMinutes: preset.session, blockMinutes: preset.block });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto landscape:gap-3 landscape:max-w-none">
      <h2 className="text-xl font-semibold text-slate-300 landscape:text-base">Session Setup</h2>

      <div className="flex gap-3 flex-wrap justify-center landscape:gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors landscape:px-3 landscape:py-1 landscape:text-xs ${
              sessionNum === p.session && blockNum === p.block
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 active:bg-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full landscape:gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-400 landscape:text-xs">Session (min)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={300}
            value={session}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-600 px-4 py-3 text-center text-2xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 landscape:py-2 landscape:text-xl"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-400 landscape:text-xs">Block (min)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={300}
            value={block}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-600 px-4 py-3 text-center text-2xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 landscape:py-2 landscape:text-xl"
          />
        </label>
      </div>

      {isValid && (
        <p className="text-sm text-slate-400 landscape:text-xs">
          {totalBlocks} block{totalBlocks !== 1 ? 's' : ''}
          {isUneven && (
            <span className="text-amber-400 ml-1">
              (last block shorter: {sessionNum - (totalBlocks - 1) * blockNum} min)
            </span>
          )}
        </p>
      )}

      {!isValid && session !== '' && block !== '' && (
        <p className="text-sm text-red-400 landscape:text-xs">
          Block duration must be between 1 and session length
        </p>
      )}
    </div>
  );
}
