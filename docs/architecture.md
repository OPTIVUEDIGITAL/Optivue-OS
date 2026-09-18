# Optivue Growth OS Architecture

## Objective

Maintain one product experience with two delivery modes:

1. **Portable embed** — a self-contained HTML/CSS/vanilla-JS file for Wix and other custom-code environments.
2. **Production modular** — maintainable HTML/CSS/ES modules that can be hosted independently or adapted into another framework later.

## Portability rules

- No npm or build step is required for the portable edition.
- Scope all embed CSS to `#optivue-growth-os`.
- Prefix app-owned CSS classes, ids, data attributes, and JS globals with `ovgo-` / `ovgo`.
- Avoid global CSS resets inside the portable embed.
- Use browser-native APIs first: IntersectionObserver, requestAnimationFrame, localStorage, URL, fetch, dialog/focus patterns.
- Optional external services must fail gracefully.
- Never place secret keys in browser code.

## Product modules

- Cinematic hero
- Growth System visualizer
- Transformations
- Work Lab
- Pricing and ownership model
- Growth Diagnosis
- Project Estimator
- About / operating model
- Shared Calendly booking experience
- Light / dark mode
- Accessibility and reduced-motion states

## Conversion paths

- **Request a Custom Proposal** → Calendly
- **Get Your Free Audit** → Growth Diagnosis → Results → booking CTA
- **Get Started / Book A Discovery Call** → Calendly

## Backend boundary

Backend code is optional and lives outside the embed. Use it only for persistence, protected APIs, CRM integrations, or secret-bearing workflows.
