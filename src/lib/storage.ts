export type Unit = 'F' | 'C';

export interface FormulaSettings {
  tempDropF: number;
  timeMultiplier: number;
}

export interface LastInput {
  temp: number;
  unit: Unit;
  minutes: number;
}

export const DEFAULT_SETTINGS: FormulaSettings = {
    tempDropF: 25,
    timeMultiplier: 0.8,
};

export const DEFAULT_INPUT: LastInput = {
    temp: 390,
    unit: 'F',
    minutes: 20,
};

const SETTINGS_KEY = 'oven2af:settings';
const INPUT_KEY = 'oven2af:last-input';

function readJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }
        return {
            ...fallback,
            ...JSON.parse(raw),
        };
    } catch {
        return fallback;
    }
}

export function loadSettings(): FormulaSettings {
    return readJSON(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: FormulaSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadLastInput(): LastInput {
    return readJSON(INPUT_KEY, DEFAULT_INPUT);
}

export function saveLastInput(input: LastInput) {
    localStorage.setItem(INPUT_KEY, JSON.stringify(input));
}
