# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

**Name:** Photo Colour Picker  
**Purpose:** A personal web app for a colour-blind photographer to identify exact and descriptive colours in photos.  
**Stack:** Vite + React 19 + Base UI (`@base-ui/react`) + CSS Modules

## Repository Structure

```
coursera-week-1/
├── index.html                  # Vite entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                # React root, mounts App
│   ├── index.css               # Global reset and CSS custom properties (palette, font)
│   ├── App.jsx                 # Root layout: header, mode toggle, workspace
│   ├── App.module.css
│   ├── colourUtils.js          # Pure colour functions: rgbToHex, rgbToHsl, getColourName, samplePixel, sampleRegion
│   └── components/
│       ├── DropZone.jsx        # Image loader: drag-drop, file picker, clipboard paste
│       ├── DropZone.module.css
│       ├── ImageCanvas.jsx     # Canvas renderer + pixel/area picking + magnifier host
│       ├── ImageCanvas.module.css
│       ├── ColourPanel.jsx     # Sidebar: swatch, name, hex/RGB/HSL, copy buttons
│       ├── ColourPanel.module.css
│       ├── Magnifier.jsx       # Zoomed lens drawn on a secondary canvas, overlaid on ImageCanvas
│       └── Magnifier.module.css
└── dist/                       # Built output (gitignored)
```

## Key Conventions

### Styling
- **CSS Modules** for all component styles (`.module.css` co-located with component)
- **Global CSS custom properties** defined in `src/index.css` under `:root` — use these everywhere:
  - `--color-bg`, `--color-surface`, `--color-border`, `--color-border-strong`
  - `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`
  - `--radius`, `--font`
- Black/white palette — do not introduce colour into the chrome; only the picked colour swatch shows colour
- System font stack via `--font` — do not add web fonts

### Base UI usage
- Use `@base-ui/react` for interactive primitives: `Tooltip`, `ToggleGroup`, `Toggle`, etc.
- Base UI is headless — all visual styles must be provided via CSS Modules
- Base UI components expose `data-*` state attributes (e.g. `data-pressed`, `data-open`) for styling

### Colour logic (`colourUtils.js`)
- All pure functions, no side effects, no React imports
- `samplePixel(imageData, x, y)` — single pixel RGBA from a canvas ImageData
- `sampleRegion(imageData, x1, y1, x2, y2)` — averaged RGBA across a rectangle
- `rgbToHsl(r, g, b)` — returns `{ h, s, l }` in degrees/percent
- `rgbToHex(r, g, b)` — returns `#rrggbb` string
- `getColourName(r, g, b)` — returns a human-readable name like "Dark Muted Green"

### Canvas / ImageCanvas
- One `<canvas>` element is sized to fit its container while preserving aspect ratio
- `imageDataRef` holds the raw `ImageData` for fast pixel reads (avoids repeated `getImageData` calls)
- Mouse coords are converted from CSS pixels to canvas pixels via `toCanvasCoords()` (accounts for CSS scaling)
- Pixel mode: updates colour on every `mousemove`, locks on click
- Area mode: drag to select rectangle, releases on `mouseup`

### No test suite yet
- Add tests under `src/__tests__/` when needed; prefer unit tests for `colourUtils.js`

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
- Write clear, descriptive commit messages
