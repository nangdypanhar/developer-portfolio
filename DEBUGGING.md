# Debugging Journal — Product Catalog

Three bugs were deliberately planted in the fully-typed product catalog (`src/components/products/`,
`src/lib/`, `src/types/`, `public/products.json`), one per required pattern, then found and fixed
using the tool that actually matches the failure mode. Each bug was verified to reproduce for real
before being fixed, and the fix was verified to restore the file to its original state.

## Bug 1 — Crash: `.map()` on `null` state

**Plant.** `ProductCatalog` fetches product data asynchronously, so `products` starts out `null`
until the request resolves. To force a crash despite `useState<Product[] | null>(null)` and the
`if (!products) return <Loading />` guard, the state was redeclared as
`useState<Product[]>(null as unknown as Product[])` — lying to the compiler with a type
assertion — and the guard was deleted. With `inStockOnly` false by default,
`visibleProducts.map(toPublicProduct)` ran directly on `null`.

**Symptom.** The page renders a blank screen with Vite's red error overlay:
`TypeError: Cannot read properties of null (reading 'map')`.

**Tool: breakpoint (DevTools → Sources).** Because the type assertion hides the null risk from
`tsc` (`npx tsc --noEmit` stayed clean the entire time the bug was live — confirmed), this bug is
invisible to the type checker and can only be caught at runtime. Opening DevTools → Sources,
locating `ProductCatalog.tsx` via the source map, and setting a breakpoint on the
`visibleProducts.map(...)` line (or just enabling "Pause on exceptions") stops execution at the
crash site. The Scope panel shows `products: null` immediately — no guessing about *which* state
was null or *when*.

**What it showed.** `products` was still `null` at the moment of the first render, because the
type assertion had removed the compiler's ability to warn that the value could be missing, and the
guard that normally handles that case had been deleted.

**Fix.** Restored `useState<Product[] | null>(null)` (the honest type) and restored the
`if (!products) return <p>Loading products…</p>` guard before any array method touches `products`.
`npx tsc --noEmit` now catches this class of bug *before* runtime — with the real type restored,
deleting the guard again immediately produces `error TS18047: 'products' is possibly 'null'.`,
which was confirmed by temporarily re-removing it.

## Bug 2 — Silent wrong value: a data-key typo the type system can't see

**Plant.** `fetchProducts()` does `(await response.json()) as Product[]` — a type assertion, not a
runtime validation. In `public/products.json`, the first product's `"onSale": true` was renamed to
`"onSael": true`.

**Symptom.** Nothing crashes. The page loads normally. The red "N on sale" counter simply reads
**1** instead of the expected **2** (Mechanical Keyboard + USB-C Dock are both on sale in the seed
data). Reproduced directly:
```
onSaleCount computed: 1 (expected 2: Mechanical Keyboard + USB-C Dock)
p1 onSale value: undefined <- should be true
```

**Tool: React DevTools (Components panel).** `tsc --noEmit` stayed clean the entire time this bug
was live, because `as Product[]` tells the compiler to trust the shape of whatever JSON comes back
— it performs no runtime check. Selecting `ProductCatalog` in the React DevTools Components tree
and inspecting its `products` state directly shows the first entry with `onSale: undefined`
instead of `true`, which immediately points at the data, not the component logic.

**What it showed.** The bug wasn't in any `.tsx` file at all — every component and the derived-type
plumbing (`Omit`, `Partial`) were correct. The mismatch was a single misspelled key in a static
JSON file, which no amount of TypeScript on the *code* can catch, because TypeScript never
validates data it didn't produce.

**Fix.** Corrected `"onSael"` back to `"onSale"` in `public/products.json`. Re-ran the same
reproduction: `onSaleCount computed: 2`, `p1 onSale value: true`.

## Bug 3 — Network failure: a mistyped URL

**Plant.** `fetchProducts.ts`'s `PRODUCTS_URL` was changed from `/products.json` to `/product.json`
(missing the "s").

**Symptom.** The catalog never loads; the page shows the red "Could not load products: …" error
box.

**Tool: Network tab.** This is the one case where the status code alone is misleading: Vite's dev
server serves its SPA history fallback (`index.html`, status `200`) for *any* unmatched path, so
the request to `/product.json` does not show up red. Reproduced directly against the running dev
server:
```
status: 200 true
content-type: text/html
json parse error: Unexpected token '<', "<!doctype "... is not valid JSON
```
Opening the Network tab and clicking the `/product.json` request's **Preview**/**Response** tab
shows an HTML document instead of JSON — that mismatch is what actually exposes the mistyped path,
not the status code.

**What it showed.** The exact wrong URL as it went out over the wire, and the exact wrong payload
that came back — evidence a stack trace alone doesn't carry, since the console only reports a
generic `SyntaxError: Unexpected token '<'` with no indication of *which* request produced it.

**Fix.** Corrected `PRODUCTS_URL` back to `/products.json`. Re-ran `curl`, confirmed `200` with a
real JSON body, and confirmed the app loads the catalog again.

## Summary

| Bug | Pattern | Tool | Console alone? |
|---|---|---|---|
| 1 | Crash | Breakpoint (Sources) | Shows the error message but not *why* `products` was null at that moment — the breakpoint's Scope panel is what proves it. |
| 2 | Silent wrong value | React DevTools | Throws nothing at all — there is no console message to alert you; only inspecting live component state reveals the mismatch. |
| 3 | Network failure | Network tab | The console only shows a generic JSON parse error with no request context — the Network tab is what shows *which* URL was hit and *what* actually came back. |

**Q: One sentence — which tool caught which bug, and why wasn't the console alone enough?**

A: I used a breakpoint to catch the crash, React DevTools to catch the silent typo, and the
Network tab to catch the bad URL — the console alone couldn't show me *where* each problem
actually came from.
