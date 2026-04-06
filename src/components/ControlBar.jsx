import React from 'react'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle } from '@base-ui/react/toggle'
import styles from './ControlBar.module.css'

const PIXEL_SIZES = [
  { value: 1,  label: '1px' },
  { value: 3,  label: '3×3' },
  { value: 5,  label: '5×5' },
  { value: 10, label: '10×10' },
  { value: 20, label: '20×20' },
]

const UNITS = [
  { value: 'hex',  label: 'Hex'  },
  { value: 'rgb',  label: 'RGB'  },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'name', label: 'Name' },
  { value: 'hsl',  label: 'HSL'  },
]

export default function ControlBar({ pixelSize, onPixelSize, unit, onUnit }) {
  return (
    <footer className={styles.bar}>
      <div className={styles.group}>
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
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.group}>
        <span className={styles.label}>Unit</span>
        <ToggleGroup
          value={unit}
          onValueChange={val => val && onUnit(val)}
          className={styles.toggleGroup}
          aria-label="Colour value unit"
        >
          {UNITS.map(({ value, label }) => (
            <Toggle
              key={value}
              value={value}
              className={styles.toggle}
              aria-label={`Show ${label} values`}
            >
              {label}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
    </footer>
  )
}
