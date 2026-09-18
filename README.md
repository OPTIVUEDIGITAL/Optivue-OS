# Optivue Growth OS

Optivue Growth OS is a unified digital ecosystem for **Optivue Digital** and **Rahmel Dela Cruz**.

It is designed to perform six connected business functions at the same time:

1. **Interactive Digital Growth Portfolio** — proves what was built and how the systems work.
2. **Business Transformation Showcase** — shows how client operations and growth infrastructure changed.
3. **Growth Diagnosis Platform** — helps prospects identify their highest-priority growth bottleneck.
4. **Project Estimation Tool** — lets prospects scope likely complexity, duration, and starting investment.
5. **Pricing Experience** — connects service tiers to the prospect's diagnosed and estimated needs.
6. **Lead-Generation System** — turns the visitor's actual Growth OS journey into a contextual sales conversation.

The product is intentionally one connected system, not six unrelated website widgets.

## Core journey

```text
Understand Optivue
      ↓
See Proof
      ↓
Explore Transformations
      ↓
Diagnose the Business
      ↓
Estimate the Project
      ↓
Understand Pricing
      ↓
Save Growth Context
      ↓
Request Proposal / Book Discovery Call
```

Each step contributes to one shared prospect context so the visitor does not need to repeatedly start over.

## Production architecture

**Primary architecture: standalone, GitHub-controlled website.**

- GitHub is the source of truth.
- `production/` is the canonical public application.
- Cloudflare Workers + Static Assets is the primary front-end host.
- `wrangler.jsonc` points Cloudflare at `./production`.
- `portable/` is the generated one-file edition for custom-code environments.
- Wix is optional and isolated under `adapters/wix/`.
- Protected integrations remain behind a separate server-side API/relay boundary.
- Raw automation webhook URLs and secret keys must never be shipped in browser code.

See `docs/standalone-deployment.md` and `docs/cloudflare-deployment.md`.

## Unified prospect context

The production experience shares context across:

- Work Lab
- Transformations
- Growth System stages
- Growth Diagnosis
- Project Estimator
- Pricing
- Proposal intent
- Booking intent

Anonymous journey data may persist for the active browser session.

Name, email, and consent are not persisted into browser storage.

Personally identifiable information is only intended to leave the browser after explicit visitor submission.

See:

- `docs/product-spec.md`
- `docs/prospect-journey.md`
- `docs/architecture.md`

## Current structure

```text
Optivue-OS/
├── wrangler.jsonc
├── production/
│   ├── index.html
│   ├── _headers
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── css/
│   │   └── optivue.css
│   ├── js/
│   │   ├── optivue.js
│   │   ├── context.js
│   │   ├── runtime-config.js
│   │   ├── lead-capture.js
│   │   ├── booking.js
│   │   ├── diagnosis.js
│   │   ├── estimator.js
│   │   └── components/
│   │       ├── growth-system.js
│   │       └── spotlight-card.js
│   └── assets/
├── portable/
│   └── optivue-growth-os.html
├── shared/
│   └── elements/
├── adapters/
│   └── wix/
├── backend/
│   └── lead-intake/
└── docs/
```

## Conversion paths

### High intent
**Request a Custom Proposal** → booking experience

### Lower-friction entry
**Get Your Free Audit** → Growth Diagnosis → Results → save context / estimate → booking

### Commercial exploration
Estimator recommendation → likely-fit pricing plan → contextual lead capture → booking

Calendly:

https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit

## Backend status

The browser-side unified ecosystem is implemented.

A secure lead-intake relay template is also included under `backend/lead-intake/`.

Direct lead submission remains intentionally disabled until the real-time intake backend is fully verified and activated.

The existing Google Form → Optivue Intelligence Sheet workflow remains untouched.

See `docs/integrations/make-intake.md` for the current integration status.

## Content integrity

Never publish invented:

- case studies
- performance metrics
- testimonials
- ROAS
- conversion improvements
- revenue claims
- capacity / uptime telemetry

Where no verified metric exists, describe the operational transformation instead.

See `docs/reference/source-map.md`.
