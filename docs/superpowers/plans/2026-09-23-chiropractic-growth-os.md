# Chiropractic Growth OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition Growth OS for US chiropractic clinics, replace the commercial offers, update the diagnosis and estimator, and meet the supplied mobile, accessibility, SEO, and routing requirements.

**Architecture:** Keep the static Cloudflare Worker asset architecture and existing custom elements. Add a dependency-free token generator, focused configuration modules, and Node tests for copy, pricing, routing, metadata, and interactive business rules.

**Tech Stack:** HTML, CSS custom properties, ES modules, Web Components, Node test runner, Cloudflare Workers static assets.

**Spec:** `../upload/Pasted text(20260923-082003).txt` in the task workspace. The full uploaded prompt is the binding product specification.

## Global Constraints

- Use US English, first-person singular delivery language, and clinic-specific terminology.
- Keep the existing Calendly fallback URL until the Clinic Fit Call URL is confirmed.
- Route Lead Leak Check entry links only to `/diagnosis`.
- Keep all new visual values in `production/design-tokens.json`, compiled to generated CSS without dependencies.
- Preserve existing custom elements and before/after sliders.
- Do not publish unverified metrics, outcomes, permissions, availability, or terms.
- Keep the Founding Clinic section disabled by default.
- Do not add signup, login, account creation, tracking scripts, or paid services.
- Maintain keyboard support, reduced motion support, minimum tap sizes, and mobile-first layout.

## Review Focus

- A multi-location or custom-integration estimator selection returns `Custom proposal`.
- All booking triggers use one modal, and Lead Leak Check entry links never invoke Calendly.
- The 390px hero contains audience, outcome, explanation, CTA, and proof within the target fold.
- Every unverified statement stays marked with a visible `[CONFIRM: ...]` marker or remains hidden.
- Generated CSS matches the JSON token source and contains no manually duplicated root token definitions.

---

### Task 1: Acceptance Test Harness and Token Source

**Files:**
- Create: `tests/site-content.test.mjs`
- Create: `tests/estimator.test.mjs`
- Create: `tests/routing.test.mjs`
- Create: `production/design-tokens.json`
- Create: `scripts/build-tokens.mjs`
- Create: `production/css/tokens.generated.css`
- Modify: `production/index.html`
- Modify: `production/css/optivue.css`

**Interfaces:**
- Produces: generated CSS custom properties and baseline acceptance scans used by later tasks.

- [ ] Write tests for token generation, legacy-copy removal, metadata, one H1, routes, estimator floors, and configuration defaults.
- [ ] Run `node --test tests/*.test.mjs` and confirm failures describe missing requirements.
- [ ] Add the JSON token source and dependency-free generator.
- [ ] Generate CSS, link it before handwritten styles, and remove duplicate root token declarations.
- [ ] Run the token and content tests until green.
- [ ] Commit with `build: establish Growth OS tokens and acceptance tests`.

### Task 2: Page Structure, Copy, Metadata, and Offers

**Files:**
- Modify: `production/index.html`
- Modify: `production/sitemap.xml`
- Modify: `production/robots.txt`
- Modify: `production/js/runtime-config.js`

**Interfaces:**
- Consumes: generated tokens from Task 1.
- Produces: final semantic section structure, offer cards, disabled Founding Clinic markup, and updated metadata.

- [ ] Extend content tests for every required section, CTA label, case-study qualifier, disclaimer, canonical URL, social metadata, and JSON-LD.
- [ ] Run the content suite and confirm RED.
- [ ] Replace the page structure and copy using the supplied specification.
- [ ] Add the Founding Clinic flag and render only when enabled with configured terms.
- [ ] Update sitemap and robots URLs.
- [ ] Run the content suite until green.
- [ ] Commit with `feat: reposition Growth OS for chiropractic clinics`.

### Task 3: Growth System, Diagnosis, and Estimator Logic

**Files:**
- Modify: `production/js/optivue.js`
- Modify: `production/js/diagnosis.js`
- Modify: `production/js/estimator.js`
- Modify: `production/js/context.js`
- Modify: `production/js/components/growth-system.js`
- Modify: `shared/elements/optivue-growth-system.js`

**Interfaces:**
- Produces: clinic-specific stage panels, Lead Leak Check results, and exported estimator calculation functions.

- [ ] Write direct tests for diagnostic result labels, estimator floors, custom-proposal conditions, and session state.
- [ ] Run tests and confirm RED.
- [ ] Export pure estimator and diagnosis functions, then update UI copy and results.
- [ ] Update Growth System details with clinic problem, build output, and visibility fields.
- [ ] Run all Node tests until green.
- [ ] Commit with `feat: update clinic diagnosis and investment estimator`.

### Task 4: CTA Routing, Analytics Hooks, and Mobile CTA

**Files:**
- Modify: `production/js/booking.js`
- Modify: `production/js/optivue.js`
- Create: `production/js/analytics.js`
- Modify: `production/index.html`

**Interfaces:**
- Produces: `trackEvent(name, parameters)`, one Calendly modal route, location-aware CTA events, and viewport-aware sticky CTA behavior.

- [ ] Write tests for CTA location values, Lead Leak Check paths, Calendly message handling, and analytics fallback behavior.
- [ ] Run tests and confirm RED.
- [ ] Add privacy-safe event dispatch and Calendly postMessage handling.
- [ ] Add one booking path and sticky CTA visibility observers.
- [ ] Run all Node tests until green.
- [ ] Commit with `feat: unify booking routes and analytics events`.

### Task 5: Responsive Visual System and Accessible Interaction

**Files:**
- Modify: `production/design-tokens.json`
- Regenerate: `production/css/tokens.generated.css`
- Modify: `production/css/optivue.css`
- Modify: `production/css/optivue-v2.css`
- Modify: `production/js/optivue.js`

**Interfaces:**
- Consumes: final semantic classes and IDs from Task 2.
- Produces: 390px-first layouts, accessible accordion styling, translucent navigation, reduced-motion behavior, and safe-area sticky CTA.

- [ ] Add static tests for minimum token sizes, focus styles, reduced motion, safe-area handling, and mobile CTA selectors.
- [ ] Run tests and confirm RED.
- [ ] Implement the mobile-first design using generated tokens only.
- [ ] Add accessible FAQ accordion behavior and restrained, interruptible UI feedback.
- [ ] Run all tests and contrast checks until green.
- [ ] Commit with `style: refine mobile clinic conversion experience`.

### Task 6: Portable Build, Documentation, and Full QA

**Files:**
- Modify: `portable/optivue-growth-os.html`
- Modify: `README.md`
- Modify: `docs/product-spec.md`
- Modify: `docs/architecture.md`
- Modify: `docs/layout-archetypes.md`
- Modify: `docs/reference/source-map.md`
- Modify: `scripts/mobile-qa.mjs`

**Interfaces:**
- Consumes: final production implementation.
- Produces: synchronized portable artifact and updated QA expectations.

- [ ] Add a repository-wide scan test for prohibited legacy terms and prices.
- [ ] Run the scan and confirm RED.
- [ ] Synchronize the portable artifact and active documentation.
- [ ] Update mobile QA expectations for the new offers and hero.
- [ ] Run Node tests, content scans, contrast checks, mobile QA, and visual QA.
- [ ] Record every remaining `[CONFIRM]` marker with file and line.
- [ ] Commit with `docs: synchronize clinic strategy and QA checks`.

