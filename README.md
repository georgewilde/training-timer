# Anna's Training Timer

A session timer with spoken block announcements, built for timing dog training sessions. Set a total session length and a block interval — the app counts down each block and announces transitions using speech synthesis so you can stay focused on your dog.

**Live app:** [training-timer-ten.vercel.app](https://training-timer-ten.vercel.app/)

## Features

- **Configurable sessions** — set total session duration and block length (defaults: 90 min session, 15 min blocks)
- **Spoken announcements** — uses the Web Speech API to announce block transitions (e.g. "Second 15 minutes") hands-free
- **Wake lock** — keeps the screen on while a session is running
- **Installable PWA** — add to your home screen for a native app experience on mobile
- **Responsive layout** — works in both portrait and landscape orientations

## Tech Stack

React · TypeScript · Vite · Tailwind CSS v4 · vite-plugin-pwa

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Build

```bash
npm run build
```

This runs the TypeScript compiler followed by a Vite production build. Output goes to the `dist/` directory.

## Lint

```bash
npm run lint
```
