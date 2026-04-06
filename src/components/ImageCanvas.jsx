import React, { useEffect, useRef, useState } from 'react'
import { samplePixel, sampleRegion } from '../colourUtils'
import Magnifier from './Magnifier'
import styles from './ImageCanvas.module.css'

const MAGNIFIER_ZOOM = 5

export default function ImageCanvas({ imageUrl, pixelSize, onColour }) {
  const containerRef = useRef(null)
  const canvasRef    = useRef(null)
  const imageDataRef = useRef(null)
  const imgRef       = useRef(null)
  const pixelSizeRef = useRef(pixelSize)
  pixelSizeRef.current = pixelSize

  // { x, y } canvas coords — drives the magnifier
  const [magnifier, setMagnifier] = useState(null)
  // 'mouse' | 'touch' — controls magnifier anchor position
  const [magnifierMode, setMagnifierMode] = useState('mouse')
  // { x, y } canvas coords of the last confirmed pick — drives the highlight box
  const [highlight, setHighlight] = useState(null)

  // ── Image loading ─────────────────────────────────────────────
  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { imgRef.current = img; redraw() }
    img.onerror = () => {
      const img2 = new window.Image()
      img2.onload = () => { imgRef.current = img2; redraw() }
      img2.src = imageUrl
    }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(() => redraw())
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  function redraw() {
    const container = containerRef.current
    const canvas    = canvasRef.current
    const img       = imgRef.current
    if (!container || !canvas || !img) return

    const scale = Math.min(
      container.clientWidth  / img.naturalWidth,
      container.clientHeight / img.naturalHeight
    )
    const dw = Math.round(img.naturalWidth  * scale)
    const dh = Math.round(img.naturalHeight * scale)

    canvas.width  = dw
    canvas.height = dh

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, dw, dh)
    imageDataRef.current = ctx.getImageData(0, 0, dw, dh)
  }

  // ── Coordinate conversion ─────────────────────────────────────
  function toCanvasCoords(clientX, clientY) {
    const rect   = canvasRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    return {
      x: Math.floor((clientX - rect.left) * (canvas.width  / rect.width)),
      y: Math.floor((clientY - rect.top)  * (canvas.height / rect.height)),
    }
  }

  // ── Core pick function ────────────────────────────────────────
  function pickColour(x, y) {
    if (!imageDataRef.current) return
    // Clamp to canvas bounds
    const cx = Math.max(0, Math.min(x, imageDataRef.current.width  - 1))
    const cy = Math.max(0, Math.min(y, imageDataRef.current.height - 1))
    const ps  = pixelSizeRef.current
    const rgb = ps === 1
      ? samplePixel(imageDataRef.current, cx, cy)
      : sampleRegion(
          imageDataRef.current,
          cx - Math.floor(ps / 2), cy - Math.floor(ps / 2),
          cx + Math.floor(ps / 2), cy + Math.floor(ps / 2)
        )
    if (rgb) {
      onColour({ ...rgb, pixelSize: ps })
      setHighlight({ x: cx, y: cy })
    }
  }

  // ── Mouse handlers ────────────────────────────────────────────
  function handleMouseMove(e) {
    if (!imageDataRef.current) return
    const { x, y } = toCanvasCoords(e.clientX, e.clientY)
    setMagnifier({ x, y })
    setMagnifierMode('mouse')
    pickColour(x, y)
  }

  function handleMouseLeave() {
    setMagnifier(null)
  }

  function handleClick(e) {
    const { x, y } = toCanvasCoords(e.clientX, e.clientY)
    pickColour(x, y)
  }

  // ── Touch handlers ────────────────────────────────────────────
  // touchstart  → immediate pick at contact point
  // touchmove   → continuous pick as finger slides (hold & drag)
  // touchend    → hide magnifier

  function handleTouchStart(e) {
    e.preventDefault() // stops click delay and page scroll
    const touch = e.touches[0]
    const { x, y } = toCanvasCoords(touch.clientX, touch.clientY)
    setMagnifierMode('touch')
    setMagnifier({ x, y })
    pickColour(x, y)
  }

  function handleTouchMove(e) {
    e.preventDefault()
    const touch = e.touches[0]
    const { x, y } = toCanvasCoords(touch.clientX, touch.clientY)
    setMagnifier({ x, y })
    pickColour(x, y)
  }

  function handleTouchEnd(e) {
    e.preventDefault()
    setMagnifier(null)
  }

  // ── Highlight box (CSS display coords) ───────────────────────
  const highlightStyle = highlight && canvasRef.current ? (() => {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const scaleX = rect.width  / canvas.width
    const scaleY = rect.height / canvas.height
    const ps     = pixelSize
    const half   = Math.floor(ps / 2)
    return {
      left:   (highlight.x - half) * scaleX,
      top:    (highlight.y - half) * scaleY,
      width:  Math.max(1, ps) * scaleX,
      height: Math.max(1, ps) * scaleY,
    }
  })() : null

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {highlightStyle && (
          <div className={styles.highlight} style={highlightStyle} aria-hidden="true" />
        )}
        {magnifier && canvasRef.current && imageDataRef.current && (
          <Magnifier
            canvasRef={canvasRef}
            x={magnifier.x}
            y={magnifier.y}
            zoom={MAGNIFIER_ZOOM}
            placement={magnifierMode === 'touch' ? 'above' : 'side'}
          />
        )}
      </div>
    </div>
  )
}
