# Optivue Growth OS — Production

This directory is the canonical standalone front-end build.

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

## Local preview

Serve this directory through any static HTTP server.

Do not open `index.html` directly with `file://` when testing ES modules.

## Deployment

GitHub Pages publishes this directory automatically after approved changes are merged to `main`.

See:

`../docs/standalone-deployment.md`

## Editing rule

Make product changes here first.

The one-file version in `../portable/` should be regenerated after the production implementation is approved.
