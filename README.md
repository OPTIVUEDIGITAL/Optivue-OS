# Optivue Growth OS

Optivue Growth OS is the codebase for Optivue Digital's portable growth platform, interactive portfolio, diagnosis workflow, project estimator, pricing experience, and client-acquisition system showcase.

## Production hosting decision

**Primary architecture: standalone, GitHub-controlled website.**

- GitHub is the source of truth.
- `production/` is the canonical public application.
- GitHub Pages is the initial static host.
- Wix is optional and isolated under `adapters/wix/`.
- `portable/` remains the copy/paste edition for custom-code environments.
- Protected integrations stay behind a separate backend/API boundary.

See `docs/standalone-deployment.md` for deployment and custom-domain guidance.

## Repository strategy

This repository supports two delivery modes from one product specification.

### 1. Portable embed

`portable/optivue-growth-os.html`

A self-contained HTML + scoped CSS + vanilla JavaScript edition designed to work in environments that accept custom HTML/code, including Wix embeds and similar website builders.

Portable-edition principles:

- no npm requirement
- no build process
- no React/Tailwind dependency
- CSS scoped to `#optivue-growth-os`
- Optivue-prefixed classes/data attributes
- browser-native JavaScript first
- optional services fail gracefully
- no secrets embedded in client-side code

### 2. Modular production edition

`production/`

A maintainable static web application organized into HTML, CSS, ES modules, and assets. It can be hosted directly or later adapted into a framework without changing the product architecture.

## Current structure

```text
Optivue-OS/
├── portable/
│   └── optivue-growth-os.html
├── production/
│   ├── index.html
│   ├── css/
│   │   └── optivue.css
│   ├── js/
│   │   ├── optivue.js
│   │   ├── booking.js
│   │   ├── diagnosis.js
│   │   └── estimator.js
│   └── assets/
│       └── README.md
├── shared/
│   └── elements/
│       ├── optivue-growth-system.js
│       └── optivue-spotlight-card.js
├── adapters/
│   └── wix/
│       ├── home-page-code.js
│       └── pricing-page-code.js
├── backend/
│   └── README.md
├── docs/
│   ├── architecture.md
│   ├── implementation-plan.md
│   └── reference/
│       └── source-map.md
├── .gitignore
└── README.md
```

## Conversion paths

- **Request a Custom Proposal** → Calendly
- **Get Your Free Audit** → Growth Diagnosis → Results → booking CTA
- **Get Started / Book A Discovery Call** → Calendly

Calendly:
https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit

## Architecture rule

The portable front end must remain functional with standard HTML5, CSS3, and ES6+ JavaScript. Node.js or server-side code belongs behind an API boundary and is used only when persistence, secrets, CRM integrations, or protected API calls require it.

See:

- `docs/architecture.md`
- `docs/implementation-plan.md`

## Status

The repository now includes an integrated first-pass Growth OS UI based on the supplied Stitch exports and custom JavaScript references.

Implemented in the current feature work:
- cinematic connected-system hero
- responsive navigation and theme handling
- five-stage Growth System inspector
- verified-project Transformation layout
- filterable Work Lab
- pricing and ownership model
- five-step qualitative Growth Diagnosis
- interactive Project Estimator
- accessible Calendly booking modal
- generated one-file portable bundle
- Wix/Velo adapter layer

See `docs/reference/source-map.md` for how visual/code exports are mapped into production and which generated claims must remain reference-only.
