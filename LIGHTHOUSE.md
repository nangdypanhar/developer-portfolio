# Lighthouse: before / after

Production build (`npm run build && npm run preview`), Lighthouse 13.5, mobile emulation
(Moto G Power, slow 4G, 4× CPU throttle), page `/login`, the only page reachable without signing in.
Full reports: [`lighthouse/before-login.html`](lighthouse/before-login.html) · [`lighthouse/after-login.html`](lighthouse/after-login.html)

| Category       | Before | After |
| -------------- | -----: | ----: |
| Performance    |     98 |    97 |
| Accessibility  |     97 |   100 |
| Best Practices |    100 |   100 |
| SEO            |     82 |   100 |

Performance is within run-to-run noise (FCP 1.9 s both times).

## What was fixed

| Lighthouse finding              | Fix                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| No `<main>` landmark (a11y)     | Page content wrapped in `<main>`; each page now has one `<h1>`                        |
| No meta description (SEO)       | `<meta name="description">` in `index.html`                                          |
| `robots.txt` invalid (SEO)      | The SPA was returning `index.html` for `/robots.txt`; added a real `public/robots.txt` |
| Unused JavaScript               | Habits page lazy-loaded (`React.lazy`), so `/login` doesn't download it              |

## Mobile-first pass

Checked with device emulation at iPhone SE (375), Galaxy Fold (320), Pixel 5 (393), iPad Mini (768), desktop (1280).

| Width | Before                              | After                |
| ----- | ----------------------------------- | -------------------- |
| 320   | horizontal scroll (page 443 px wide) | none                 |
| 375   | horizontal scroll (page 443 px wide) | none                 |
| 393   | horizontal scroll (page 443 px wide) | none                 |
| 768   | none                                | none                 |
| 1280  | none                                | none                 |

Cause: the nav printed the full email plus "Sign out" with no way to shrink. Fixed with
`min-w-0` + `truncate`. Habit cards use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, stats use
`grid-cols-1 sm:grid-cols-3`, and inputs/buttons got `min-w-0` / `shrink-0` so they never
force the row wider than the screen. Screenshots: `screenshots/16`–`21`.
