# Optivue Growth OS — Production

This directory is the canonical standalone front-end implementation of the unified Optivue Growth OS ecosystem.

## Six connected functions

- Interactive Digital Growth Portfolio
- Business Transformation Showcase
- Growth Diagnosis Platform
- Project Estimation Tool
- Pricing Experience
- Lead-Generation System

These functions share prospect context through:

`js/context.js`

## Runtime

No build step is required.

The application uses HTML5, CSS3, ES modules, Web Components, and browser-native APIs.

## Cloudflare Workers + Static Assets

This directory is the static asset directory deployed by the root `wrangler.jsonc`.

Current deployment model:

- repository: `OPTIVUEDIGITAL/Optivue-OS`
- production branch: `main`
- build command: none
- deploy command: `npx wrangler deploy`
- static assets directory: `./production`
- workers.dev staging: enabled
- preview URLs: enabled

See:

`../docs/cloudflare-deployment.md`

## Security headers

`_headers` is interpreted natively by Cloudflare Workers Static Assets and adds static-site security headers.

## Lead submission

Direct lead submission remains disabled until the secure Worker relay and Make intake scenario are verified.

Do not place the raw Make webhook URL in `runtime-config.js`.

See:

- `../backend/lead-intake/README.md`
- `../docs/integrations/make-intake.md`

## Local preview

Serve this directory over HTTP.

Do not use `file://` when testing ES modules.

## Editing rule

Make product changes here first.

Regenerate `../portable/optivue-growth-os.html` after the modular production implementation validates.

## Estimator route

`estimator/index.html` owns the static title, description, noindex directive, and canonical URL for `/estimator`. `_headers` adds `X-Robots-Tag: noindex`, and `_redirects` sends `/diagnosis` to `/estimator` with status 301.

Estimator questions, prices, status mappings, quick wins, and Phase 2 acceptance items live in `js/estimator-config.js`. No Phase 1 estimator form sends data to a server.
