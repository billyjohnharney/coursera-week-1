// Converts RGB to HSL. Returns { h: 0-360, s: 0-100, l: 0-100 }
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Converts RGB to hex string e.g. #ff6a3c
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

// Named colour database — hue ranges mapped to base names,
// then refined by saturation and lightness.
const HUE_NAMES = [
  [15,  'Red'],
  [30,  'Orange'],
  [50,  'Yellow'],
  [80,  'Yellow-Green'],
  [150, 'Green'],
  [170, 'Teal'],
  [200, 'Cyan'],
  [250, 'Blue'],
  [280, 'Indigo'],
  [320, 'Purple'],
  [345, 'Pink'],
  [360, 'Red'],
]

function getHueName(h) {
  for (const [limit, name] of HUE_NAMES) {
    if (h <= limit) return name
  }
  return 'Red'
}

// Returns a human-readable colour name from RGB values.
// e.g. "Dark Muted Green", "Light Vivid Blue", "Near-White"
export function getColourName(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b)

  // Achromatic
  if (l <= 5)  return 'Black'
  if (l >= 95) return 'White'
  if (s <= 8) {
    if (l <= 20) return 'Near-Black'
    if (l <= 40) return 'Dark Grey'
    if (l <= 60) return 'Grey'
    if (l <= 80) return 'Light Grey'
    return 'Near-White'
  }

  const hueName = getHueName(h)
  const lightness = l <= 20 ? 'Very Dark' : l <= 38 ? 'Dark' : l >= 80 ? 'Very Light' : l >= 62 ? 'Light' : ''
  const saturation = s <= 25 ? 'Muted' : s >= 80 ? 'Vivid' : ''

  return [lightness, saturation, hueName].filter(Boolean).join(' ')
}

// Reads average RGBA from a rectangular region of a canvas ImageData
export function sampleRegion(imageData, x1, y1, x2, y2) {
  const minX = Math.max(0, Math.min(x1, x2))
  const maxX = Math.min(imageData.width - 1, Math.max(x1, x2))
  const minY = Math.max(0, Math.min(y1, y2))
  const maxY = Math.min(imageData.height - 1, Math.max(y1, y2))

  let rSum = 0, gSum = 0, bSum = 0, count = 0
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = (y * imageData.width + x) * 4
      rSum += imageData.data[i]
      gSum += imageData.data[i + 1]
      bSum += imageData.data[i + 2]
      count++
    }
  }
  if (count === 0) return null
  return {
    r: Math.round(rSum / count),
    g: Math.round(gSum / count),
    b: Math.round(bSum / count),
  }
}

// Reads single pixel RGBA from canvas ImageData
export function samplePixel(imageData, x, y) {
  const i = (Math.floor(y) * imageData.width + Math.floor(x)) * 4
  return {
    r: imageData.data[i],
    g: imageData.data[i + 1],
    b: imageData.data[i + 2],
  }
}
