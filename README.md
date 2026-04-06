# Caffrey's Colour

A PWA for photographers to identify exact colours in any photo — built to assist with colour blindness.

## Features

- **Tap** a pixel or **hold and drag** to scan continuously as your finger moves
- **Area sampling** — 1px up to 20×20 pixel average
- **Five colour formats** — Hex, RGB, CMYK, Name (human description), HSL
- **Result bar** fills with the picked colour, auto-contrasting text
- **Magnifier lens** — appears above finger on touch, beside cursor on mouse
- **Load photos** from device, camera, URL, drag-and-drop, or clipboard paste
- **PWA** — install to home screen, works offline after first load

## App icon

Black rounded square with white serif "CC" logotype, generated in all required sizes from `public/icon.svg`.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Base UI](https://base-ui.com/) (`@base-ui/react`) — Tooltip, ToggleGroup
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — service worker, manifest, offline support
- CSS Modules — black/white palette, system font

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Regenerate icons

If you update `public/icon.svg`, regenerate all PNG sizes:

```bash
npx pwa-assets-generator --preset minimal-2023 public/icon.svg
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the built app locally
```
