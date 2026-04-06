import React, { useEffect, useRef } from 'react'
import styles from './Magnifier.module.css'

const SIZE  = 120  // diameter px
const SRC_R = 14   // source radius in canvas pixels

export default function Magnifier({ canvasRef, x, y, zoom, placement = 'side' }) {
  const magRef = useRef(null)

  useEffect(() => {
    const mag = magRef.current
    const src = canvasRef.current
    if (!mag || !src) return

    const ctx = mag.getContext('2d')
    mag.width  = SIZE
    mag.height = SIZE

    ctx.clearRect(0, 0, SIZE, SIZE)

    // Clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2)
    ctx.clip()

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(src, x - SRC_R, y - SRC_R, SRC_R * 2, SRC_R * 2, 0, 0, SIZE, SIZE)

    // Centre crosshair
    const c = SIZE / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(c - 8, c); ctx.lineTo(c + 8, c)
    ctx.moveTo(c, c - 8); ctx.lineTo(c, c + 8)
    ctx.stroke()

    ctx.restore()

    // Outer ring
    ctx.beginPath()
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(180,180,180,0.85)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [canvasRef, x, y, zoom])

  const canvasEl = canvasRef.current
  if (!canvasEl) return null

  const rect   = canvasEl.getBoundingClientRect()
  const scaleX = rect.width  / canvasEl.width
  const scaleY = rect.height / canvasEl.height
  const dispX  = x * scaleX
  const dispY  = y * scaleY

  let left, top

  if (placement === 'above') {
    // Centre horizontally over the touch point, float above the finger
    const GAP = 24  // gap between fingertip and magnifier bottom edge
    left = dispX - SIZE / 2
    top  = dispY - SIZE - GAP

    // Clamp horizontally within the canvas element
    left = Math.max(0, Math.min(left, rect.width - SIZE))
    // If too close to the top, flip below instead
    if (top < 0) top = dispY + GAP
  } else {
    // Side placement for mouse — avoids covering the cursor
    const OFFSET = SIZE / 2 + 18
    left = dispX + OFFSET
    top  = dispY - SIZE / 2
    if (left + SIZE > rect.width)  left = dispX - OFFSET - SIZE
    left = Math.max(0, left)
    top  = Math.max(0, Math.min(top, rect.height - SIZE))
  }

  return (
    <canvas
      ref={magRef}
      className={styles.mag}
      width={SIZE}
      height={SIZE}
      style={{ left, top }}
      aria-hidden="true"
    />
  )
}
