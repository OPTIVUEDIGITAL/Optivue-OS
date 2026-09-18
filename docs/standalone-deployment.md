# Standalone Deployment Strategy

## Decision

Optivue Growth OS uses a **standalone, GitHub-controlled production architecture**.

GitHub is the source of truth.

The production website is deployed independently from Wix or another page builder.

Wix remains an optional integration or presentation layer, not the owner of the product code.

## Architecture

```text
GitHub repository
      │
      ├── production/
      │      └── Primary standalone website
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
             └── Optional APIs / protected integrations
```

## Primary front-end deployment

The first production host is GitHub Pages.

The deployment workflow publishes only:

`production/`

This keeps documentation, Wix adapters, source references, and backend work out of the public website.

Workflow:

`.github/workflows/deploy-pages.yml`

The workflow runs when:

- changes to `production/**` reach `main`
- the deployment workflow itself changes
- a deployment is manually triggered from GitHub Actions

## Why GitHub Pages first

The current Growth OS production build is static and browser-native:

- HTML
- CSS
- vanilla ES modules
- Web Components
- Calendly iframe integration
- client-side Growth Diagnosis
- client-side Project Estimator

It does not require a Node runtime to render the public site.

This makes a static CDN-style deployment appropriate for the first release.

## Backend boundary

GitHub Pages is intentionally **not** responsible for protected business integrations.

Future server-side requirements should be exposed through HTTPS endpoints.

Examples:

- Growth Diagnosis submission persistence
- CRM writes
- Make webhook processing
- proposal-generation APIs
- database access
- protected third-party APIs
- secret-bearing integrations

The browser should call those endpoints using `fetch()`.

Never place secret API keys inside:

- `production/`
- `portable/`
- Wix public page code

## Custom domain

When the final production hostname is chosen, configure it in GitHub Pages and add a `production/CNAME` file containing only the hostname.

Possible structures include:

- `growth.optivuedigital.com`
- `os.optivuedigital.com`
- `optivuedigital.com`

Do not add a CNAME until the final domain decision is made.

## Release flow

Recommended workflow:

```text
feature branch
      ↓
draft pull request
      ↓
visual / functional QA
      ↓
merge to main
      ↓
GitHub Pages workflow
      ↓
production deployment
```

## Portable edition

`portable/optivue-growth-os.html`

remains available for environments that support inline HTML/CSS/JavaScript.

It is not the canonical production source.

The modular code under `production/` is the source that should be edited first.

After production changes are approved, regenerate the portable bundle from that source.

## Wix

Use Wix only when there is a clear business reason to do so.

Existing Wix-specific code lives under:

`adapters/wix/`

This prevents platform-specific APIs from leaking into the standalone production build.

## Future hosting migration

Because the production build uses standards-based front-end code, it can later be moved to:

- Cloudflare Pages
- Netlify
- Vercel
- S3 / CloudFront
- another static host

without rewriting the Growth OS interface.

GitHub remains the source of truth regardless of host.
