# Oven → Air Fryer

A tiny installable web app that converts your oven's temperature and cook time into the equivalent air fryer settings.

Set your oven temp and time on two scroll-wheel dials (just like the pickers in iOS), and the air fryer numbers update instantly below. Defaults to 390°F / 20 min, but remembers whatever you last used.

## Features

- **Scroll-wheel pickers** for temperature and time — drag with a mouse, swipe on touch, or use the mouse wheel.
- **°F / °C toggle**, with the temperature dial converting and re-snapping automatically.
- **Adjustable formula** — tap the gear icon to tune how much cooler and faster your air fryer runs than your oven (defaults: −25°F, 80% of the time). Your settings and last-used values are saved to `localStorage`, so they're there next time you open the app.
- **Installable PWA** — add it to your home screen on iOS/Android or install it as a desktop app; it works offline once loaded.

## Running it locally

Requires [Node.js](https://nodejs.org/).

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds a production bundle into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |
| `npm run lint:fix` | Runs ESLint and auto-fixes what it can |

## Tech stack

Built with [Vite](https://vite.dev/), [React](https://react.dev/), and TypeScript, with [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) handling the service worker and web manifest.
