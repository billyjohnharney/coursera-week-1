import React, { useState } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { rgbToHex, rgbToHsl, rgbToCmyk, getColourName } from '../colourUtils'
import styles from './ResultBar.module.css'

export default function ResultBar({ colour, unit, onReset }) {
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
          {showValue && <CopyValue value={displayValue} fg={fg} />}
        </div>
      ) : (
        <div className={styles.placeholder}>
          Tap or click a pixel to pick a colour
        </div>
      )}
    </header>
  )
}

function CopyValue({ value, fg }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Tooltip.Provider delay={300}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              className={styles.valueBtn}
              style={{ color: fg, borderColor: fg ? `${fg}40` : undefined }}
              onClick={copy}
              aria-label={`Copy value: ${value}`}
            />
          }
        >
          {copied ? 'Copied!' : value}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" sideOffset={6}>
            <Tooltip.Popup className={styles.tooltip}>
              Tap to copy
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

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
