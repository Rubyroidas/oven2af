import { useEffect, useRef, type PointerEvent } from 'react'
import './ReelPicker.css'

const ITEM_HEIGHT = 48

interface ReelPickerProps {
  values: number[]
  value: number
  onChange: (value: number) => void
  format?: (value: number) => string
  ariaLabel: string
}

export function ReelPicker({ values, value, onChange, format, ariaLabel }: ReelPickerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<number | undefined>(undefined)
  const isProgrammatic = useRef(false)
  const drag = useRef<{ startY: number; startScrollTop: number; moved: boolean } | null>(null)
  const justDragged = useRef(false)

  const closestIndex = () => {
    let idx = values.indexOf(value)
    if (idx === -1) {
      idx = values.reduce(
        (best, v, i) => (Math.abs(v - value) < Math.abs(values[best] - value) ? i : best),
        0,
      )
    }
    return idx
  }

  // Scroll to the value's index whenever it changes from outside (or on mount).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const idx = closestIndex()
    const target = idx * ITEM_HEIGHT
    if (Math.abs(el.scrollTop - target) > 1) {
      isProgrammatic.current = true
      el.scrollTo({ top: target, behavior: 'auto' })
      window.setTimeout(() => (isProgrammatic.current = false), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, values])

  const handleScroll = () => {
    if (isProgrammatic.current) return
    const el = scrollerRef.current
    if (!el) return
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_HEIGHT)
      const clamped = Math.min(values.length - 1, Math.max(0, idx))
      const next = values[clamped]
      if (next !== value) {
        onChange(next)
      } else {
        el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      }
    }, 90)
  }

  const settleToNearest = () => {
    const el = scrollerRef.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT)
    const clamped = Math.min(values.length - 1, Math.max(0, idx))
    const next = values[clamped]
    if (next !== value) {
      onChange(next)
    } else {
      el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
    }
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = scrollerRef.current
    if (!el) return
    drag.current = { startY: e.clientY, startScrollTop: el.scrollTop, moved: false }
    el.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = scrollerRef.current
    if (!d || !el) return
    const delta = e.clientY - d.startY
    if (Math.abs(delta) > 3) d.moved = true
    el.scrollTop = d.startScrollTop - delta
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (drag.current && el) el.releasePointerCapture(e.pointerId)
    if (drag.current?.moved) {
      justDragged.current = true
      window.setTimeout(() => (justDragged.current = false), 0)
    }
    drag.current = null
    window.clearTimeout(settleTimer.current)
    settleToNearest()
  }

  return (
    <div className="reel" role="group" aria-label={ariaLabel}>
      <div className="reel__highlight" aria-hidden="true" />
      <div
        className="reel__scroller"
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="reel__pad" aria-hidden="true" />
        {values.map((v) => {
          const distance = Math.abs(v - value)
          const isCenter = v === value
          return (
            <div
              key={v}
              className={`reel__item${isCenter ? ' reel__item--active' : ''}`}
              style={{ opacity: Math.max(0.25, 1 - distance / (values[1] - values[0]) / 3) }}
              onClick={() => {
                if (justDragged.current) return
                onChange(v)
              }}
            >
              {format ? format(v) : v}
            </div>
          )
        })}
        <div className="reel__pad" aria-hidden="true" />
      </div>
    </div>
  )
}

export { ITEM_HEIGHT }
