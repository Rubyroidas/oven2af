import type { FormulaSettings, Unit } from './storage';

export const cToF = (c: number) => Math.round((c * 9) / 5 + 32);
export const fToC = (f: number) => Math.round(((f - 32) * 5) / 9);

export interface ConversionResult {
  temp: number;
  minutes: number;
}

/**
 * Air fryers circulate heat more aggressively than an oven, so they cook
 * faster at a lower set temperature. tempDropF and timeMultiplier are the
 * two knobs the user can tune in settings to match their own appliance.
 */
export function convert(
    temp: number,
    unit: Unit,
    minutes: number,
    settings: FormulaSettings,
): ConversionResult {
    const tempF = unit === 'F' ? temp : cToF(temp);
    const resultF = Math.max(200, Math.round(tempF - settings.tempDropF));
    const resultTemp = unit === 'F' ? resultF : fToC(resultF);
    const resultMinutes = Math.max(1, Math.round(minutes * settings.timeMultiplier));
    return {
        temp: resultTemp,
        minutes: resultMinutes,
    };
}
