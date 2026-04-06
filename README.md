# Photo Colour Picker

A web app for photographers to identify exact and descriptive colours in any photo — built to assist with colour blindness.

## Features

- **Pixel mode** — hover to preview, click to lock a colour
- **Area average mode** — click-drag a region to sample its average colour
- **Magnifier lens** — zoomed-in view follows the cursor for precise pixel targeting
- **Colour info panel** — shows hex, RGB, HSL values and a human-readable colour name (e.g. "Dark Muted Green")
- **Copy to clipboard** — one-click copy of hex or RGB values
- **Drag-and-drop, file picker, or clipboard paste** to load photos

## Tech stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Base UI](https://base-ui.com/) (`@base-ui/react`) — headless accessible components (Tooltip, ToggleGroup)
- CSS Modules — black/white palette, system font, no external CSS framework

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the built app locally
```
