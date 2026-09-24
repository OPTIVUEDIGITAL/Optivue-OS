# Growth System Scope Estimator v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Lead Leak Check and legacy estimator with one guided, mobile-first Growth System Scope Estimator at `/estimator`.

**Architecture:** Keep the static Cloudflare Worker asset architecture and vanilla ES modules. Put prices, questions, mappings, thresholds, result copy, quick wins, and Phase 2 acceptance notes in one public configuration module. Keep scoring and snapshot derivation pure, then render the nine-step interface from those outputs.

**Tech Stack:** HTML, CSS custom properties generated from JSON design tokens, vanilla JavaScript ES modules, Web Components, Node test runner, Cloudflare static assets.

**Spec:** `/workspace/scratch/f4fbcc6d8d35/upload/Pasted text(20260923-153941).txt`, plus the approved Result E ruling in this plan.

## Global Constraints

- Change `growth.optivuedigital.com` only. Do not touch `www.optivuedigital.com`.
- Use `production/design-tokens.json` as the source for every new color, spacing, type, radius, and motion value.
- Use one public configuration module for prices, questions, mappings, thresholds, labels, result copy, quick wins, and the Calendly fallback URL.
- Show Growth Systems Diagnostic from `$1,500`, 90-Day Growth Foundation Launch from `$7,500`, and Growth Operations from `$3,500/month`.
- Never publish Systems Care as an estimator result.
- Never ask for personal data before results. Never place sensitive data in URLs or analytics.
- Keep all Phase 2 forms, Turnstile, rate limiting, webhook delivery, CRM writes, and server-side handling out of Phase 1.
- Result E shows no CTA button or form. Its final sentence is `If your needs change, I'd be glad to hear from you.` followed by one text link, `Back to Optivue Growth OS`, pointing to `/`.
- Results A–D show one Calendly CTA, one local clipboard action, and `Not right now`. The clipboard action sends no request and contains no personal data.
- Label the clipboard action `Copy snapshot to share` when `decision_role` is `researching for someone else`; otherwise label it `Copy my snapshot`.
- Add `Send a Note restored on Result E` to the Phase 2 acceptance checklist.
- Preserve the existing Calendly fallback URL until a new 20-minute event URL is confirmed.
- Keep the existing custom elements and avoid new dependencies.
- Use US English and first-person singular Optivue copy.
- Add analytics hooks only. Allow only `business_type`, `location_count`, `monthly_inquiries`, `primary_problem`, `decision_role`, `marketing_spend`, `question_id`, `question_number`, `cta`, `stage`, `scope_label`, and `result`. Do not inject GA4 or GTM scripts.
- Carry `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term` from the page URL into the Calendly URL.
- Serve `/estimator` from `production/estimator/index.html` with static title, description, robots, and canonical tags. Do not set SEO tags with JavaScript.
- Add `X-Robots-Tag: noindex` for `/estimator` in `production/_headers`.
- Do not push, merge, or deploy during implementation.

## Review Focus

- Earlier rules must win when one answer set matches several result branches.
- `None of these` must clear other system selections, while `Not sure` must coexist with selections.
- Back, refresh, resume, restart, and changed answers must keep state and derived results consistent.
- Result E must expose no booking, email, or note action in Phase 1.
- A clipboard denial must preserve the result screen and provide a readable failure status.
- Keyboard selection and reduced motion must preserve the same state transitions as pointer input.

---

### Task 1: Shared Estimator Configuration and Pure Decision Logic

**Files:**
- Create: `production/js/estimator-config.js`
- Replace: `tests/estimator.test.mjs`
- Modify: `production/js/estimator.js`

**Interfaces:**
- Produces: `ESTIMATOR_CONFIG`, `getEstimatorResult(answers)`, `getStageSnapshot(answers, result)`, `getQuickWins(snapshot)`, `getNotedInsight(answers, previousAnswers, insightCount)`.
- Consumes: no DOM state.

- [ ] **Step 1: Write failing tests for the seven personas, first-match rule order, five stage statuses, three-insight limit, and Result E copy.**

```js
test('online store receives Result E without an action', () => {
  const result = getEstimatorResult({ business_type: 'ecommerce' });
  assert.equal(result.id, 'E');
  assert.equal(result.action, null);
  assert.match(result.body, /If your needs change, I'd be glad to hear from you\./);
});

test('readiness wins before foundation', () => {
  const result = getEstimatorResult(PERSONAS.medSpaReadiness);
  assert.equal(result.id, 'D');
});
```

- [ ] **Step 2: Run the estimator suite and verify RED.**

Run: `node --test tests/estimator.test.mjs`

Expected: FAIL because the v2 exports and configuration do not exist.

- [ ] **Step 3: Add the shared configuration and pure derivation functions.**

```js
export const ESTIMATOR_CONFIG = Object.freeze({
  prices: {
    diagnostic: { label: 'Growth Systems Diagnostic', display: 'From $1,500' },
    foundation: { label: '90-Day Growth Foundation Launch', display: 'From $7,500' },
    operations: { label: 'Growth Operations', display: 'From $3,500/month' },
  },
  phase2Acceptance: ['Send a Note restored on Result E'],
});
```

- [ ] **Step 4: Run estimator tests until GREEN, then run the complete Node suite.**

Run: `node --test tests/estimator.test.mjs && node --test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit.**

```bash
git add production/js/estimator-config.js production/js/estimator.js tests/estimator.test.mjs
git commit -m "feat: add estimator v2 decision engine"
```

### Task 2: Route, Metadata, Entry Points, and Shared Pricing

**Files:**
- Modify: `production/index.html`
- Create: `production/estimator/index.html`
- Modify: `production/_redirects`
- Modify: `production/_headers`
- Modify: `production/sitemap.xml`
- Modify: `production/js/optivue.js`
- Delete: `production/js/diagnosis.js`
- Modify: `tests/routing.test.mjs`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `ESTIMATOR_CONFIG.prices` and `initEstimator(root)`.
- Produces: `/estimator` route behavior, `/diagnosis` 301 redirect, homepage estimator entry points, and pricing placeholders populated from shared config.

- [ ] **Step 1: Write failing route and content tests.**

```js
test('diagnosis redirects permanently to estimator', () => {
  assert.match(redirects, /^\/diagnosis \/estimator 301$/m);
});

test('estimator metadata stays out of search', () => {
  assert.match(estimatorHtml, /<title>Growth System Scope Estimator \| Optivue Growth OS<\/title>/);
  assert.match(estimatorHtml, /<meta name="robots" content="noindex">/);
  assert.match(estimatorHtml, /<link rel="canonical" href="https:\/\/growth\.optivuedigital\.com\/estimator">/);
  assert.match(headers, /\/estimator[\s\S]*X-Robots-Tag: noindex/);
  assert.doesNotMatch(sitemap, /\/estimator/);
});
```

- [ ] **Step 2: Run route and content tests and verify RED.**

Run: `node --test tests/routing.test.mjs tests/site-content.test.mjs`

Expected: FAIL on the old `/diagnosis` route, legacy tool markup, and static price ownership.

- [ ] **Step 3: Remove both homepage tool sections, link the homepage to `/estimator`, create the standalone estimator document with static SEO tags, add the noindex response header, update every entry link, remove the diagnosis import and file, and bind homepage pricing text from shared config.**

```html
<section id="estimator" class="ovgo-estimator" data-ovgo-estimator-page aria-labelledby="estimator-title">
  <div data-ovgo-estimator></div>
</section>
```

- [ ] **Step 4: Run focused tests and the full Node suite until GREEN.**

Run: `node --test tests/routing.test.mjs tests/site-content.test.mjs && node --test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit.**

```bash
git add production/index.html production/estimator/index.html production/_redirects production/_headers production/sitemap.xml production/js/optivue.js production/js/diagnosis.js tests/routing.test.mjs tests/site-content.test.mjs
git commit -m "feat: replace legacy tools with estimator route"
```

### Task 3: Guided Nine-Step Estimator and Session Recovery

**Files:**
- Modify: `production/js/estimator.js`
- Modify: `production/js/booking.js`
- Create: `tests/estimator-ui.test.mjs`
- Modify: `production/js/analytics.js`

**Interfaces:**
- Consumes: configuration and pure functions from Task 1.
- Produces: `initEstimator(root)`, versioned `sessionStorage` state, question rendering, back navigation, restart, progress, noted insights, result rendering, and privacy-safe analytics events.

- [ ] **Step 1: Write failing DOM-independent state tests for selection, auto-advance intent, multi-select exclusivity, resume, restart, analytics allowlisting, and Result E action removal.**

```js
test('None of these clears every other selected system', () => {
  assert.deepEqual(toggleSystem(['crm', 'tracking'], 'none'), ['none']);
});

test('Result E exposes only the homepage link', () => {
  const model = buildResultViewModel({ business_type: 'ecommerce' });
  assert.deepEqual(model.actions, [{ type: 'link', label: 'Back to Optivue Growth OS', href: '/' }]);
});

test('research role receives a share-oriented clipboard label', () => {
  const model = buildResultViewModel(PERSONAS.researcher);
  assert.equal(model.actions[1].label, 'Copy snapshot to share');
});
```

- [ ] **Step 2: Run the UI test and verify RED.**

Run: `node --test tests/estimator-ui.test.mjs`

Expected: FAIL because v2 state transitions and result view models do not exist.

- [ ] **Step 3: Implement the intro, resume prompt, nine fieldsets, progress, auto-advance, multi-select continue bar, loader, live desktop snapshot, result accordions, quick wins, start-over behavior, clipboard summary actions, UTM forwarding, and analytics hooks.**

```js
const STORAGE_KEY = 'optivue-estimator-v2';
const ANALYTICS_FIELDS = new Set(['business_type', 'location_count', 'monthly_inquiries', 'primary_problem', 'decision_role', 'marketing_spend', 'question_id', 'question_number', 'cta', 'stage', 'scope_label', 'result']);
const CALENDLY_UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
```

- [ ] **Step 4: Run the focused tests and complete Node suite until GREEN.**

Run: `node --test tests/estimator-ui.test.mjs && node --test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit.**

```bash
git add production/js/estimator.js production/js/booking.js production/js/analytics.js tests/estimator-ui.test.mjs
git commit -m "feat: build guided scope estimator flow"
```

### Task 4: Mobile-First Visual System and Accessibility

**Files:**
- Modify: `production/design-tokens.json`
- Regenerate: `production/css/tokens.generated.css`
- Modify: `production/css/optivue.css`
- Modify: `production/css/optivue-v2.css`
- Create: `tests/estimator-accessibility.test.mjs`

**Interfaces:**
- Consumes: semantic estimator markup from Task 3.
- Produces: 390px single-column flow, tablet grid, desktop split view, safe-area multi-select action bar, focus treatments, text status cues, and reduced-motion behavior.

- [ ] **Step 1: Write failing static accessibility and token tests.**

```js
test('estimator exposes semantic fieldsets and progress', () => {
  assert.match(source, /<fieldset/);
  assert.match(source, /<legend/);
  assert.match(source, /role="progressbar"/);
  assert.match(source, /aria-live="polite"/);
});

test('reduced motion removes estimator translation and loader motion', () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.ovgo-estimator[^}]*transition:\s*none/s);
});
```

- [ ] **Step 2: Run the accessibility test and verify RED.**

Run: `node --test tests/estimator-accessibility.test.mjs`

Expected: FAIL because the v2 selectors and semantics are absent.

- [ ] **Step 3: Add missing values to the JSON token source, regenerate CSS, and style the estimator for mobile, tablet, desktop, keyboard focus, contrast, safe areas, and reduced motion.**

Run: `node scripts/build-tokens.mjs`

Expected: generated token CSS updates from the JSON source.

- [ ] **Step 4: Run accessibility, token, contrast, and full Node checks until GREEN.**

Run: `node --test tests/estimator-accessibility.test.mjs && node scripts/build-tokens.mjs --check && python3 scripts/contrast.py && node --test`

Expected: all checks exit zero.

- [ ] **Step 5: Commit.**

```bash
git add production/design-tokens.json production/css/tokens.generated.css production/css/optivue.css production/css/optivue-v2.css tests/estimator-accessibility.test.mjs
git commit -m "style: add accessible estimator experience"
```

### Task 5: Documentation, Portable Artifact, and Acceptance QA

**Files:**
- Modify: `README.md`
- Modify: `production/README.md`
- Modify: `docs/product-spec.md`
- Modify: `docs/architecture.md`
- Modify: `docs/prospect-journey.md`
- Modify: `docs/layout-archetypes.md`
- Modify: `portable/optivue-growth-os.html`
- Modify: `scripts/mobile-qa.mjs`
- Create: `docs/estimator-admin.md`
- Create: `tests/estimator-acceptance.test.mjs`

**Interfaces:**
- Consumes: the completed production implementation.
- Produces: synchronized portable build, admin editing guide, updated architecture notes, and a Phase 1/Phase 2 acceptance record.

- [ ] **Step 1: Write a failing repository scan for removed tools, forbidden prices, Phase 2 controls, Result E actions, and stale documentation.**

```js
test('Phase 1 ships no Result E note form or email capture', () => {
  assert.doesNotMatch(productionSource, /data-send-note-form|data-email-snapshot-form/);
  assert.match(admin, /Send a Note restored on Result E/);
});
```

- [ ] **Step 2: Run the acceptance scan and verify RED.**

Run: `node --test tests/estimator-acceptance.test.mjs`

Expected: FAIL on stale diagnosis, estimator, route, and documentation references.

- [ ] **Step 3: Synchronize the portable artifact and active documentation. Document how to edit questions, thresholds, prices, copy, quick wins, the Calendly URL, and the estimator enable switch. Record the Phase 2 item `Send a Note restored on Result E`.**

```md
## Phase 2 acceptance

- [ ] Email snapshot form uses Turnstile, rate limiting, and server-side delivery.
- [ ] Send a Note restored on Result E.
```

- [ ] **Step 4: Run all automated QA and inspect the 390px, tablet, and desktop previews.**

Run: `node --test && node scripts/build-tokens.mjs --check && python3 scripts/contrast.py && node scripts/mobile-qa.mjs`

Expected: every command exits zero, all seven personas match, and no horizontal overflow appears at 390px.

- [ ] **Step 5: Run the local Worker and record live route responses.**

Run: `npx wrangler dev --local`

Verify with `curl -i` that `/diagnosis` returns `301` with `Location: /estimator`, `/estimator` returns `200` with `X-Robots-Tag: noindex` and static noindex markup, and `/` retains `https://growth.optivuedigital.com/` as its canonical.

- [ ] **Step 6: Capture the intro, one question, and Results A–E at 390px, tablet, and desktop. Save the screenshots with the test output for owner review. Do not push, merge, or deploy.**

- [ ] **Step 7: Commit.**

```bash
git add README.md production/README.md docs/product-spec.md docs/architecture.md docs/prospect-journey.md docs/layout-archetypes.md docs/estimator-admin.md portable/optivue-growth-os.html scripts/mobile-qa.mjs tests/estimator-acceptance.test.mjs
git commit -m "docs: synchronize estimator v2 acceptance"
```
