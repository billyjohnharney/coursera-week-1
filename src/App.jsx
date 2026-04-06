import React, { useCallback, useState } from 'react'
import ImageCanvas from './components/ImageCanvas'
import ResultBar from './components/ResultBar'
import ControlBar from './components/ControlBar'
import LoadScreen from './components/LoadScreen'
import SplashScreen from './components/SplashScreen'
import styles from './App.module.css'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [imageUrl, setImageUrl]     = useState(null)
  const [colour, setColour]         = useState(null)
  const [pixelSize, setPixelSize]   = useState(1)
  const [unit, setUnit]             = useState('hex')

  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setColour(null)
  }

  function handleUrl(url) {
    setImageUrl(prev => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return url
    })
    setColour(null)
  }

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div className={styles.app}>
        {!imageUrl ? (
          <LoadScreen onFile={handleFile} onUrl={handleUrl} />
        ) : (
          <>
            <ResultBar
              colour={colour}
              unit={unit}
              onUnit={setUnit}
              onReset={() => { setImageUrl(null); setColour(null) }}
            />
            <main className={styles.main}>
              <ImageCanvas
                imageUrl={imageUrl}
                pixelSize={pixelSize}
                onColour={setColour}
              />
            </main>
            <ControlBar
              pixelSize={pixelSize}
              onPixelSize={setPixelSize}
            />
          </>
        )}
      </div>
    </>
  )
}
