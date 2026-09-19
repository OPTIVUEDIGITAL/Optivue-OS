# PROMPT — Mobile experience rebuild (phones only)

Save as `docs/passes/p3-mobile.md`. Paste the whole thing into Claude Code.

---

## CONTEXT

Repo: `OPTIVUEDIGITAL/Optivue-OS` · Static HTML + CSS + ES modules · no framework, no build step
Deploy: Cloudflare Workers serving `production/` via `wrangler.jsonc`
Governing spec: `docs/design-direction.md` — read it first
Existing breakpoints: `1050px`, `760px`

---

## THE ONE RULE THAT OVERRIDES EVERYTHING

**Desktop and tablet must come out byte-identical in behaviour.**

- Every CSS change goes inside `@media (max-width: 760px)`.
- Every JS change is guarded by `window.matchMedia('(max-width: 760px)').matches`.
- No edits to base rules, no edits to the `1050px` block.
- The hero canvas, the sticky work inspector, and all desktop animation stay exactly as they are.

**Verification:** the diff must contain zero changes outside mobile-scoped blocks. If a change cannot be scoped to mobile, stop and ask.

---

## THE PROBLEM

There is currently no mobile design — only a mobile collapse. Below 760px nearly every grid receives the same rule:

```css
.ovgo-problem-grid, .ovgo-stage-grid, .ovgo-transform-grid,
.ovgo-pricing-grid, .ovgo-compare-grid, .ovgo-work-layout,
.ovgo-transform-detail, .ovgo-tool-grid, .ovgo-choice-grid,
.ovgo-lead-grid { grid-template-columns: 1fr }

```

Result: a phone user scrolls through roughly **21 consecutive full-width cards** — 6 stage tiles, 3 case cards, 4 work items, 3 pricing cards, plus problem and comparison blocks. Every one was designed to be read beside its siblings. Alone in a column, none of them has a job.

**Four specific defects to fix:**

1. `.ovgo-filter-row button { padding: 8px 11px; font: 500 10px }` → \~29px tall. Minimum is 44.
2. `.ovgo-work-inspector { position: static }` on mobile — tapping a work item updates a panel that may be entirely off-screen. The tap appears to do nothing.
3. `.ovgo-hero__footer { display: none }` — content deleted rather than adapted.
4. No CTA exists anywhere except the header. On a page this long, a phone user is never near a booking button.

**Already correct — do not "fix":** `100svh` usage, `prefers-reduced-motion` block, viewport tag without `user-scalable=no`.

---

## CORRECTED iOS GUIDANCE

Some widely-repeated advice does not apply here. Do not implement the following:

| Do NOT build Why                   |                                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Custom swipe-to-go-back handlers   | Edge-swipe-back is native to Safari. Custom horizontal swipe handlers are the main way sites **break** it. |
| Apple Pay / FaceID / TouchID hooks | No payments, no login on this site.                                                                        |
| Native date pickers                | No date fields.                                                                                            |
| Flash / plugin fallbacks           | Irrelevant.                                                                                                |
| "Dynamic Type" CSS                 | iOS Safari does not expose Dynamic Type to web pages the way native apps receive it.                       |

**What is real and must be done:**

- **44 × 44 CSS px minimum** on every tappable control, with ≥8px gap between adjacent targets.
- **16px minimum font-size on all form inputs.** Below 16px, iOS Safari auto-zooms on focus and the layout jumps.
- **`-webkit-text-size-adjust: 100%`**, and never add `user-scalable=no`.
- **`env(safe-area-inset-bottom)`** on anything fixed to the bottom, or it sits under the Safari toolbar.
- **Use** **`dvh`****/****`svh`****, never** **`vh`**, for anything full-height.
- **Never override inertia scrolling.** No scroll-jacking, no `overflow: hidden` on `body` except while a modal is open.

---

## DECISION 1 — BOTTOM STICKY CTA BAR (not a tab nav)

A 4-tab bottom nav is wrong here: it implies separate destinations that don't exist on a one-page site, it duplicates the existing hamburger menu, and it permanently consumes \~64px of a small screen.

Build a **single-button sticky bar**.

```css
@media (max-width: 760px) {
  .ovgo-mobile-cta {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    z-index: 60;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: color-mix(in srgb, var(--ovgo-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--ovgo-border);
    transform: translateY(110%);
    transition: transform .28s cubic-bezier(.22,.61,.36,1);
  }
  .ovgo-mobile-cta.is-visible { transform: translateY(0); }
  .ovgo-mobile-cta a { display: flex; align-items: center; justify-content: center; min-height: 48px; }
  body { padding-bottom: 76px; }
}

```

**Behaviour**

- Hidden at page load. Revealed via `IntersectionObserver` once the hero has scrolled out of view.
- Hidden again while the Calendly modal, the mobile menu, or any form is open.
- Never rendered above 760px. Guard the JS with `matchMedia`.
- This is the only element permitted to use `backdrop-filter` on the page.

**Which button:** `Book a discovery call` → the existing Calendly modal.

> **Why not the free audit:** the audit form currently discards everything it collects (`leadSubmissionEnabled: false`, `leadEndpoint: ''`). Driving mobile traffic into it would widen an existing leak. **Once the lead endpoint is live, switch this button to the audit** — it's the lower-friction ask and it qualifies the visitor. Flag this in the PR description.

---

## DECISION 2 — FOUR DIFFERENT TREATMENTS, NOT ONE

Applying a single mechanic to all 21 cards is how the current problem was created. Match the treatment to the content.

### 2a. Stage tiles (6) → horizontal snap carousel

Peers in a sequence. Swiping communicates progression, and a visible peek of the next card creates the pull to continue.

```css
@media (max-width: 760px) {
  .ovgo-stage-grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 78%;          /* the peek — next card is always partly visible */
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    margin-inline: -16px;
    padding-inline: 16px;
    scroll-padding-inline: 16px;
  }
  .ovgo-stage-grid::-webkit-scrollbar { display: none; }
  .ovgo-stage { scroll-snap-align: start; min-height: 160px; }
}

```

**Use native** **`overflow-x`** **+** **`scroll-snap`****. Do not use a JS carousel library.** Native scrolling leaves Safari's \~20px edge gesture zone intact, so back-swipe keeps working. A JS swipe handler would capture it.

Add a small dot indicator below, driven by `scroll` position. Dots are indicators, not controls — do not make them tappable at under 44px.

### 2b. Case cards (3) → stay stacked, made richer

Only three, and they are your proof. **Never hide proof behind an interaction.** Give each a full-bleed image at the top, then the text. Taller cards, fewer of them, no tap required.

### 2c. Work items (4) → accordion

These are detail-on-demand by nature. The accordion is the honest mobile translation of the desktop inspector, and it fixes defect #2: the detail opens inline, directly under the thing that was tapped, so the tap visibly does something.

- Use `<details>`/`<summary>` or a button with `aria-expanded`.
- Summary row minimum height 56px.
- First item open by default so the pattern is self-evident.
- `scroll-margin-top: 72px` so an opened item isn't hidden behind the header.
- Desktop keeps the sticky inspector untouched.

### 2d. Pricing cards (3) → horizontal snap carousel, featured first

Pricing is inherently a comparison. Stacking destroys it — the user can't hold two tiers in their head across a full screen of scroll. Same snap technique as 2a, `grid-auto-columns: 84%`, featured tier first in DOM order on mobile only.

### 2e. Filter row → keep horizontal scroll, fix the targets

```css
@media (max-width: 760px) {
  .ovgo-filter-row button {
    min-height: 44px;
    padding: 0 14px;
    font-size: 13px;
  }
  .ovgo-filter-row { gap: 8px; }
}

```

---

## DECISION 3 — HERO CANVAS: SIMPLIFY, DO NOT HIDE

Hiding it removes the one premium moment on the page. But a janky animation reads cheap, and a full-density canvas loop is a thermal and battery cost on a phone.

Premium on mobile means *guaranteed smooth*, not *more*.

Inside `optivue-growth-system`, add a mobile branch:

- Reduce node and connection count by roughly half below 760px.
- Slow the motion — fewer, calmer movements read as more expensive than busy ones.
- **Pause the** **`requestAnimationFrame`** **loop when the canvas leaves the viewport** (`IntersectionObserver`) and on `document.visibilitychange`. This is the single biggest battery win and it's invisible to the user.
- Cap `devicePixelRatio` at 2 when setting canvas dimensions.
- Keep the existing `prefers-reduced-motion` handling.

Also restore `.ovgo-hero__footer` in a compact single-line form rather than `display: none`.

---

## ACCEPTANCE CRITERIA

- [ ] Diff contains **zero** changes outside `@media (max-width: 760px)` and `matchMedia`-guarded JS
- [ ] Desktop screenshots at 1440px are visually identical before and after
- [ ] Every tappable control ≥44 × 44 CSS px at 390px, with ≥8px separation
- [ ] Every form input ≥16px font-size (no focus zoom)
- [ ] Zero horizontal page overflow at 390px (carousels scroll internally only)
- [ ] Edge-swipe-back still works in Safari with a carousel on screen
- [ ] Sticky CTA respects `env(safe-area-inset-bottom)` and hides when any modal is open
- [ ] Tapping a work item produces visible change within the viewport
- [ ] Hero canvas stops animating when scrolled out of view — verify in DevTools performance
- [ ] `prefers-reduced-motion` disables carousel smooth-scroll and canvas motion
- [ ] Lighthouse mobile performance ≥90, accessibility ≥95, CLS <0.05
- [ ] Full keyboard traversal still works (carousels must remain arrow-key scrollable)

---

## VERIFY BEFORE CLAIMING DONE

```bash
npx wrangler dev

npx playwright screenshot --viewport-size=390,844   http://localhost:8787 shots/m-390.png
npx playwright screenshot --viewport-size=430,932   http://localhost:8787 shots/m-430.png
npx playwright screenshot --viewport-size=768,1024  http://localhost:8787 shots/t-768.png
npx playwright screenshot --viewport-size=1440,900  http://localhost:8787 shots/d-1440.png

npx lighthouse http://localhost:8787 --preset=desktop --only-categories=performance
npx lighthouse http://localhost:8787 --only-categories=performance,accessibility

```

Attach all four screenshots to the PR, plus the 1440px before/after pair proving desktop is unchanged.

**Do not write "responsive" without a screenshot. Do not write "improved" without a measurement.** If a criterion fails, say so plainly rather than describing intent as outcome.

**Real-device check the human must do (cannot be automated):** open on an actual iPhone in Safari and confirm — the sticky bar clears the toolbar, back-swipe works while a carousel is on screen, no zoom on tapping a form field, and scrolling feels native.

---

## STOP AND ASK IF

- A change cannot be scoped to mobile without touching base rules
- The carousel approach interferes with edge-swipe-back and cannot be resolved with `overscroll-behavior`
- Any change would alter desktop or tablet output
- You believe another section needs work — list it, do not do it

---

## DO NOT

- Do not add a JS carousel or swipe library
- Do not add a bottom tab nav
- Do not touch `optivue.css` base rules, Calendly routing, pricing figures, or client names
- Do not use `backdrop-filter` anywhere except the sticky CTA bar
- Do not fix anything outside this brief