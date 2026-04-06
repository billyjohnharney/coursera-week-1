import React, { useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { rgbToHex, rgbToHsl, rgbToCmyk, getColourName } from '../colourUtils'
import styles from './ResultBar.module.css'

const UNITS = [
  { value: 'hex',  label: 'Hex'  },
  { value: 'rgb',  label: 'RGB'  },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'name', label: 'Name' },
  { value: 'hsl',  label: 'HSL'  },
]

export default function ResultBar({ colour, unit, onUnit, onReset }) {
  const hasColour = !!colour

  const hex  = hasColour ? rgbToHex(colour.r, colour.g, colour.b)  : null
  const hsl  = hasColour ? rgbToHsl(colour.r, colour.g, colour.b)  : null
  const cmyk = hasColour ? rgbToCmyk(colour.r, colour.g, colour.b) : null
  const name = hasColour ? getColourName(colour.r, colour.g, colour.b) : null

  const displayValue = hasColour ? formatValue(colour, unit, hex, hsl, cmyk, name) : null
  const showValue    = hasColour && unit !== 'name'
  const fg           = hasColour ? contrastColour(colour) : null

  return (
    <header className={styles.bar} style={hasColour ? { background: hex } : undefined}>
      <button
        className={styles.resetBtn}
        onClick={onReset}
        aria-label="Load a different photo"
        style={fg ? { color: fg } : undefined}
      >
        ← Photo
      </button>

      {hasColour ? (
        <div className={styles.result}>
          <span className={styles.name} style={{ color: fg }}>{name}</span>

          <div className={styles.valueRow}>
            {/* Unit picker — tap to open */}
            <UnitPicker unit={unit} onUnit={onUnit} fg={fg} />

            {/* Value display + copy — only when not in Name mode */}
            {showValue && (
              <CopyValue value={displayValue} fg={fg} />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          Tap or click a pixel to pick a colour
        </div>
      )}
    </header>
  )
}

// ── Unit picker popover ───────────────────────────────────────
function UnitPicker({ unit, onUnit, fg }) {
  const currentLabel = UNITS.find(u => u.value === unit)?.label ?? 'Hex'

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <button
            className={styles.unitTrigger}
            style={{ color: fg, borderColor: fg ? `${fg}40` : undefined }}
            aria-label={`Colour unit: ${currentLabel}. Tap to change.`}
          />
        }
      >
        {currentLabel} ▾
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" alignment="end" sideOffset={8}>
          <Popover.Popup className={styles.popup}>
            {UNITS.map(({ value, label }) => (
              <Popover.Close
                key={value}
                render={
                  <button
                    className={`${styles.unitOption} ${unit === value ? styles.unitOptionActive : ''}`}
                    onClick={() => onUnit(value)}
                    aria-pressed={unit === value}
                  />
                }
              >
                {label}
              </Popover.Close>
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

// ── Copy button ───────────────────────────────────────────────
function CopyValue({ value, fg }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={styles.valueWrap}>
      <span className={styles.valueText} style={{ color: fg }}>{value}</span>
      <button
        className={styles.copyBtn}
        style={{ color: fg, borderColor: fg ? `${fg}40` : undefined }}
        onClick={copy}
        aria-label={`Copy ${value}`}
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────
function formatValue(colour, unit, hex, hsl, cmyk, name) {
  const { r, g, b } = colour
  switch (unit) {
    case 'rgb':  return `rgb(${r}, ${g}, ${b})`
    case 'cmyk': return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    case 'hsl':  return `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`
    case 'name': return name
    default:     return hex
  }
}

function contrastColour({ r, g, b }) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum > 140 ? '#111111' : '#ffffff'
}
