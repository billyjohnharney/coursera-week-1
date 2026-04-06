import React, { useEffect, useRef, useState } from 'react'
import { samplePixel, sampleRegion } from '../colourUtils'
import Magnifier from './Magnifier'
import styles from './ImageCanvas.module.css'

const MAGNIFIER_ZOOM = 5

export default function ImageCanvas({ imageUrl, pixelSize, onColour }) {
  const containerRef   = useRef(null)
  const canvasRef      = useRef(null)
  const imageDataRef   = useRef(null)
  const imgRef         = useRef(null)
  const pixelSizeRef   = useRef(pixelSize)

  const [magnifier, setMagnifier] = useState(null) // { x, y } in canvas coords
  // Highlight square shown over the last picked point
  const [highlight, setHighlight] = useState(null) // { x, y } canvas coords

  // Keep ref in sync so event handlers always see current value
  pixelSizeRef.current = pixelSize

  // Load image
  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      redraw()
    }
    img.onerror = () => {
      // Retry without crossOrigin for same-origin blob URLs
      const img2 = new window.Image()
      img2.onload = () => { imgRef.current = img2; redraw() }
      img2.src = imageUrl
    }
    img.src = imageUrl
  }, [imageUrl])

  // Resize observer — redraws canvas when container resizes
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

    const cw = container.clientWidth
    const ch = container.clientHeight
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = Math.round(img.naturalWidth  * scale)
    const dh = Math.round(img.naturalHeight * scale)

    canvas.width  = dw
    canvas.height = dh

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, dw, dh)
    imageDataRef.current = ctx.getImageData(0, 0, dw, dh)
  }

  // Convert mouse / touch event to canvas pixel coords
  function toCanvasCoords(clientX, clientY) {
    const rect   = canvasRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top)  * scaleY),
    }
  }

  function pickColour(x, y) {
    if (!imageDataRef.current) return
    const ps = pixelSizeRef.current
    const rgb = ps === 1
      ? samplePixel(imageDataRef.current, x, y)
      : sampleRegion(imageDataRef.current, x - Math.floor(ps / 2), y - Math.floor(ps / 2),
                     x + Math.floor(ps / 2), y + Math.floor(ps / 2))
    if (rgb) {
      onColour({ ...rgb, pixelSize: ps })
      setHighlight({ x, y })
    }
  }

  // Mouse handlers
  function handleMouseMove(e) {
    if (!imageDataRef.current) return
    const { x, y } = toCanvasCoords(e.clientX, e.clientY)
    setMagnifier({ x, y })
    // Live preview on hover
    pickColour(x, y)
  }

  function handleMouseLeave() {
    setMagnifier(null)
  }

  function handleClick(e) {
    const { x, y } = toCanvasCoords(e.clientX, e.clientY)
    pickColour(x, y)
  }

  // Touch handlers — single tap picks, no magnifier needed
  function handleTouchEnd(e) {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const { x, y } = toCanvasCoords(touch.clientX, touch.clientY)
    pickColour(x, y)
    setMagnifier(null)
  }

  // Highlight box in CSS-display coordinates
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: 'crosshair' }}
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
          />
        )}
      </div>
    </div>
  )
}
