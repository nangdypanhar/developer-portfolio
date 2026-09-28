# Performance pass

Numbers from `npm run build` (Vite 8.3, production).

## Before / after

| File                                   |    Before |     After |
| -------------------------------------- | --------: | --------: |
| `geist-latin-wght-normal.woff2`        |  29.40 kB |  29.40 kB |
| `geist-latin-ext-wght-normal.woff2`    |  16.51 kB |   removed |
| `geist-cyrillic-wght-normal.woff2`     |  15.08 kB |   removed |
| `geist-vietnamese-wght-normal.woff2`   |   8.00 kB |   removed |
| `geist-cyrillic-ext-wght-normal.woff2` |   7.42 kB |   removed |
| `index.css` (gzip)                     |  39.68 kB (8.26) |  38.51 kB (7.94) |
| `Habits.js` (lazy chunk, gzip)         |  14.45 kB (4.61) |  14.47 kB (4.62) |
| `index.js` (main chunk, gzip)          | 485.68 kB (140.68) | 485.68 kB (140.69) |
| **Service-worker precache**            | **24 entries, 647.75 KiB** | **20 entries, 600.71 KiB** |

Result: 4 font files and **47 KiB less** for every user to download and precache.

## What changed

1. **Dependency dropped: `@fontsource-variable/geist`.** The package shipped five font
   subsets (Latin, Latin-ext, Cyrillic, Cyrillic-ext, Vietnamese), and the PWA precached all of
   them. The UI is English-only, so I self-host just the Latin file
   (`src/assets/fonts/geist-latin-wght-normal.woff2`) with one hand-written `@font-face` in
   `src/index.css`. The font looks the same.
2. **`React.lazy` + `Suspense` on the heaviest route.** `/habits` (tracker, stats, avatar
   upload, offline queue) is its own 14 kB chunk (`src/App.jsx`), so `/login` never downloads it.
3. **Images.** The avatar `<img>` now has `width={64} height={64}`, so the browser reserves
   its space before it loads (no layout shift). It is **not** `loading="lazy"`: it sits at the
   top of the page, and lazy-loading an above-the-fold image delays it. The app has no
   below-the-fold images.

## Why the main chunk didn't shrink

A sourcemap breakdown of `index.js` shows it is almost all framework code the app needs on
every page: `react-dom`, `react-router` and `@supabase/supabase-js` (auth, database, storage).
`cn`, `radix-ui` and `lucide-react` are in `package.json`, but no routed page imports them, so
tree-shaking already keeps them out of the bundle. Removing them would not change any size.
