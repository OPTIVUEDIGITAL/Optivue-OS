# Standalone Deployment Strategy

## Decision

Optivue Growth OS uses a **standalone, GitHub-controlled architecture**.

GitHub is the source of truth.

**Cloudflare Pages is the primary front-end host.**

Wix is optional and is not the owner of the Growth OS application code.

## Architecture

```text
GitHub repository
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
             └── Cloudflare Worker / protected integrations

GitHub
  ↓
Cloudflare Pages
  ↓
www.optivuedigital.com

Growth OS browser
  ↓
Cloudflare Worker
  ↓
Make / Intelligence Sheet / CRM
```

## Why Cloudflare Pages

The production app is static and browser-native:

- HTML
- CSS
- vanilla ES modules
- Web Components
- Calendly iframe integration
- client-side Growth Diagnosis
- client-side Project Estimator
- shared prospect-context state

It does not require a Node runtime to render.

Cloudflare Pages also provides branch previews, GitHub integration, custom domains, and a natural path to Cloudflare Workers for secure APIs.

## Deployment settings

Repository:

`OPTIVUEDIGITAL/Optivue-OS`

Staging branch:

`release/cloudflare-staging`

Build command:

`exit 0`

Build output directory:

`production`

Framework preset:

None

After QA, switch the Pages production branch to:

`main`

## Domain

Canonical public domain:

`www.optivuedigital.com`

During the initial rollout, Wix can remain the DNS provider.

Associate `www.optivuedigital.com` with the Cloudflare Pages project first, then create the Wix CNAME pointing `www` to the generated `*.pages.dev` hostname.

Keep the apex domain on Wix initially and redirect it to the canonical `www` hostname.

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
release/cloudflare-staging
   ↓
Cloudflare preview / staging deployment
   ↓
visual + functional QA
   ↓
merge to main
   ↓
Cloudflare production deployment
   ↓
attach www.optivuedigital.com
```

## Portable edition

`portable/optivue-growth-os.html`

remains available for custom-code platforms.

It is not the canonical production source.

Edit `production/` first and regenerate the portable bundle after validation.

## Wix

Wix Premium is useful for:

- current domain ownership/management
- current DNS control
- temporary apex-site redirect
- optional future Wix-specific pages

The main Growth OS application remains outside Wix.
