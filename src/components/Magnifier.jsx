import React, { useEffect, useRef } from 'react'
import styles from './Magnifier.module.css'

const SIZE   = 120  // diameter px
const SRC_R  = 14   // radius of source region in canvas pixels (before zoom)

export default function Magnifier({ canvasRef, x, y, zoom }) {
  const magRef = useRef(null)

  useEffect(() => {
    const mag = magRef.current
    const src = canvasRef.current
    if (!mag || !src) return

    const ctx = mag.getContext('2d')
    const d   = SIZE
    mag.width  = d
    mag.height = d

    ctx.clearRect(0, 0, d, d)

    // Clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(d / 2, d / 2, d / 2 - 1, 0, Math.PI * 2)
    ctx.clip()

    ctx.imageSmoothingEnabled = false
    const srcSize = SRC_R * 2
    ctx.drawImage(src, x - SRC_R, y - SRC_R, srcSize, srcSize, 0, 0, d, d)

    // Centre crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'
    ctx.lineWidth = 1
    const c = d / 2
    ctx.beginPath()
    ctx.moveTo(c - 7, c); ctx.lineTo(c + 7, c)
    ctx.moveTo(c, c - 7); ctx.lineTo(c, c + 7)
    ctx.stroke()

    ctx.restore()

    // Outer ring
    ctx.beginPath()
    ctx.arc(d / 2, d / 2, d / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = '#111111'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [canvasRef, x, y, zoom])

  // Position offset from cursor so it doesn't obscure the pick point
  const canvasEl = canvasRef.current
  if (!canvasEl) return null

  const rect   = canvasEl.getBoundingClientRect()
  const scaleX = rect.width  / canvasEl.width
  const scaleY = rect.height / canvasEl.height
  const dispX  = x * scaleX
  const dispY  = y * scaleY
  const offset = SIZE / 2 + 18

  let left = dispX + offset
  let top  = dispY - SIZE / 2
  if (left + SIZE > rect.width)  left = dispX - offset - SIZE
  if (top < 0)                   top  = 0
  if (top + SIZE > rect.height)  top  = rect.height - SIZE

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
