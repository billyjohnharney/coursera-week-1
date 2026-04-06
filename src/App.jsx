import React, { useState } from 'react'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle } from '@base-ui/react/toggle'
import ImageCanvas from './components/ImageCanvas'
import ColourPanel from './components/ColourPanel'
import DropZone from './components/DropZone'
import styles from './App.module.css'

export default function App() {
  const [imageUrl, setImageUrl] = useState(null)
  const [colour, setColour] = useState(null)
  const [mode, setMode] = useState('pixel')

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setColour(null)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Photo Colour Picker</h1>
        {imageUrl && (
          <div className={styles.toolbar}>
            <ToggleGroup
              value={mode}
              onValueChange={val => val && setMode(val)}
              className={styles.modeToggle}
              aria-label="Pick mode"
            >
              <Toggle value="pixel" className={styles.modeBtn} aria-label="Pixel mode">
                Pixel
              </Toggle>
              <Toggle value="area" className={styles.modeBtn} aria-label="Area average mode">
                Area average
              </Toggle>
            </ToggleGroup>
            <label className={styles.changeBtn}>
              Change photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => handleFile(e.target.files[0])}
              />
            </label>
          </div>
        )}
      </header>

      <main className={styles.main}>
        {!imageUrl ? (
          <DropZone onFile={handleFile} />
        ) : (
          <div className={styles.workspace}>
            <div className={styles.canvasWrap}>
              <ImageCanvas
                imageUrl={imageUrl}
                mode={mode}
                onColour={setColour}
              />
            </div>
            <aside className={styles.panel}>
              <ColourPanel colour={colour} />
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
