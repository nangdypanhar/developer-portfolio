# Developer Portfolio

A personal developer portfolio built with Vite and React. This is the starting point of the
project — a hand-coded profile page covering JSX fundamentals (single parent element,
`className`, closed tags, and dynamic expressions) plus a `StatusBadge` component that reflects
availability with a ternary.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser. Edit `src/App.jsx` and save to see HMR update
the page instantly.

## Mobile app (Expo)

`mobile/` is the same habit tracker as an Expo app (iOS, Android and web). It reuses the web
app's habit queries and types (`src/lib/habits.ts`, `src/types/habit.ts`) instead of copying
them. Only the Supabase client differs: Metro picks `src/lib/supabase.expo.ts`, Vite picks
`src/lib/supabase.ts`.

```bash
cd mobile
npm install
cp .env.example .env.local   # same Supabase URL and anon key as the web app
npx expo start               # scan the QR code with Expo Go, or press a / w
```
