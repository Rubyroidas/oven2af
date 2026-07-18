import { useEffect, useMemo, useState } from 'react';

import { ReelPicker } from './components/ReelPicker';
import { SettingsSheet } from './components/SettingsSheet';
import { convert } from './lib/convert';
import {
    loadLastInput,
    loadSettings,
    saveLastInput,
    saveSettings,
    type FormulaSettings,
    type Unit,
} from './lib/storage';
import './App.css';

const F_RANGE = range(200, 500, 5);
const C_RANGE = range(90, 260, 5);
const MINUTE_RANGE = range(1, 120, 1);

function range(start: number, end: number, step: number) {
    const out: number[] = [];
    for (let v = start; v <= end; v += step) {
        out.push(v);
    }
    return out;
}

function nearest(values: number[], target: number) {
    return values.reduce((best, v) => (Math.abs(v - target) < Math.abs(best - target) ? v : best));
}

function App() {
    const [settings, setSettings] = useState<FormulaSettings>(() => loadSettings());
    const [{ unit, temp, minutes }, setInput] = useState(() => loadLastInput());
    const [settingsOpen, setSettingsOpen] = useState(false);

    const setTemp = (t: number) => setInput((prev) => ({
        ...prev,
        temp: t,
    }));
    const setMinutes = (m: number) => setInput((prev) => ({
        ...prev,
        minutes: m,
    }));

    useEffect(() => {
        saveLastInput({
            temp,
            unit,
            minutes,
        });
    }, [temp, unit, minutes]);

    const tempValues = unit === 'F' ? F_RANGE : C_RANGE;

    const handleUnitChange = (next: Unit) => {
        if (next === unit) {
            return;
        }
        const converted =
      next === 'C' ? Math.round(((temp - 32) * 5) / 9) : Math.round((temp * 9) / 5 + 32);
        const snapped = nearest(next === 'F' ? F_RANGE : C_RANGE, converted);
        setInput((prev) => ({
            ...prev,
            unit: next,
            temp: snapped,
        }));
    };

    const result = useMemo(
        () => convert(temp, unit, minutes, settings),
        [temp, unit, minutes, settings],
    );

    return (
        <div className="app">
            <header className="app__header">
                <div className="app__eyebrow">Oven &rarr; Air Fryer cooking converter</div>
                <button
                    className="app__settings-btn"
                    aria-label="Open formula settings"
                    onClick={() => setSettingsOpen(true)}
                >
                    <GearIcon />
                </button>
            </header>

            <main className="app__main">
                <div className="unit-toggle" role="radiogroup" aria-label="Temperature unit">
                    {(['F', 'C'] as Unit[]).map((u) => (
                        <button
                            key={u}
                            role="radio"
                            aria-checked={unit === u}
                            className={`unit-toggle__btn${unit === u ? ' unit-toggle__btn--active' : ''}`}
                            onClick={() => handleUnitChange(u)}
                        >
              °{u}
                        </button>
                    ))}
                </div>

                <section className="dials">
                    <div className="dial">
                        <span className="dial__label">Oven temp</span>
                        <ReelPicker
                            values={tempValues}
                            value={temp}
                            onChange={setTemp}
                            format={(v) => `${v}°`}
                            ariaLabel="Oven temperature"
                        />
                    </div>
                    <div className="dial">
                        <span className="dial__label">Time</span>
                        <ReelPicker
                            values={MINUTE_RANGE}
                            value={minutes}
                            onChange={setMinutes}
                            format={(v) => `${v}m`}
                            ariaLabel="Cook time in minutes"
                        />
                    </div>
                </section>

                <div className="arrow-divider" aria-hidden="true">
                    <span />
                    <ArrowIcon />
                    <span />
                </div>

                <section className="result" aria-live="polite">
                    <span className="result__label">Air fryer</span>
                    <div className="result__values">
                        <span className="result__temp">
                            {result.temp}
                            <small>°{unit}</small>
                        </span>
                        <span className="result__sep">·</span>
                        <span className="result__time">
                            {result.minutes}
                            <small>min</small>
                        </span>
                    </div>
                </section>
            </main>

            <footer className="app__footer">
                <p>
          Based on a {settings.tempDropF}°F drop and{' '}
                    {Math.round(settings.timeMultiplier * 100)}% time.
                </p>
                <a
                    className="app__github"
                    href="https://github.com/Rubyroidas/oven2af"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View source on GitHub"
                >
                    <GitHubIcon />
                </a>
            </footer>

            <SettingsSheet
                open={settingsOpen}
                settings={settings}
                onSave={(s) => {
                    setSettings(s);
                    saveSettings(s);
                }}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    );
}

function GearIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M19.4 13a7.4 7.4 0 0 0 .06-1 7.4 7.4 0 0 0-.06-1l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.4 7.4 0 0 0-1.73-1L14.5 2.8a.5.5 0 0 0-.49-.4h-3.84a.5.5 0 0 0-.5.4l-.4 2.45a7.4 7.4 0 0 0-1.73 1l-2.39-.96a.5.5 0 0 0-.6.22L2.63 8.8a.5.5 0 0 0 .12.64L4.78 11a7.4 7.4 0 0 0 0 2l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7.4 7.4 0 0 0 1.73 1l.4 2.45a.5.5 0 0 0 .5.4h3.84a.5.5 0 0 0 .49-.4l.4-2.45a7.4 7.4 0 0 0 1.73-1l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64L19.4 13Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.62 2.29 6.7 5.47 7.78.4.08.55-.18.55-.39 0-.19-.01-.82-.01-1.49-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.2-3.64-.91-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.04.08-2.16 0 0 .67-.22 2.2.84a7.4 7.4 0 0 1 2-.28c.68 0 1.36.09 2 .28 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.96.08 2.16.51.57.82 1.29.82 2.19 0 3.12-1.87 3.82-3.65 4.02.29.26.54.75.54 1.53 0 1.11-.01 2-.01 2.27 0 .21.15.48.55.39A8.21 8.21 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 4v16m0 0-6-6m6 6 6-6"
                stroke="url(#arrow-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="arrow-grad" x1="12" y1="4" x2="12" y2="20">
                    <stop stopColor="var(--accent)" />
                    <stop offset="1" stopColor="var(--accent2)" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default App;
