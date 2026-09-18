# Optivue Growth OS

Optivue Growth OS is the codebase for Optivue Digital's portable growth platform, interactive portfolio, diagnosis workflow, project estimator, pricing experience, and client-acquisition system showcase.

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
├── backend/
│   └── README.md
├── docs/
│   ├── architecture.md
│   └── implementation-plan.md
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

Repository scaffold created. The current UI files establish architecture and safe embed conventions; full Optivue Growth OS implementation follows in subsequent feature branches.
