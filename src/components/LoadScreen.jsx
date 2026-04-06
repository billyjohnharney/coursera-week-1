import React, { useRef, useState } from 'react'
import styles from './LoadScreen.module.css'

// ── Inline SVG icons ───────────────────────────────────────────
function IconPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  )
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────
export default function LoadScreen({ onFile, onUrl }) {
  const fileInputRef   = useRef(null)
  const cameraInputRef = useRef(null)
  const [urlValue, setUrlValue]     = useState('')
  const [urlError, setUrlError]     = useState('')
  const [dragging, setDragging]     = useState(false)
  const [loadingUrl, setLoadingUrl] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handlePaste(e) {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (imageItem) onFile(imageItem.getAsFile())
  }

  function handleUrlSubmit(e) {
    e.preventDefault()
    const url = urlValue.trim()
    if (!url) return
    setUrlError('')
    setLoadingUrl(true)

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { setLoadingUrl(false); onUrl(url) }
    img.onerror = () => {
      setLoadingUrl(false)
      setUrlError('Could not load image. Check the URL or try downloading and uploading the file directly (some servers block cross-origin requests).')
    }
    img.src = url
  }

  return (
    <div
      className={`${styles.screen} ${dragging ? styles.dragging : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <h1 className={styles.title}>Caffrey's Colour</h1>
      <p className={styles.subtitle}>Identify exact colours in any photo</p>

      <div className={styles.options}>

        {/* ── File picker ── */}
        <button className={styles.optionBtn} onClick={() => fileInputRef.current?.click()}>
          <span className={styles.optionIcon}><IconPhoto /></span>
          <span className={styles.optionLabel}>Choose photo</span>
          <span className={styles.optionHint}>From your device or drag here</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => onFile(e.target.files[0])} />

        {/* ── Camera capture ── */}
        <button className={styles.optionBtn} onClick={() => cameraInputRef.current?.click()}>
          <span className={styles.optionIcon}><IconCamera /></span>
          <span className={styles.optionLabel}>Take a photo</span>
          <span className={styles.optionHint}>Use your camera</span>
        </button>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={e => onFile(e.target.files[0])} />

        {/* ── URL ── */}
        <div className={styles.urlBlock}>
          <span className={styles.optionIcon}><IconLink /></span>
          <span className={styles.optionLabel}>Load from URL</span>
          <form className={styles.urlForm} onSubmit={handleUrlSubmit}>
            <input
              className={styles.urlInput}
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={urlValue}
              onChange={e => { setUrlValue(e.target.value); setUrlError('') }}
              aria-label="Image URL"
            />
            <button type="submit" className={styles.urlBtn} disabled={!urlValue.trim() || loadingUrl}>
              {loadingUrl ? '…' : 'Load'}
            </button>
          </form>
          {urlError && <p className={styles.urlError}>{urlError}</p>}
        </div>

      </div>

      <p className={styles.paste}>Or paste an image (Ctrl+V / ⌘V)</p>
    </div>
  )
}
