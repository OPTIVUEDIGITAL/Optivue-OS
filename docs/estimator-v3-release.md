# Optivue Packages and estimator release

Source design: owner-private Optivue Packages concept, project appgprj_6adf6cf2f83c8191881e769462f3ce41, source baseline e6e2ba82ccf7ed24e4d6a9ca393f2f45c905e38f. GitHub main baseline ba089ebab1b16489453813377882eb08f6e7b043. This branch synchronizes the explicitly requested newer design, without merging unrelated draft branches.

The owner explicitly requested publication after the hero kicker and estimator implementation. Cookiebot was canceled. Existing custom consent controls remain.

## Changes
- Hero kicker is a paragraph above the unchanged typewriter H1. Growth Map remains second.
- Four-question quick check, immediate first question, no contact gate or automatic calendar.
- Deterministic Activation, Retention and Measurement results. Traffic sources are context, never automatically marked faulty.
- Native SVG with six channels, conditional review markers, pause and reduced motion. Mobile has readable simplified channel cards.
- Five optional scope questions, retained tab-session answers, exclusive unknown/none tools, copy fallback and custom multi-location path.
- Shared approved price configuration now drives homepage amounts and estimator. Audit from $800, Fix from $5,000, Partnership from $3,500 setup plus $2,000/month, USD. Maintenance remains quoted by scope on homepage, with no $350 recommendation in the new estimator. Audit credits remain disabled.
- Production GA4 host guard, consent gating, safe event parameters, existing single thank-you conversion source retained.
- Source build uses the approved preview's static ES module/esbuild pipeline. Wrangler still deploys static production assets through main-triggered Cloudflare Builds. No manual deploy or DNS change.

## Verification
- 25 release unit/mock/content checks pass. 53 asset references and minified chunks verified.
- Production route, asset, one-H1, metadata and indexing checks pass. Estimator and thank-you stay noindex. Homepage and finalized legal routes are indexable.
- Browser: full nine-question flow with cookies rejected, reload restores question, exclusive tools, researcher role and undisclosed budget accepted, Audit recommendation, copy fallback, pause toggle and dark theme verified.
- Result overflow checks at outer iframe widths 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pass. Actual content widths subtract the scrollbar. This is responsive iframe QA, not physical device certification.
- Existing 83 legacy baseline tests passed before source synchronization. Their old homepage copy, package structure, plain asset paths and estimator contracts no longer represent the approved design. Historical tests/scripts remain in the repository, and the old workflow is preserved at docs/legacy-design-qa.yml. The active workflow validates the current release contract. Old browser/Lighthouse checks were not claimed as passing for this redesign.
- Current build CSS: 21,024 gzip bytes. JS across all split chunks: 28,094 gzip bytes. These are bundle sizes, not LCP measurements.
- Not verified: real GA4 property receipt, a completed Calendly booking, external-calendar redirect, field speed, full screen-reader audit, OS-level reduced-motion interaction, 200/400% zoom and Search Console ownership. No synthetic booking was submitted.

## Measurement plan
All events require analytics opt-in. Google transport additionally requires growth.optivuedigital.com. No question answers, spend, contact data or copied snapshot enter GA4.

| Event | Trigger | Allowed fields | Uniqueness |
|---|---|---|---|
| estimator_view | Route initialized with consent | none | Once per page |
| estimator_start | First answer interaction | none | Once per assessment |
| estimator_question_answered | Continue submits a choice | question_number 1–9 | Once per distinct confirmed choice in assessment |
| estimator_quick_complete | Four answers submitted | none | Once per assessment |
| estimator_result_view | Quick/refined result shown | primary_stage, result_type | Once per result type |
| estimator_refine_start | Optional refinement chosen | none | Once per assessment |
| estimator_complete | All nine submitted | none | Once per assessment, retains legacy full-completion meaning |
| estimator_cta_click | Copy/refine/call/audit action | allowlisted cta | Once per click |
| estimator_snapshot_copy | Clipboard write succeeds | none | Once per successful copy |
| estimator_animation_toggle | Actual pause/play | action | Once per toggle |
| book_fit_call_click / request_audit_click | User opens booking | cta_location | Existing booking handler only |
| fit_call_booked | Calendar-marked thank-you | booking_source | Existing session deduplication, not server verification |

Suggested exploration: view → start → quick complete → refine start → complete → Fit Call click → booked. Treat quick-only exits separately. Never infer lift without received data.
