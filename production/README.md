# Optivue Growth OS — Production

This directory is the canonical standalone front-end implementation of the unified Optivue Growth OS ecosystem.

## Six connected functions

The production app simultaneously provides:

- Interactive Digital Growth Portfolio
- Business Transformation Showcase
- Growth Diagnosis Platform
- Project Estimation Tool
- Pricing Experience
- Lead-Generation System

These functions share one prospect context through:

`js/context.js`

## Entry point

`index.html`

## Runtime

No build step is required.

The application uses:

- HTML5
- CSS3
- ES modules
- Web Components
- browser-native APIs

## Important modules

- `js/context.js` — shared prospect context
- `js/diagnosis.js` — Growth Diagnosis
- `js/estimator.js` — Project Estimator
- `js/lead-capture.js` — contextual lead capture
- `js/booking.js` — Calendly experience and booking intent
- `js/runtime-config.js` — public integration flags/endpoints
- `js/optivue.js` — page-level orchestration

## Lead submission

Direct lead submission is disabled by default.

Do not put a raw Make webhook URL in `runtime-config.js`.

When the backend is ready, configure a public server-side relay endpoint and then enable lead submission.

See:

- `../backend/lead-intake/README.md`
- `../docs/integrations/make-intake.md`

## Local preview

Serve this directory through a static HTTP server.

Do not use `file://` when testing ES modules.

## Deployment

GitHub Pages publishes this directory after approved changes reach `main`.

See `../docs/standalone-deployment.md`.

## Editing rule

Make product changes here first.

Regenerate `../portable/optivue-growth-os.html` only after the modular production implementation validates.
