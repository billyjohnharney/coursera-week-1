# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

**Name:** Photo Colour Picker  
**Purpose:** A personal web app for a colour-blind photographer to identify exact and descriptive colours in photos.  
**Stack:** Vite + React 19 + Base UI (`@base-ui/react`) + CSS Modules

## Repository Structure

```
coursera-week-1/
├── index.html                    # Vite entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                  # React root, mounts App
│   ├── index.css                 # Global reset and CSS custom properties (palette, font)
│   ├── App.jsx                   # Root layout: ResultBar (top) / ImageCanvas (middle) / ControlBar (bottom)
│   ├── App.module.css
│   ├── colourUtils.js            # Pure colour functions (no React)
│   └── components/
│       ├── LoadScreen.jsx        # Landing: choose file, camera capture, URL input, drag-drop, paste
│       ├── LoadScreen.module.css
│       ├── ResultBar.jsx         # Top bar: colour swatch bg + name + formatted value + copy button
│       ├── ResultBar.module.css
│       ├── ImageCanvas.jsx       # Canvas renderer + pixel/area picking + magnifier + highlight box
│       ├── ImageCanvas.module.css
│       ├── Magnifier.jsx         # Zoomed lens overlay (desktop/mouse only)
│       ├── Magnifier.module.css
│       ├── ControlBar.jsx        # Bottom bar: pixel area size toggle + colour unit toggle
│       └── ControlBar.module.css
└── dist/                         # Built output (gitignored)
```

## UI Layout

```
┌──────────────────────────────────┐
│  ResultBar  (swatch bg + name + value + copy)  │  ← top
├──────────────────────────────────┤
│                                  │
│          ImageCanvas             │  ← fills middle, touch + mouse
│                                  │
├──────────────────────────────────┤
│  ControlBar  [1px][3×3][5×5]…  [Hex][RGB][HSL]  │  ← bottom (thumb zone)
└──────────────────────────────────┘
```

## Key Conventions

### Styling
- **CSS Modules** for all component styles (`.module.css` co-located with component)
- **Global CSS custom properties** in `src/index.css` under `:root`:
  - `--color-bg`, `--color-surface`, `--color-border`, `--color-border-strong`
  - `--color-text`, `--color-text-muted`, `--color-accent`
  - `--radius`, `--font`
- Black/white palette — the UI chrome is achromatic; only the ResultBar background shows colour
- `env(safe-area-inset-bottom)` used in ControlBar for iPhone notch/home-indicator clearance

### Base UI usage (`@base-ui/react`)
- `ToggleGroup` + `Toggle` — pixel area size selector and colour unit selector (ControlBar)
- `Tooltip` — copy button feedback (ResultBar)
- All Base UI components are headless; visual styles provided via CSS Modules
- Active state styled via `[data-pressed]` attribute on `Toggle`

### Colour logic (`colourUtils.js`)
All pure functions, no side effects, no React:
- `samplePixel(imageData, x, y)` — single pixel RGB
- `sampleRegion(imageData, x1, y1, x2, y2)` — averaged RGB across a rectangle
- `rgbToHsl(r, g, b)` → `{ h, s, l }`
- `rgbToHex(r, g, b)` → `#rrggbb`
- `getColourName(r, g, b)` → human-readable string e.g. "Dark Muted Green"

### ImageCanvas
- Canvas sized to fit container while preserving aspect ratio
- `imageDataRef` holds raw `ImageData` — avoids repeated `getImageData` calls
- Mouse events: live preview on `mousemove`, locked on `click`
- Touch events: `touchend` picks colour (no magnifier on touch)
- `pixelSize` prop (from ControlBar): 1 = single pixel, N = N×N centred area average
- Highlight box (white outline with dark shadow) marks the last picked area

### ResultBar
- Background transitions to the picked colour
- Text colour auto-switches black/white for contrast (WCAG luminance formula)
- Formats the value according to selected `unit`: `hex` / `rgb` / `hsl`

### LoadScreen — image sources
1. **File picker** — `<input type="file" accept="image/*">`
2. **Camera capture** — `<input type="file" accept="image/*" capture="environment">`
3. **URL** — probed with a temporary `Image` object (`crossOrigin="anonymous"`)
4. **Drag-and-drop** — `onDrop` on the screen container
5. **Clipboard paste** — `onPaste` reads `clipboardData.items`

## Development Workflow

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve dist/ locally
```

## Git Workflow

- **Development branch:** `claude/add-claude-documentation-0gn4D`
- **Main branch:** `master`
- Always develop on the designated feature branch; never push to `master` without explicit instruction
- Use `git push -u origin <branch-name>` when pushing
