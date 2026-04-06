import React, { useEffect, useRef } from 'react'
import styles from './Magnifier.module.css'

const SIZE = 120  // diameter of the magnifier circle in px

export default function Magnifier({ canvasRef, x, y, radius, zoom }) {
  const magRef = useRef(null)

  useEffect(() => {
    const mag = magRef.current
    const src = canvasRef.current
    if (!mag || !src) return

    const ctx = mag.getContext('2d')
    const d = SIZE
    mag.width = d
    mag.height = d

    // Source region (canvas pixel coords)
    const srcX = x - radius / zoom
    const srcY = y - radius / zoom
    const srcW = (radius * 2) / zoom
    const srcH = (radius * 2) / zoom

    ctx.clearRect(0, 0, d, d)

    // Clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(d / 2, d / 2, d / 2 - 1, 0, Math.PI * 2)
    ctx.clip()

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(src, srcX, srcY, srcW, srcH, 0, 0, d, d)

    // Centre crosshair
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.lineWidth = 1
    const c = d / 2
    ctx.beginPath()
    ctx.moveTo(c - 6, c); ctx.lineTo(c + 6, c)
    ctx.moveTo(c, c - 6); ctx.lineTo(c, c + 6)
    ctx.stroke()

    ctx.restore()

    // Border ring
    ctx.beginPath()
    ctx.arc(d / 2, d / 2, d / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = '#111111'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [canvasRef, x, y, radius, zoom])

  // Position magnifier offset from cursor so it doesn't cover the point
  const offset = SIZE / 2 + 16
  const srcRect = canvasRef.current?.getBoundingClientRect()
  const canvasEl = canvasRef.current
  if (!srcRect || !canvasEl) return null

  const scaleX = srcRect.width / canvasEl.width
  const scaleY = srcRect.height / canvasEl.height
  const dispX = x * scaleX
  const dispY = y * scaleY

  // Keep inside the canvas element
  let left = dispX + offset
  let top = dispY - SIZE / 2
  if (left + SIZE > srcRect.width) left = dispX - offset - SIZE
  if (top < 0) top = 0
  if (top + SIZE > srcRect.height) top = srcRect.height - SIZE

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
