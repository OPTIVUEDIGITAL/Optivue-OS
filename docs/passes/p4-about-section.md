# PROMPT — About section: portrait + short bio into "How I work"

Save as `docs/passes/p4-about-section.md`. Paste the whole thing into Claude Code.

---

## CONTEXT

Repo: `OPTIVUEDIGITAL/Optivue-OS`
Site: static HTML + CSS + ES modules. **No framework, no build step.**
Deploy: Cloudflare Workers, serving `production/` via `wrangler.jsonc`.
Governing spec: `docs/design-direction.md`. Read it before starting.

Files you will touch:

- `production/index.html` — the `#about` section only
- `production/css/optivue-v2.css` — append only
- `production/assets/` — the portrait image
- `production/assets/EVIDENCE.md` — update the portrait row

---

## THE TASK

Put a photograph of the operator and a short personal bio **into the existing** **`#about`** **("How I work") section.**

**Do not create a new "About" section.** The site is already too long. `#about` currently holds a heading, one line of text, and a row of arrows — it is the emptiest section on the page. Fill it rather than adding a twelfth section.

---

## HARD RULES

1. **Do not invent any biographical fact.** Not years of experience, not a client count, not a former employer, not a location, not a qualification. If a fact is missing, leave the placeholder in place and list it for the human to fill. A fabricated bio is a worse outcome than an unfinished one.
2. **Do not touch** the Calendly routing, the pricing figures, the client names, or the two custom elements (`optivue-growth-system`, `optivue-spotlight-card`).
3. **Append to** **`optivue-v2.css`****.** Do not edit `optivue.css`. The override layer must stay revertible by deleting one `<link>`.
4. **One PR, this section only.** Do not fix anything else you notice. List it instead.
5. Banned vocabulary from `docs/design-direction.md` applies to all new copy: `arsenal`, `protocol`, `ecosystem`, `journey`, `seamless`, `robust`, `leverage`, `empower`, `unlock`, `elevate`, `passionate`, `driven`, `results-oriented`.

---

## COPY BRIEF

Rewrite the `#about` intro as a short first-person bio.

**Length: 60–100 words. Hard ceiling 100.** If it runs long, cut.

**Must cover, in this order of priority:**

1. His name, and what he does, in plain words.
2. **That the client gets him directly — no account manager, no junior taking over after the sales call.** This is the main competitive point against an agency and it is currently not stated anywhere on the site.
3. How long he has been doing this. *(placeholder — do not invent)*
4. What the work actually looks like day to day.

**Must NOT include:** hobbies, mission statements, a tool list (already elsewhere on the page), anything resembling a CV, anything resembling a slogan.

**Voice:** first person singular, plain, slightly understated. Short sentences. The way someone talks, not the way a website writes.

**Starting draft to edit, not to ship as-is:**

> I'm Rahmel. I build and run the whole system myself — the site, the tracking, the CRM, the follow-up. There's no account manager in between, and no junior doing the work after you've met me.
>
> I've spent `{{YEARS}}` years working on `{{BUSINESS_TYPES}}`. Most of what I do is unglamorous: making the pieces you already own talk to each other properly.
>
> You'll hear from me directly, and you'll know what changed and why.

**Placeholders the human must fill. Leave them visible and report them. Do not guess:**

- `{{YEARS}}` — years of experience
- `{{BUSINESS_TYPES}}` — the kinds of businesses he works with
- `{{TIMEZONE_LINE}}` — optional. If he works in a different timezone from his clients, one plain sentence saying so. Ask; do not assume either way.

---

## MARKUP

Replace the contents of `#about` with this structure. Keep the existing seven-step `.ovgo-process` list exactly as it is.

```html
<section id="about" class="ovgo-section ovgo-about">
  <div class="ovgo-shell ovgo-about__grid">

    <figure class="ovgo-portrait">
      <img src="./assets/rahmel-dela-cruz.webp"
           width="880" height="1100"
           alt="Rahmel Dela Cruz at his desk reviewing a CRM pipeline"
           loading="lazy" decoding="async">
      <figcaption>Rahmel Dela Cruz · Optivue Digital</figcaption>
    </figure>

    <div class="ovgo-about__body">
      <p class="ovgo-kicker">How I work</p>
      <h2>Strategy first, then systems.</h2>
      <div class="ovgo-about__bio">
        <!-- 60–100 word bio here -->
      </div>
      <ol class="ovgo-process"><!-- existing seven steps, unchanged --></ol>
    </div>

  </div>
</section>
```

Update the `alt` text to describe the actual photograph once it exists. It must be factual.

---

## CSS

Append to `production/css/optivue-v2.css`:

```css
/* --- ABOUT: portrait + bio -------------------------------------- */
.ovgo-about__grid {
  display: grid;
  grid-template-columns: 38% 1fr;
  gap: clamp(28px, 5vw, 72px);
  align-items: end;
}

.ovgo-portrait { margin: 0; }
.ovgo-portrait img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--ovgo-r);
  display: block;
  filter: saturate(.92) contrast(1.02);
}
.ovgo-portrait figcaption {
  margin-top: 12px;
  font-size: 12px;
  color: var(--ovgo-subtle);
}

.ovgo-about__bio p {
  font-size: 17px;
  line-height: 1.6;
  max-width: 52ch;
  margin: 0 0 14px;
}

/* the single deliberate grid violation the spec permits — used once, here */
@media (min-width: 1051px) {
  .ovgo-portrait { margin-left: calc(-1 * clamp(16px, 4vw, 64px)); }
}

@media (max-width: 760px) {
  .ovgo-about__grid { grid-template-columns: 1fr; }
  .ovgo-portrait { margin-left: 0; }
  .ovgo-portrait img { aspect-ratio: 3 / 2; }
  .ovgo-about__bio p { font-size: 16px; }
}
```

If a grid violation is already used elsewhere on the page, **remove it from there or from here.** The spec allows exactly one.

---

## IMAGE

- Format `webp`, at `production/assets/rahmel-dela-cruz.webp`
- Minimum 880 × 1100, 4:5 portrait crop
- Explicit `width` and `height` in the markup (prevents layout shift)
- File size under 180 KB
- `loading="lazy"`, `decoding="async"`

**Art direction note for the human, not the agent:** a plain-background studio headshot is itself a generic tell and will work against the rest of this effort. Shoot in a working context — desk, real room, screen light. Slightly desaturated to sit inside the existing palette.

If the photograph is not yet committed, **stop and report.** Do not ship a placeholder image, a grey box, or a generated avatar.

---

## ALSO UPDATE

`production/assets/EVIDENCE.md` — set the portrait row to the real status once the file is committed.

Permission status may only be set from a written artefact or an explicit instruction. **Never infer consent from conversation.** Leave it as `Not supplied` until the file is actually in the repo.

---

## ACCEPTANCE CRITERIA

All must pass before opening the PR:

- [ ] No new `<section>` was added; the page section count is unchanged
- [ ] Bio is 60–100 words, first person
- [ ] Bio states explicitly that the client works with him directly
- [ ] `grep -icE 'arsenal|protocol|ecosystem|journey|seamless|robust|leverage|empower|unlock|elevate|passionate'` on `index.html` returns **0**
- [ ] Every placeholder is still visible and listed in the PR description
- [ ] Zero invented facts — every factual claim traces to something the human supplied
- [ ] Portrait has explicit width/height and factual alt text
- [ ] No horizontal overflow at 390 px
- [ ] `optivue.css` is unmodified
- [ ] Exactly one grid violation exists on the whole page

---

## VERIFY BEFORE CLAIMING DONE

```bash
npx wrangler dev
npx playwright screenshot --viewport-size=390,844  http://localhost:8787 shots/about-390.png
npx playwright screenshot --viewport-size=1440,900 http://localhost:8787 shots/about-1440.png
```

Attach both screenshots to the PR. **Do not write "responsive" without a screenshot. Do not write "improved" without a measurement.** If a step fails, say so plainly rather than describing intent as outcome.

---

## STOP AND ASK IF

- The photograph is not in the repo
- Any placeholder cannot be filled from something the human actually said
- The change would require editing `optivue.css`
- You believe another section also needs changing — list it, do not do it

---

## SEQUENCING NOTE

This is **P4** in `docs/design-direction.md`, and P3 (composition) will restructure this area. Two options:

- **Ship now** and accept that P3 may redo the layout, or
- **Hold** the CSS and land the copy only, then place the portrait during P3

Ask the human which. Do not decide alone.
