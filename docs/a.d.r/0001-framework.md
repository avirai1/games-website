# ADR 0001 — Frontend Framework

**Decision:** Use Vite + React + TypeScript (SPA), TailwindCSS, TanStack Router.

**Context:** Site is a hub for short games (daily + group/party). SEO is secondary; performance and fast iteration are primary. Most logic runs client-side; initial deploys will be static. We may add serverless APIs later for global leaderboards.

**Options considered:**
- Vite + React + TS (SPA)
- Next.js (App Router)
- SvelteKit
- Astro (islands)

**Pros (chosen):**
- Tiny baseline JS and instant HMR (fast iteration).
- Simple static hosting (Netlify/Vercel/GitHub Pages).
- React ecosystem for UI components and examples.

**Cons:**
- No built-in SSR/ISR (acceptable for MVP).
- Need to add a router and API functions manually.

**Guardrails:**
- Enforce bundle budgets (`size-limit`, Rollup visualizer).
- Game “islands” lazy-loaded by route.
- Keep initial JS under 150 KB gz; per-game under 80 KB gz.

**Revisit if:** We need SSR/SEO for content, complex auth, or heavy server rendering.
