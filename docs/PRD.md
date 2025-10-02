# Product Requirements Doc (PRD) — PlayHub (Working Title)

## 1. Summary
A fast, mobile-first website that hosts a **hub of short games**—from **daily, seed-based puzzles** (Wordle-style) to **group/party games** you can play together on one screen or phones. Focus on instant load, simple controls, and a consistent game shell (timer, score, share, replay).

**North Star metric:** 7-day repeat rate for daily players.
**Secondary:** Avg. sessions/user/week, median LCP < 2.5s.

---

## 2. Audience & Use Cases
- **Daily snackers:** 1–3 minute puzzles (on commute/break).
- **Friends & roommates:** light party games for 2–8 people.
- **Classroom/club leaders:** quick brain teasers to start meetings.

**Top user stories**
- “As a casual player, I want a new **daily puzzle** that’s the same for everyone so I can compare scores.”
- “As a host, I want a **group game** that works on one laptop/TV so people can jump in quickly.”
- “As a returning player, I want to **find a game fast** by category and remember my recent plays.”

---

## 3. Problem & Value
- **Problem:** Good web games are scattered, slow, or ad-heavy; daily puzzles are siloed per site.
- **Value:** A clean, fast **hub** with consistent UX, daily ritual, and lightweight social comparison (share strings/leaderboards).

---

## 4. Scope (MVP)
**In (must have):**
- Landing page with **search/filter** across **game categories**.
- **Uniform GameFrame** (timer/score/replay/share) every game uses.
- **Daily seed** system (`YYYY-MM-DD`) for daily game modes.
- **Local leaderboard** (per game) + “copy/share result”.
- **Mobile-first** design, a11y basics (keyboard nav, focus states).
- Lightweight analytics: `page_view`, `game_start`, `game_complete`, `share_click`, `replay`.

**Out (not in MVP):**
- Accounts, sync across devices, multiplayer netcode.
- Ads or payments.
- User-generated games or submissions.

---

## 5. Game Taxonomy (initial catalog)
- **Daily Puzzles:** word (anagram/guess), number (arithmetic/logic), path/tiling.
- **Solo Arcade:** reaction, aim/tap timing, memory.
- **Group/Party (local):** prompt & guess, draw & guess, bluffing/trivia (hot-seat or phone as controller—MVP uses single shared screen).

**Policies:**
- Session length target: **60–120s**.
- Performance budget: initial page JS **≤ 150KB**, per-game **≤ 80KB** (gzipped).
- Inputs: **touch + keyboard**; accessible color contrast.

---

## 6. Success Metrics (first 30 days)
- **DAU:** 100+  
- **7-day repeat:** ≥ 35% of daily players return within a week  
- **LCP:** < 2.5s p75 on mobile 4G emulation  
- **Bounce rate:** < 40% on landing  
- **Share rate (daily modes):** ≥ 8%

---

## 7. Experience Principles
- **Instant & obvious:** no tutorials required; core loop visible in 3 seconds.
- **One-tap replay:** frictionless iteration drives stickiness.
- **Consistent shell:** same layout & controls across all games.
- **Quiet by default:** no popups, no interstitials, minimal chrome.

---

## 8. Information Architecture
- **Home:** Featured, “Daily Today”, categories (Word • Number • Logic • Party), search.
- **Game page:** Header (title/tagline), GameFrame (timer/score), controls, share string, local leaderboard.
- **About/Privacy:** plain language, what’s tracked (anonymous events).

---

## 9. Technical Guardrails
- SPA/ISR site with static assets via CDN; **serverless stub** for future global scores.
- **Daily seed** utility shared by all daily-capable games.
- **Game SDK** (thin): init(start/stop), score update callback, remaining time provider.
- Asset licensing tracked (`/CREDITS.md`).

---

## 10. Risks & Mitigations
- **Performance creep** as catalog grows → enforce per-PR perf budget & bundle analyzer.
- **Asset/IP risks** → only original or properly licensed fonts/sfx; keep proofs.
- **Scope creep** into accounts/multiplayer → stick to local/solo + shared-screen for MVP.
- **Fragmented UX** if games differ too much → GameFrame enforced across all.

---

## 11. Milestones
- **M0 – PRD/Design (Today):** finalize PRD, define categories & acceptance criteria.
- **M1 – Skeleton (Week 1):** landing grid, GameFrame, daily seed util, local leaderboard, analytics events.
- **M2 – Content Pass (Week 2):** 3–5 placeholder tiles + 1 daily mode + 1 party (local) mode ready for internal test.
- **M3 – Alpha (End Week 2):** closed test with 10–20 users; collect feedback; adjust taxonomy and shell.

---

## 12. Acceptance Criteria
- From tap on a game card → **first interaction < 2s** on a mid-range phone.
- **Daily mode** renders identical puzzle given same date on any device.
- **Local leaderboard** persists top 20 scores per game in the browser.
- All interactive elements have **visible focus** and **ARIA labels** where appropriate.
- Share string includes **game name, score, date**, and a short URL.

---

## 13. Open Questions
1. **Name & brand**: pick a working title and color system.
2. **Daily cadence**: one universal “Daily” per day across the site, or daily per game?
3. **Party input model**: MVP = shared screen only, or allow “join with code” later?
4. **Analytics vendor**: Plausible vs PostHog (privacy stance).
5. **Initial categories**: which 4–6 go live first?
