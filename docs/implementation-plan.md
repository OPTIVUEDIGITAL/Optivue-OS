# Optivue Growth OS Implementation Plan

## Current state

### Completed foundation
- standalone GitHub-controlled architecture
- cinematic hero
- responsive navigation
- dark/light theme
- Growth System visualizer
- Transformations
- Work Lab
- pricing and ownership comparison
- five-step Growth Diagnosis
- Project Estimator
- Calendly booking modal
- generated portable one-file edition

### Completed unified ecosystem layer
- shared prospect-context store
- Diagnosis → shared context
- Estimator → shared context
- Work Lab → journey context
- Transformations → journey context
- Growth System → journey context
- Pricing → journey context
- estimator-informed likely-fit pricing state
- proposal and booking intent
- contextual lead-capture experience
- privacy-safe session persistence
- secure intake relay template

## Phase 1 — Product proof refinement

Next:
- expand real Work Lab evidence
- deepen Transformation detail views
- add verified assets/screenshots
- ensure each project clearly separates evidence from unsupported claims

## Phase 2 — Commercial intelligence

Next:
- refine estimator pricing logic and assumptions
- connect diagnosis categories to recommended system capabilities
- improve pricing explanation based on diagnosed/estimated needs
- define proposal-scope payload from prospect context

## Phase 3 — Real-time lead intake

Current blocker:
the connected Make organization/team is paused because its operations or data-transfer limit has been exceeded.

After that account limit is resolved:

1. put the staged Growth OS webhook scenario into learning mode
2. send the normalized payload documented in `prospect-journey.md`
3. verify the learned structure
4. append compatible fields to the existing Discovery Responses sheet
5. initialize Diagnosis Inputs using the same eight-category framework
6. add deduplication
7. validate webhook response behavior
8. activate the Make scenario
9. deploy the secure relay with the webhook stored as a secret
10. set `leadSubmissionEnabled: true` only after end-to-end testing

The existing Google Form intake should remain operational and unchanged.

## Phase 4 — Analytics

Add GA4/GTM event schema for:
- work_item_viewed
- transformation_viewed
- system_stage_viewed
- diagnosis_started
- diagnosis_completed
- bottleneck_identified
- estimator_started
- estimator_completed
- pricing_plan_viewed
- lead_capture_started
- lead_submitted
- proposal_requested
- booking_opened

Do not send PII to analytics.

## Phase 5 — QA

- desktop/tablet/mobile visual QA
- Safari/Chrome/Firefox testing
- keyboard navigation
- modal focus management
- reduced-motion testing
- contrast/WCAG AA review
- performance profiling
- portable custom-code testing
- lead-intake error/fallback testing

## Phase 6 — Launch

- merge stacked PRs in dependency order
- enable GitHub Pages / chosen static host
- choose production domain
- configure CNAME/DNS
- connect GA4/GTM
- activate lead relay
- run synthetic end-to-end lead test
- validate Intelligence Sheet output
- launch
