# Audit / Fix / Fix + Grow

Updated September 28, 2026. Feature branch only; no production release.

## Source of truth

- `production/js/estimator-config.js`: prices and estimator recommendations. `founding.enabled` is false. The retired program has no public renderer.
- `production/js/pricing-config.js`: approved panel content. Monthly payment figures reference the shared pricing config.
- `node scripts/build-pricing.mjs && node scripts/build-prices.mjs`: regenerate static panels and prices. Wrangler runs both before generating a preview.
- Internal keys `diagnostic`, `foundation`, and `operations` remain stable to preserve the existing component, analytics, and saved questionnaire state. Public labels use the new offer names.

## Before → after

| Surface | Before | After |
|---|---|---|
| Pricing heading | Three steps. Clear prices. | Three ways to start. |
| Subheading | Start with a Diagnostic. All prices in USD. | Every plan starts with an Audit. All prices in USD. |
| Offer 1 | Growth Systems Diagnostic | Growth Systems Audit, from $800 one-time |
| Offer 2 | Foundation Launch | Growth System Fix, from $5,000 one-time, 4–6 weeks |
| Offer 3 | Growth Operations | Growth OS Partnership, from $3,500 setup, then $2,000/month |
| Booking action | Request a Diagnostic | Request an Audit |
| Program surfaces | Banner, hero link, spots, price notes, three FAQs | Removed |
| Credit | Optional policy flag | Public Audit credit toward Fix or Fix + Grow within 30 days |
| Care | Just need upkeep? | Need upkeep only after a Fix? Systems Care, $350/month. |

The three panels contain the owner's supplied Part D copy. Fix and Fix + Grow begin with the approved italic scope line. The existing Systems Care panel remains unchanged. Fit / Not a fit, About, remaining FAQs, final CTA, and footer remain unchanged except the requested Diagnostic → Audit rename and grammar adjustment from “a” to “an.”

## Behavior

The existing `pricing.js` component is unchanged. Desktop begins with Audit selected; mobile starts collapsed. Mobile opens one panel at a time, including Systems Care. Desktop uses arrow-key tabs and a full-width panel. The booking button remains outside the trigger. Static HTML includes all four expanded panels for visitors without JavaScript.

## Estimator

- A: Audit only.
- B and D: Audit → Fix. “Typical first step: $800 Audit, then from $5,000 (Audit credited)”.
- C: Audit → Fix + Grow. “from $3,500 setup, then $2,000/month (Audit credited)”.
- Custom: Audit only. “Scope and investment set after the Audit.”
- E: existing guidance and homepage link only.
- B, C, D include the 30-day credit note. Clipboard text uses these same prices and notes.

## Verification

Run `node --test`, `node scripts/build-pricing.mjs --check`, `node scripts/build-prices.mjs --check`, `node scripts/build-tokens.mjs`, and `python3 scripts/contrast.py`.

GitHub Design QA runs existing responsive, mobile and Lighthouse checks, plus pricing acceptance at 390, 768, 1023, 1024 and 1440 pixels. It tests touch on mobile, mouse on desktop, keyboard controls, booking isolation, no-JavaScript panels, and all estimator paths. Screenshots are saved in the run's `optivue-design-qa` artifact.
