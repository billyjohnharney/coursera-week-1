import React from 'react'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle } from '@base-ui/react/toggle'
import styles from './ControlBar.module.css'

const PIXEL_SIZES = [
  { value: 1,  label: '1px'   },
  { value: 3,  label: '3×3'   },
  { value: 5,  label: '5×5'   },
  { value: 10, label: '10×10' },
  { value: 20, label: '20×20' },
]

export default function ControlBar({ pixelSize, onPixelSize }) {
  return (
    <footer className={styles.bar}>
      <span className={styles.label}>Area</span>
      <ToggleGroup
        value={String(pixelSize)}
        onValueChange={val => val && onPixelSize(Number(val))}
        className={styles.toggleGroup}
        aria-label="Pixel area size"
      >
        {PIXEL_SIZES.map(({ value, label }) => (
          <Toggle
            key={value}
            value={String(value)}
            className={styles.toggle}
            aria-label={`${label} area`}
          >
            {label}
          </Toggle>
        ))}
      </ToggleGroup>
    </footer>
  )
}
