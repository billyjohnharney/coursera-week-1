import React, { useCallback, useEffect, useRef, useState } from 'react'
import { samplePixel, sampleRegion } from '../colourUtils'
import Magnifier from './Magnifier'
import styles from './ImageCanvas.module.css'

const MAGNIFIER_RADIUS = 60
const MAGNIFIER_ZOOM = 4

export default function ImageCanvas({ imageUrl, mode, onColour }) {
  const canvasRef = useRef(null)
  const imageDataRef = useRef(null)  // raw pixel data for the displayed image
  const imgRef = useRef(null)

  // Natural image size and display size
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })

  // Magnifier
  const [magnifier, setMagnifier] = useState(null) // { x, y } canvas coords

  // Area drag state
  const dragRef = useRef(null) // { startX, startY, endX, endY }
  const [dragRect, setDragRect] = useState(null)

  // Load the image onto the canvas
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      imgRef.current = img
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.src = imageUrl
  }, [imageUrl])

  // Size canvas to container, redraw when image or size changes
  const containerRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return
    const obs = new ResizeObserver(() => redraw())
    obs.observe(containerRef.current)
    redraw()
    return () => obs.disconnect()
  }, [imgSize])

  function redraw() {
    const container = containerRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!container || !canvas || !img) return

    const cw = container.clientWidth
    const ch = container.clientHeight

    // Scale to fit, maintaining aspect ratio
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = Math.round(img.naturalWidth * scale)
    const dh = Math.round(img.naturalHeight * scale)

    canvas.width = dw
    canvas.height = dh
    setCanvasSize({ w: dw, h: dh })

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, dw, dh)
    imageDataRef.current = ctx.getImageData(0, 0, dw, dh)
  }

  // Convert mouse event to canvas pixel coordinates
  function toCanvasCoords(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    }
  }

  // --- Pixel mode handlers ---
  function handleMouseMove(e) {
    if (!imageDataRef.current) return
    const { x, y } = toCanvasCoords(e)
    setMagnifier({ x, y })

    if (mode === 'pixel') {
      const rgb = samplePixel(imageDataRef.current, x, y)
      onColour({ ...rgb, mode: 'pixel', x, y })
    }

    // Area drag in progress
    if (mode === 'area' && dragRef.current?.dragging) {
      dragRef.current.endX = x
      dragRef.current.endY = y
      setDragRect({ ...dragRef.current })
    }
  }

  function handleMouseLeave() {
    setMagnifier(null)
    if (dragRef.current?.dragging) {
      dragRef.current.dragging = false
      setDragRect(null)
    }
  }

  // --- Area mode handlers ---
  function handleMouseDown(e) {
    if (mode !== 'area' || !imageDataRef.current) return
    const { x, y } = toCanvasCoords(e)
    dragRef.current = { startX: x, startY: y, endX: x, endY: y, dragging: true }
    setDragRect({ startX: x, startY: y, endX: x, endY: y })
  }

  function handleMouseUp(e) {
    if (mode !== 'area' || !dragRef.current?.dragging || !imageDataRef.current) return
    const { x, y } = toCanvasCoords(e)
    dragRef.current.dragging = false
    dragRef.current.endX = x
    dragRef.current.endY = y

    const { startX, startY, endX, endY } = dragRef.current
    if (Math.abs(endX - startX) < 3 && Math.abs(endY - startY) < 3) {
      // Tiny drag — treat as pixel click
      const rgb = samplePixel(imageDataRef.current, x, y)
      onColour({ ...rgb, mode: 'pixel', x, y })
    } else {
      const rgb = sampleRegion(imageDataRef.current, startX, startY, endX, endY)
      if (rgb) onColour({ ...rgb, mode: 'area' })
    }
    setDragRect(null)
  }

  function handleClick(e) {
    if (mode !== 'pixel' || !imageDataRef.current) return
    const { x, y } = toCanvasCoords(e)
    const rgb = samplePixel(imageDataRef.current, x, y)
    onColour({ ...rgb, mode: 'pixel', x, y })
  }

  // Drag rect in CSS coords (relative to canvas element)
  const dragRectStyle = dragRect ? (() => {
    const rect = canvasRef.current?.getBoundingClientRect()
    const canvasEl = canvasRef.current
    if (!rect || !canvasEl) return null
    const scaleX = rect.width / canvasEl.width
    const scaleY = rect.height / canvasEl.height
    const x1 = Math.min(dragRect.startX, dragRect.endX) * scaleX
    const y1 = Math.min(dragRect.startY, dragRect.endY) * scaleY
    const x2 = Math.max(dragRect.startX, dragRect.endX) * scaleX
    const y2 = Math.max(dragRect.startY, dragRect.endY) * scaleY
    return { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }
  })() : null

  const cursor = mode === 'area' ? 'crosshair' : 'none'

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.canvasContainer} style={{ cursor }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        />
        {dragRectStyle && (
          <div className={styles.dragRect} style={dragRectStyle} />
        )}
        {magnifier && canvasRef.current && imageDataRef.current && (
          <Magnifier
            canvasRef={canvasRef}
            x={magnifier.x}
            y={magnifier.y}
            radius={MAGNIFIER_RADIUS}
            zoom={MAGNIFIER_ZOOM}
          />
        )}
      </div>
    </div>
  )
}
