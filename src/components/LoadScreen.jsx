import React, { useRef, useState } from 'react'
import styles from './LoadScreen.module.css'

export default function LoadScreen({ onFile, onUrl }) {
  const fileInputRef   = useRef(null)
  const cameraInputRef = useRef(null)
  const [urlValue, setUrlValue]     = useState('')
  const [urlError, setUrlError]     = useState('')
  const [dragging, setDragging]     = useState(false)
  const [loadingUrl, setLoadingUrl] = useState(false)

  // ── Drag and drop ──────────────────────────────────────────────
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

  // ── URL loading ────────────────────────────────────────────────
  function handleUrlSubmit(e) {
    e.preventDefault()
    const url = urlValue.trim()
    if (!url) return
    setUrlError('')
    setLoadingUrl(true)

    // Probe the URL by loading it into a temporary Image
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setLoadingUrl(false)
      onUrl(url)
    }
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

        {/* ── Phone photos / file picker ── */}
        <button
          className={styles.optionBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.optionIcon} aria-hidden="true">🖼</span>
          <span className={styles.optionLabel}>Choose photo</span>
          <span className={styles.optionHint}>From your device or drag here</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={e => onFile(e.target.files[0])}
        />

        {/* ── Camera capture ── */}
        <button
          className={styles.optionBtn}
          onClick={() => cameraInputRef.current?.click()}
        >
          <span className={styles.optionIcon} aria-hidden="true">📷</span>
          <span className={styles.optionLabel}>Take a photo</span>
          <span className={styles.optionHint}>Use your camera</span>
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={e => onFile(e.target.files[0])}
        />

        {/* ── URL ── */}
        <div className={styles.urlBlock}>
          <span className={styles.optionIcon} aria-hidden="true">🔗</span>
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
            <button
              type="submit"
              className={styles.urlBtn}
              disabled={!urlValue.trim() || loadingUrl}
            >
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
