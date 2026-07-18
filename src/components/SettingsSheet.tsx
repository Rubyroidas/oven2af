import { useState } from 'react'
import type { FormulaSettings } from '../lib/storage'
import './SettingsSheet.css'

interface SettingsSheetProps {
  open: boolean
  settings: FormulaSettings
  onSave: (settings: FormulaSettings) => void
  onClose: () => void
}

export function SettingsSheet({ open, settings, onSave, onClose }: SettingsSheetProps) {
  const [tempDropF, setTempDropF] = useState(settings.tempDropF)
  const [timeMultiplier, setTimeMultiplier] = useState(Math.round(settings.timeMultiplier * 100))

  if (!open) return null

  const commit = () => {
    onSave({
      tempDropF: clamp(tempDropF, 0, 100),
      timeMultiplier: clamp(timeMultiplier, 10, 100) / 100,
    })
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Conversion formula settings"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__grabber" />
        <h2 className="sheet__title">Formula</h2>
        <p className="sheet__hint">
          Tune how much cooler and faster your air fryer runs than your oven.
        </p>

        <label className="sheet__field">
          <span>Temperature drop</span>
          <div className="sheet__stepper">
            <button type="button" onClick={() => setTempDropF((v) => clamp(v - 5, 0, 100))}>
              −
            </button>
            <span className="sheet__value">{tempDropF}°F</span>
            <button type="button" onClick={() => setTempDropF((v) => clamp(v + 5, 0, 100))}>
              +
            </button>
          </div>
        </label>

        <label className="sheet__field">
          <span>Time multiplier</span>
          <div className="sheet__stepper">
            <button
              type="button"
              onClick={() => setTimeMultiplier((v) => clamp(v - 5, 10, 100))}
            >
              −
            </button>
            <span className="sheet__value">{timeMultiplier}%</span>
            <button
              type="button"
              onClick={() => setTimeMultiplier((v) => clamp(v + 5, 10, 100))}
            >
              +
            </button>
          </div>
        </label>

        <button type="button" className="sheet__save" onClick={commit}>
          Save
        </button>
      </div>
    </div>
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
