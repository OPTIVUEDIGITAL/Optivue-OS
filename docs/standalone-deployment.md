# Standalone Deployment Strategy

## Decision

Optivue Growth OS uses a **standalone, GitHub-controlled architecture**.

GitHub is the source of truth.

**Cloudflare Workers + Static Assets is the primary front-end host.**

Wix is optional and is not the owner of the Growth OS application code.

## Architecture

```text
GitHub repository
      │
      ├── wrangler.jsonc
      │
      ├── production/
      │      └── Canonical standalone website
      │
      ├── portable/
      │      └── Copy/paste custom-code edition
      │
      ├── adapters/wix/
      │      └── Optional Wix/Velo integration
      │
      ├── shared/
      │      └── Reusable Web Components
      │
      └── backend/
             └── Protected integrations

GitHub
  ↓
Cloudflare Workers Builds
  ↓
Worker + Static Assets
  ↓
www.optivuedigital.com

Growth OS browser
  ↓
Cloudflare lead-intake Worker
  ↓
Make / Intelligence Sheet / CRM
```

## Why Workers Static Assets

The production app is static and browser-native:

- HTML
- CSS
- vanilla ES modules
- Web Components
- Calendly iframe integration
- client-side Growth System Scope Estimator
- shared prospect-context state

It does not require a Node runtime to render.

Workers Static Assets gives the project:

- GitHub-connected automatic deployments
- public `workers.dev` staging
- version preview URLs
- custom domains
- native `_headers` support
- a direct path to future Worker logic and bindings when needed

## Deployment settings

Repository:

`OPTIVUEDIGITAL/Optivue-OS`

Production branch:

`main`

Build command:

none

Deploy command:

`npx wrangler deploy`

Non-production deploy command:

`npx wrangler versions upload`

Root directory:

`/`

Static asset directory:

`./production`

## Domain

Canonical public domain:

`www.optivuedigital.com`

The Worker should remain on its `workers.dev` staging hostname until visual and functional QA is complete.

Workers Custom Domains require the domain to be inside an active Cloudflare DNS zone. The domain registration may remain with Wix, but authoritative DNS hosting must move to Cloudflare before the Worker can own `www.optivuedigital.com`.

Before any nameserver migration, inventory and preserve all current Wix DNS records.

## Backend boundary

Protected integrations must be exposed through HTTPS endpoints.

Never place secret API keys or raw Make webhook URLs inside:

- `production/`
- `portable/`
- Wix public code

The lead-intake Worker uses a private environment secret instead.

## Release flow

```text
feature work
   ↓
feature branch / PR
   ↓
Cloudflare version preview
   ↓
visual + functional QA
   ↓
merge to main
   ↓
Cloudflare production Worker deployment
   ↓
attach www.optivuedigital.com after DNS migration
```

## Portable edition

`portable/optivue-growth-os.html`

remains available for custom-code platforms.

It is not the canonical production source.

Edit `production/` first and regenerate the portable bundle after validation.

## Wix

Wix Premium can continue to be used for:

- domain registration
- the existing live site until cutover
- current DNS hosting before the Cloudflare nameserver migration
- optional future Wix-specific pages

The main Growth OS application remains outside Wix.
