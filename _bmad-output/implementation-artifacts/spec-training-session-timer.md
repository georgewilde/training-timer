---
title: 'Training Session Timer PWA'
type: 'feature'
created: '2026-05-04T10:42:19Z'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Dog trainer needs a glanceable session timer that counts down within configurable time blocks, announces each block transition aloud, and runs as an installable PWA on her phone — no app store needed.

**Approach:** Build a React + TypeScript + Vite PWA with Tailwind CSS. Large countdown display shows time remaining in the current block with a prominent block label (e.g. "Second 15 minutes"). Web Speech API announces each block transition. Quick-access settings for session length and block duration with sensible defaults (90 min / 15 min blocks).

## Boundaries & Constraints

**Always:**
- PWA-installable with offline support
- Large, high-contrast display readable at arm's length
- Defaults: 90-minute session, 15-minute blocks
- "Session end" announced when final block completes
- Use Screen Wake Lock API to prevent screen sleeping during a session
- Ordinal block labels: "First 15 minutes", "Second 15 minutes", etc.

**Ask First:**
- Adding features beyond core timer (history, presets, themes)
- Changing default session/block values

**Never:**
- Backend or server — fully client-side
- User accounts or data sync
- Complex multi-step configuration flows

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Default start | Tap Start with 90/15 defaults | 6 blocks, countdown from 15:00 in first block | N/A |
| Block transition | Block countdown hits 0:00 | Next block label shown + announced, countdown resets | N/A |
| Custom session | Set 60 min / 10 min | 6×10-min blocks, labels say "First 10 minutes" etc. | N/A |
| Pause / resume | Tap Pause mid-block | Timer freezes; second tap resumes from same point | N/A |
| Mute toggle | Tap Mute while running | Speech suppressed, timer continues, mute icon shown | N/A |
| Session complete | Final block countdown hits 0:00 | "Session end" announced, timer stops, completion shown | N/A |
| Uneven division | 70 min / 15 min blocks | 4 full blocks + 1 shorter final block (10 min) | Warn in settings |
| Speech unavailable | Browser lacks Speech API | Timer works, block labels visual-only | Silent fallback |
| Wake lock unavailable | Browser lacks Wake Lock API | Timer works normally | No-op fallback |

</frozen-after-approval>

## Code Map

- `package.json` — dependencies: react, vite, tailwind, vite-plugin-pwa
- `vite.config.ts` — Vite + PWA plugin config
- `index.html` — entry point with mobile viewport meta
- `src/main.tsx` — React mount
- `src/App.tsx` — root component: settings → running → complete flow
- `src/components/TimerDisplay.tsx` — large countdown digits + block label
- `src/components/Controls.tsx` — start/pause, reset, mute buttons (large tap targets)
- `src/components/Settings.tsx` — session length + block duration inputs
- `src/hooks/useTimer.ts` — countdown logic, block tracking, pause/resume, reset
- `src/hooks/useSpeech.ts` — Web Speech API wrapper, silence toggle, fallback
- `src/hooks/useWakeLock.ts` — Screen Wake Lock API wrapper
- `src/types.ts` — TimerConfig, TimerState, BlockInfo types

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig*.json` — scaffold project with React 18, TypeScript, Vite, Tailwind 3, vite-plugin-pwa
- [x] `index.html`, `src/main.tsx`, `src/index.css` — entry points with Tailwind directives and mobile viewport
- [x] `src/types.ts` — define TimerConfig, TimerState, BlockInfo interfaces
- [x] `src/hooks/useTimer.ts` — implement block-aware countdown: track current block index, seconds remaining, handle transitions, pause/resume, reset
- [x] `src/hooks/useSpeech.ts` — wrap speechSynthesis: announce block labels on transition, respect mute state, graceful no-op when unsupported
- [x] `src/hooks/useWakeLock.ts` — acquire wake lock on start, release on pause/complete, re-acquire on resume
- [x] `src/components/TimerDisplay.tsx` — render countdown (MM:SS) and block label in large high-contrast text
- [x] `src/components/Controls.tsx` — Start/Pause, Reset, Mute buttons with clear icons and large tap targets
- [x] `src/components/Settings.tsx` — number inputs for session length (min) and block duration (min), shown pre-start and on reset
- [x] `src/App.tsx` — compose components, manage app phases (settings → running → complete → reset)
- [x] PWA assets — manifest.json, service worker via vite-plugin-pwa, app icons

**Acceptance Criteria:**
- Given defaults, when user taps Start, then a 90-min session begins counting down from 15:00 with label "First 15 minutes"
- Given a running timer, when block countdown reaches 0:00, then the next block label is announced aloud and countdown resets
- Given a running timer, when user taps Pause, then countdown freezes and resumes on second tap
- Given a running timer, when user taps Mute, then speech stops but timer continues with a visual mute indicator
- Given the final block ends, when countdown reaches 0:00, then "Session end" is announced and timer stops
- Given a mobile browser, when user installs to home screen, then app opens as standalone PWA with offline support

## Verification

**Commands:**
- `npm run build` — expected: clean production build, no errors
- `npx tsc --noEmit` — expected: no type errors

**Manual checks:**
- Open on mobile, verify large readable display at arm's length
- Run a short test session (2 min / 1 min blocks), verify block announcements fire
- Install as PWA from mobile browser, verify standalone launch

## Suggested Review Order

**Core timer engine**

- Timestamp-based timing with block derivation — the heart of the app
  [`useTimer.ts:7`](../../src/hooks/useTimer.ts#L7)

- Types, ordinal labels, and time formatting shared across all layers
  [`types.ts:1`](../../src/types.ts#L1)

**Speech and wake lock integration**

- Web Speech API wrapper with iOS warmup and mute toggle
  [`useSpeech.ts:12`](../../src/hooks/useSpeech.ts#L12)

- Wake lock with stale-closure-safe visibility re-acquire
  [`useWakeLock.ts:10`](../../src/hooks/useWakeLock.ts#L10)

**UI components**

- Large countdown display and block label rendering
  [`TimerDisplay.tsx:11`](../../src/components/TimerDisplay.tsx#L11)

- Start/Pause/Reset/Mute controls with phase-aware visibility
  [`Controls.tsx:62`](../../src/components/Controls.tsx#L62)

- Settings with presets, validation, and uneven-block warning
  [`Settings.tsx:9`](../../src/components/Settings.tsx#L9)

**Orchestration**

- App root — wires hooks to components, manages phase flow
  [`App.tsx:16`](../../src/App.tsx#L16)

**Config and infrastructure**

- Vite + Tailwind + PWA plugin configuration
  [`vite.config.ts:1`](../../vite.config.ts#L1)

- Mobile-optimized HTML entry with PWA meta tags
  [`index.html:1`](../../index.html#L1)
