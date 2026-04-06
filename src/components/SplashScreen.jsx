import React, { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

// Shows for `visibleMs` then fades over `fadeMs`
const VISIBLE_MS = 1400
const FADE_MS    = 500

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setFading(true), VISIBLE_MS)
    const doneTimer = setTimeout(onDone, VISIBLE_MS + FADE_MS)
    return () => { clearTimeout(showTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div className={`${styles.splash} ${fading ? styles.fading : ''}`} aria-hidden="true">
      <div className={styles.logo}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
          <rect width="200" height="200" rx="40" fill="#111111"/>
          <text
            x="14"
            y="158"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="118"
            font-weight="700"
            fill="#ffffff"
            letter-spacing="-4"
          >CC</text>
        </svg>
        <div className={styles.wordmark}>
          <span className={styles.wordmarkMain}>Caffrey's</span>
          <span className={styles.wordmarkSub}>Colour</span>
        </div>
      </div>
    </div>
  )
}
