import React, { useState } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { rgbToHex, rgbToHsl, getColourName } from '../colourUtils'
import styles from './ColourPanel.module.css'

export default function ColourPanel({ colour }) {
  if (!colour) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <p>Hover or click the image to pick a colour.</p>
          <p className={styles.emptyHint}>
            Use <strong>Area average</strong> mode to drag-select a region.
          </p>
        </div>
      </div>
    )
  }

  const { r, g, b, mode } = colour
  const hex = rgbToHex(r, g, b)
  const hsl = rgbToHsl(r, g, b)
  const name = getColourName(r, g, b)

  return (
    <div className={styles.panel}>
      <div
        className={styles.swatch}
        style={{ background: hex }}
        aria-label={`Colour swatch: ${name}`}
      />
      <div className={styles.name}>{name}</div>
      <div className={styles.badge}>{mode === 'area' ? 'Area average' : 'Pixel'}</div>

      <div className={styles.values}>
        <ColourRow label="Hex" value={hex} copyable />
        <ColourRow label="RGB" value={`${r}, ${g}, ${b}`} copyable />
        <ColourRow label="HSL" value={`${hsl.h}°  ${hsl.s}%  ${hsl.l}%`} />
        <ColourRow label="R" value={r} bar={(r / 255) * 100} />
        <ColourRow label="G" value={g} bar={(g / 255) * 100} />
        <ColourRow label="B" value={b} bar={(b / 255) * 100} />
      </div>
    </div>
  )
}

function ColourRow({ label, value, copyable, bar }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>
        {bar !== undefined ? (
          <span className={styles.barWrap}>
            <span className={styles.bar} style={{ width: `${bar}%` }} />
            <span className={styles.barNum}>{value}</span>
          </span>
        ) : (
          <span className={styles.valueText}>{value}</span>
        )}
      </span>
      {copyable && (
        <Tooltip.Provider delay={300}>
          <Tooltip.Root>
            <Tooltip.Trigger
              render={
                <button
                  className={styles.copyBtn}
                  onClick={copy}
                  aria-label={`Copy ${label} value`}
                />
              }
            >
              {copied ? '✓' : 'Copy'}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side="top" alignment="center" sideOffset={6}>
                <Tooltip.Popup className={styles.tooltip}>
                  {copied ? 'Copied!' : `Copy ${label}`}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  )
}
