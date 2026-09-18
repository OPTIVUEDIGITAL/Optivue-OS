# Optivue Growth OS — Design Direction & Build Prompt

> Drop this at `docs/design-direction.md` in `OPTIVUEDIGITAL/Optivue-OS`.
> Paste sections 1–4 as the system/context prompt for any agent working on the site.
> Run passes P0–P7 one at a time. Never run more than one pass per PR.

---

## 0. WHY THIS DOCUMENT EXISTS

Output looks AI-generated because the prompt was under-constrained, not because an AI wrote it.

"Make it beautiful, modern, not AI-generated" produces slop, because those are adjectives and the model resolves adjectives to the statistical average of its training data. The average of every dark SaaS landing page is exactly what we already have.

The fix is not better adjectives. It is:

1. **Explicit prohibition** — a banned-pattern list, checked mechanically.
2. **Explicit evidence requirements** — things that cannot be generated, only sourced.
3. **Measurable acceptance criteria** — pass/fail, not taste.
4. **Verification before completion** — the agent must prove the pass, not assert it.

Everything below exists to serve those four.

---

## 1. ROLE AND STANDARD

You are acting as an art director and front-end engineer on a single-operator consultancy site. The standard is: **a design-literate stranger should not be able to tell whether a human or a model built this.**

The disciplines you are applying, in this order of leverage:

| # Discipline What it decides here  |                                   |                                                                                |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| 1                                  | **Content design / UX writing**   | Whether the copy names instances or categories. Highest leverage, lowest cost. |
| 2                                  | **Evidence & art direction**      | Whether there is anything on the page that could not have been generated.      |
| 3                                  | **Typographic system design**     | Scale, pairing, optical sizing, the size *gaps*                                |
| 4                                  | **Composition & layout**          | Asymmetry, dominant axis, grid violation, density variation                    |
| 5                                  | **Colour & contrast engineering** | Palette derivation and measured WCAG ratios                                    |
| 6                                  | **Information architecture**      | Section count, CTA count, decision load                                        |
| 7                                  | **Motion & interaction design**   | Choreography and restraint                                                     |
| 8                                  | **Accessibility engineering**     | Measured, not assumed                                                          |
| 9                                  | **Performance engineering**       | Font loading, CLS, payload                                                     |
| 10                                 | **Conversion / CX**               | CTA hierarchy, friction, proof placement                                       |

You are **not** applying "visual design" as a general skill. Each pass below names which discipline is active. Do not mix.

---

## 2. PROJECT FACTS (LOCKED — do not change without asking)

**Stack**

- Static site. Vanilla HTML + CSS + ES modules. **No framework, no build step.**
- Served by Cloudflare Workers from `production/` via `wrangler.jsonc` (`name: optivue-growth-os`).
- Design tokens are CSS custom properties (`--ovgo-*`) scoped to `#optivue-growth-os`.
- Two custom elements exist and must keep working: `optivue-growth-system` (hero canvas), `optivue-spotlight-card` (pricing).
- Breakpoints already in use: `1050px`, `760px`. Do not invent new ones without cause.

**Business rules**

- "Request a Custom Proposal", "Book A Discovery Call", "Get Started" all open the same Calendly modal.
- "Get Your Free Audit" routes to `/diagnosis` only. It never opens Calendly.
- **No invented metrics, testimonials, client counts, logos, or awards.** Ever. Not as placeholder, not as "example".
- No signup / login / account creation.
- Audience: clinic and SMB owners, roughly 35–60, first touch is usually mobile.
- Voice is first person singular. The operator is one person, not an agency.

**Real clients (names already public on the site)**
Express Medical Care / Revive · CBP / Ideal Spine · CJB / LearnX

---

## 3. THE ANTI-SLOP CONTRACT

### 3a. BANNED — remove on sight, never reintroduce

**Typographic tells**

- Bracketed eyebrow labels: `[ LIKE THIS ]`
- `//` as a decorative separator
- `01_SNAKE_CASE` or `02_LIKE_THIS` labels
- Monospace type for anything that is not a number, a price, or actual code
- All-caps letterspaced micro-labels below 12px
- Inter + JetBrains Mono as a pairing
- Gradient-filled text

**Vocabulary** — banned nouns and verbs:
`arsenal` · `protocol` · `inspector` · `engine` (as a section name) · `harmony` · `architecture` (as a section name) · `ecosystem` · `journey` · `unleash` · `elevate` · `seamless` · `robust` · `leverage` · `empower` · `unlock` · `supercharge` · `transform` used as a noun

**Template prose** — banned sentence frames:

- `Core challenge: …`
- `Operational focus: …`
- Any label repeated verbatim across three or more cards
- Six-noun lists ("acquisition, conversion, CRM, automation, SEO, and analytics")
- Any sentence that would be equally true of any agency

**Visual tells**

- `●` status pills, "SYSTEM ONLINE" / "CONNECTED" HUD language
- Decorative arrow chains (`A → B → C → D`) used as a strip
- More than two sections built as an equal-width 3-column card grid
- Backdrop-blur / glassmorphism on more than one element in the page
- Abstract mesh gradients, 3D blobs, generic vector illustration, stock photography of laptops
- Emoji used as iconography
- Uniform transition timing (everything at `0.2s ease`)
- Centred body text in more than one section
- Every card carrying the same eyebrow + title + description + tag-row shape

### 3b. REQUIRED — the pass fails without these

- **Every factual claim traces to something real.** If it cannot be sourced, delete it.
- **At least one photograph of an actual human being** (the operator).
- **At least six real screenshots or interface artefacts** from real client work, cropped and annotated.
- **A type scale with a deliberate gap** — nothing occupies the middle of the scale. Big things are very big, small things are small, and there is no 24px–32px filler tier.
- **At least three structurally distinct layout archetypes** across the page.
- **At least two sections that are not dark.**
- **Measured contrast**, not assumed. Every token pair computed and recorded.
- **One deliberate grid violation** — a single element that breaks the container, on purpose, once.

---

## 4. DESIGN DECISIONS ALREADY LOCKED (v2 pass, shipped)

Do not relitigate these without a reason:

- **Display:** Archivo, variable, `wdth 112–118`, weight 700
- **Body:** Inter 400/500/600
- **Mono:** IBM Plex Mono, permitted in exactly two places — the price figure and the brand mark
- **Radius scale:** `6px` structural, `3px` chips. Nothing else.
- **`--ovgo-subtle`****:** `#99A1AE` (7.6:1 on `#090A0C`). The old `#717985` was 4.5:1 and failed on phones.
- **Paper-light sections:** "Who this is for" and the final CTA
- Kicker count capped at **seven** across the whole page
- Overrides live in `production/css/optivue-v2.css`, loaded after `optivue.css`, so the pass is revertible by deleting one `<link>`

---

## 5. PASS SEQUENCE

Each pass is one PR. Change one layer at a time.

P1 → P2 → P3 run in sequence and may proceed while P0 evidence intake is still open. **P0 blocks P4 only.** P4 and P3 must both be complete before P5; then P5 → P6 → P7.

```text
P0 (evidence)  ──────────────┐
                             ├──► P4 (evidence layer) ──► P5 ──► P6 ──► P7
P1 (copy) ──► P2 (type) ──► P3 (composition) ───────────┘
```

Do not combine passes in one PR.

---

### P0 — EVIDENCE INTAKE *(blocks P4 only; human-only, not agent work)*

**Discipline:** art direction
**This is the pass that actually decides whether the site stops looking generated.**

Collect, for each of the three clients:

- 2–3 real screenshots: a CRM workflow, a GA4 or dashboard view, a landing page, a GBP listing, an automation canvas
- The one specific mechanic that changed — in a sentence a human would say out loud
- Written permission, or a decision to anonymise

Also collect: one photograph of the operator. Real, not a headshot template. Working, at a desk, on location, whatever is true.

**Acceptance:** ≥6 artefacts on disk in `production/assets/`, each with a one-line factual caption and a permission status.
**If permission is refused:** build sanitised reconstructions, label them explicitly as reconstructions, and never imply otherwise.

---

### P1 — CONTENT DESIGN

**Discipline:** UX writing
**Why first:** the cheapest and highest-leverage pass, and it constrains every layout decision downstream.

- Rewrite every heading and body block against the banned-vocabulary list in 3a.
- Convert category language into instance language. "SEO / GBP" becomes the actual thing that was done.
- Every case card: replace template frames with one specific sentence about what changed operationally.
- Enforce first-person singular throughout.
- Cut CTA labels to **two** distinct strings sitewide (one Calendly, one `/diagnosis`).

**Acceptance criteria**

- `grep -icE 'arsenal|protocol|inspector|harmony|ecosystem|unleash|elevate|seamless|robust|leverage|empower|unlock' production/index.html` returns **0**
- Zero occurrences of `[ ` outside the brand mark
- No sentence frame appears in three or more cards
- Distinct CTA label count ≤ 2 (excluding `Get Started` on pricing cards)

---

### P2 — TYPOGRAPHIC SYSTEM

**Discipline:** typographic system design

- Define an explicit scale as tokens. Enforce the gap: no tier between `22px` and `36px`.
- Set optical sizing: tighten tracking as size increases (`-0.03em` at display, `0` at body).
- Set measure: body copy capped at `54ch`, headings at `16ch`.
- Self-host Archivo + Inter as `woff2` with `font-display: swap` and a matched fallback metric to kill layout shift.

**Acceptance criteria**

- Every `font-size` in the codebase resolves to a named scale token
- Lighthouse CLS < 0.05
- No text renders below `12px` anywhere, at any breakpoint

---

### P3 — COMPOSITION

**Discipline:** layout and composition
**This is where the structural monotony gets broken.**

- Classify every section by layout archetype. Currently there are effectively two. Get to **four or more**:
  - full-bleed editorial
  - asymmetric two-column with a hanging figure
  - dense data/table block
  - single oversized statement
  - horizontally scrolling strip
- Vary density deliberately: alternate packed sections with genuinely empty ones. Airy is a choice, not padding.
- Give each section **one** dominant element. Everything else in that section steps down.
- Execute exactly one grid violation: an image or figure that breaks `--ovgo-max`. Once, not twice.

**Acceptance criteria**

- No layout archetype used more than twice consecutively
- At least one section with a ≥`60/40` asymmetric split
- At least one full-bleed element
- Screenshots captured at `390px`, `768px`, `1440px` and reviewed before merge

---

### P4 — EVIDENCE LAYER

**Discipline:** art direction + front-end
**Depends on P0.**

- Rebuild the three case cards around images, not prose.
- Annotate each screenshot: a thin callout line and a short label pointing at the specific thing that matters.
- Place the operator photograph in the "How I work" section.
- Treat images consistently: one crop ratio, one border treatment, one caption style.

**Acceptance criteria**

- Every case card contains ≥1 real image
- Every image has a factual caption and meaningful `alt`
- Zero stock imagery, zero generated illustration
- Images served as `webp` with explicit `width`/`height` to prevent shift

---

### P5 — INFORMATION ARCHITECTURE

**Discipline:** IA + conversion
**Do not run this pass on taste. Run it on data.**

- Instrument the diagnosis tool and estimator first. Measure start rate and completion rate for 2–4 weeks.
- Then cut: target 11 sections → 7.
- The estimator currently outputs a price that the pricing section already states. Resolve the duplication.
- Reduce the four conversion mechanisms (Calendly, diagnosis, estimator, context brief) to two primary and one secondary.

**Acceptance criteria**

- Every surviving section has a stated job, written down
- Time to first CTA on mobile under 3 screens of scroll
- No two sections asking for the same action in the same way

---

### P6 — MOTION

**Discipline:** interaction design

- Replace uniform `0.2s ease` with a deliberate two-tier system: `120ms` for direct feedback, `320ms` with a custom curve for entrances.
- Choreograph, don't decorate: stagger related elements, animate one thing per section, never everything.
- Honour `prefers-reduced-motion` (already implemented — verify it still holds).

**Acceptance criteria**

- No more than one entrance animation per viewport
- All motion disabled under reduced-motion, verified
- Nothing animates on scroll more than once

---

### P7 — VERIFICATION

**Discipline:** accessibility + performance

Run and record:

```bash
# contrast, every token pair, computed not guessed
python3 scripts/contrast.py            # must output ≥4.5:1 for all body text

# real-device widths
npx playwright screenshot --viewport-size=390,844 http://localhost:8787 shots/390.png
npx playwright screenshot --viewport-size=1440,900 http://localhost:8787 shots/1440.png

# budgets
npx lighthouse http://localhost:8787 --only-categories=performance,accessibility

```

**Acceptance criteria**

- Lighthouse accessibility ≥ 95
- Lighthouse performance ≥ 90 on mobile
- CLS < 0.05
- Zero horizontal overflow at 390px
- Full keyboard traversal of the diagnosis and estimator tools

---

## 6. SLOP AUDIT — run before declaring any pass done

Answer each honestly. Any "no" blocks the merge.

1. Is there anything on this page that could not have been generated without access to real client work?
2. Is there a human face?
3. Could a competitor swap their logo in and ship this unchanged? *(if yes, it is still generic)*
4. Does any section look structurally identical to another?
5. Does a single element carry the most visual weight per section, or is weight spread evenly?
6. Is every number, name, and claim true?
7. Read three sentences aloud. Would a person actually say them?
8. Is any decorative motif used more than three times?
9. At 390px, is the first CTA reachable within three screens?
10. Was contrast measured, or assumed?

---

## 7. WORKING RULES FOR THE AGENT

- **Change one layer at a time.** Content, then type, then layout. Never all three in one commit.
- **Prefer an override file** until a decision is settled, then fold it into the base stylesheet.
- **Measure before claiming.** Never write "improves contrast" without the computed ratio. Never write "responsive" without a screenshot.
- **Never invent client facts** to fill a layout. If the evidence is missing, leave the space empty and flag it.
- **Permission status must come from an explicit written source.** Never infer consent from an asset being present, from silence, or from conversational context that does not explicitly grant use. Client permission and anonymisation are separate requirements: anonymising identities does not substitute for written client permission.
- **Flag your own judgement calls** separately from fixes, so they can be rejected individually.
- **Stop and ask** if a change would touch: the Calendly routing rules, published pricing, client names, or the two custom elements.

---

## 8. DEFINITION OF DONE

The site is done when a design-literate stranger, shown the page cold, asks *who built this* rather than *what generated this* — and when every item in section 6 answers yes with evidence attached.
