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

## Cloudflare Pages

This directory is the Cloudflare Pages output directory.

Staging configuration:

- repository: `OPTIVUEDIGITAL/Optivue-OS`
- branch: `release/cloudflare-staging`
- framework preset: None
- build command: `exit 0`
- output directory: `production`

After QA, use `main` as the production branch.

See:

`../docs/cloudflare-deployment.md`

## Security headers

`_headers` is interpreted by Cloudflare Pages and adds static-site security headers.

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
