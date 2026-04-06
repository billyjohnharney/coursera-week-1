import React, { useRef, useState } from 'react'
import styles from './DropZone.module.css'

export default function DropZone({ onFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

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

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
      role="button"
      aria-label="Drop zone. Click, drag a photo, or paste from clipboard."
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => onFile(e.target.files[0])}
      />
      <div className={styles.icon} aria-hidden="true">⬡</div>
      <p className={styles.primary}>Drop a photo here</p>
      <p className={styles.secondary}>or click to browse · paste from clipboard (Ctrl+V)</p>
    </div>
  )
}
