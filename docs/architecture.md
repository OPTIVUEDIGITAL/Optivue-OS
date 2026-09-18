# Optivue Growth OS Architecture

## Objective

Build one connected digital ecosystem for Optivue Digital and Rahmel Dela Cruz that simultaneously functions as:

1. Interactive Digital Growth Portfolio
2. Business Transformation Showcase
3. Growth Diagnosis Platform
4. Project Estimation Tool
5. Pricing Experience
6. Lead-Generation System

These are business functions of one product, not separate mini-sites.

## Experience architecture

```text
Portfolio ───────────────┐
Transformations ─────────┤
Growth System ───────────┤
Diagnosis ───────────────┤
Estimator ───────────────┤
Pricing ─────────────────┤
Booking Intent ──────────┤
                         ↓
                Prospect Context
                         ↓
               Explicit Lead Capture
                         ↓
                Secure Intake Relay
                         ↓
                 Intelligence System
                         ↓
                 Sales Conversation
```

## Shared prospect context

Canonical browser module:

`production/js/context.js`

It maintains:

- business context
- diagnosis inputs/results
- estimator selections/recommendation
- viewed Work Lab items
- viewed Transformations
- viewed Growth System stages
- pricing-plan interactions
- proposal intent
- booking intent
- explicit consent
- in-memory identity

### Privacy boundary

Session storage may contain anonymous/non-sensitive journey context.

Do not persist name or email to localStorage/sessionStorage.

Identity and consent remain in runtime memory unless the visitor explicitly submits them.

No PII should be transmitted simply because the visitor browsed, ran the diagnosis, or used the estimator.

## Function boundaries

### Interactive Digital Growth Portfolio
Primary UI: Work Lab.

Purpose: prove execution at the system/component level.

### Business Transformation Showcase
Primary UI: Transformations.

Purpose: explain business-level before → diagnosis → architecture → operational change.

### Growth Diagnosis Platform
Primary UI: Growth Diagnosis.

Purpose: classify bottlenecks and recommend the next system priority.

### Project Estimation Tool
Primary UI: Project Estimator.

Purpose: generate planning guidance about likely engagement, complexity, duration, and starting investment.

### Pricing Experience
Primary UI: Growth Starter / Accelerator / Lab.

Purpose: explain commercial models and ownership while responding to estimator context.

### Lead-Generation System
Primary UI: Save Your Growth Context + proposal / booking actions.

Purpose: package the prospect's actual journey into one contextual sales brief.

## Front-end delivery modes

### Production modular
`production/`

Canonical editable implementation.

Uses:
- HTML5
- CSS3
- ES modules
- Web Components
- browser-native APIs

### Portable embed
`portable/optivue-growth-os.html`

Generated from production.

No npm, React, Tailwind, or build step required.

## Backend boundary

The public browser must never contain private integration endpoints or secrets.

Preferred architecture:

```text
Growth OS
   ↓ HTTPS
Public intake relay
   ↓ private environment secret
Make / CRM / Intelligence Sheet
```

A relay template exists at:

`backend/lead-intake/worker.js`

## Existing Optivue Intelligence System

The current Google Form workflow already writes to the Optivue Intelligence Sheet and initializes eight diagnosis categories:

- Positioning & Offer Clarity
- Audience & Ideal Client Fit
- Competitive Differentiation
- Website & Conversion
- GBP & Local SEO
- Trust, Proof & Portfolio
- Tracking & Data Quality
- Lead Funnel & Follow-Up

The Growth OS real-time intake should feed that same intelligence system through a dedicated webhook pipeline while preserving the existing form workflow.

## Portability rules

- Scope embed CSS to `#optivue-growth-os`.
- Prefix app-owned CSS/data hooks with `ovgo-` / `ovgo`.
- Prefer browser-native APIs.
- Respect reduced motion.
- Optional integrations must fail gracefully.
- Never put private webhook URLs, credentials, or secret keys in browser code.
