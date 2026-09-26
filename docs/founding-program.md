# Founding Clinic pricing

## Source of truth

Edit `founding` in `production/js/estimator-config.js`. Cards, breakdown additions, FAQs, the hero link, estimator guidance, and copied snapshots use this config. The previous runtime-config founding settings have been removed.

- `enabled`: `true` to offer founding prices, `false` to turn the program off.
- `spotsTotal`: 3.
- `spotsRemaining`: starts at 3. Change this manually when a clinic takes a spot. It never decreases automatically.
- `endDate`: `2027-01-31`. This date is inclusive through 23:59:59.999 UTC. Standard pricing starts February 1 at 00:00 UTC (08:00 in Manila).
- `prices`: Diagnostic 750, Foundation 5000, Operations 2500, in USD.
- `standardAmounts`: standard numeric amounts used for future-price notes and totals. Keep these aligned with `prices` display strings in the same config.
- `operationsFoundingMonths`: 6. This is each clinic's first six months, not six months from the public end date.
- `heroEnabled`: true. Turn off only the hero line with false.
- `countries`: US, UK, Canada, Australia.

## Updating the program

1. Edit the config on `feat/estimator-v2`.
2. Run `node scripts/build-pricing.mjs` then `node scripts/build-founding.mjs`.
3. Run `node --test`, both build commands with `--check`, `node scripts/build-tokens.mjs --check`, and `python3 scripts/contrast.py`.
4. Commit generated `production/index.html` with the config changes. Push the feature branch, review the Cloudflare preview, and approve production separately.

Wrangler's build command also runs both generators before a version upload or deployment. No dependencies, storage products, or paid Workers features are added.

## Automatic ending

The program is active only if enabled, spots remain, and the current UTC date has not passed the deadline. The build renders founding content into HTML when active. The client rechecks at load, the deadline, and when the tab regains focus or visibility. It removes every founding region and restores standard card and estimator prices when inactive. Open estimator results also refresh. There is no visible countdown.

A static page loaded with JavaScript disabled cannot change after an already-built deadline. Rebuild after changing config or ending the program so its static HTML also reflects standard pricing. The client date safeguard covers existing pages with JavaScript enabled.

This changes public pricing guidance, not billing. Confirm each clinic's six-month Operations rate and later standard rate in its agreement. No charges, refunds, or CRM actions run automatically.

## Eligibility and commitments

Single-location health, wellness, or aesthetics clinics in the four listed countries qualify. Multi-location setups receive standard custom proposals. The estimator does not ask country, so founding estimates remain subject to this eligibility. Per the owner's requested custom-scope behavior, custom results show only a founding Diagnostic row and the eligibility note.

Clinics choose named or anonymized results and approve final wording. They share baseline and day-90 numbers and attend a 20-minute day-90 feedback call. No positive review is required. No patient information is published.

## ON and OFF states

ON: hero link, 3-of-3 banner, agreement disclosure, three founding card prices and future-price notes, three breakdown additions, three FAQs, and founding estimator labels. Diagnostic $750; Foundation from $5,000; Operations $2,500/month for six months, then $3,500/month. B and D first-90-day total: from $5,750. Systems Care remains $350/month.

OFF (disabled, zero spots, or expired): all founding regions disappear. Cards and estimator use Diagnostic $1,500, Foundation from $7,500, and Operations from $3,500/month. B and D total: from $9,000. Systems Care remains $350/month.

## Copy review: before → after

- Hero: no program link → “Founding Clinic pricing: 3 of 3 spots open →”.
- Pricing: no banner → “Founding Clinic pricing” and “3 of 3 spots open · until January 31, 2027”, eligibility, and agreement disclosure.
- Diagnostic: “$1,500” → “$750”, “founding price”, “Standard $1,500 once founding spots fill”.
- Foundation: “From $7,500” → “from $5,000”, “founding price”, “Standard from $7,500”.
- Operations: “From $3,500” → “$2,500”, “founding price”, “per month for 6 months, then $3,500”.
- Care: “Need upkeep only? Systems Care from $350/month.” → “Just need upkeep? Systems Care, $350/month.”
- Breakdowns: approved content retained, with the requested founding-price block above the existing content.
- Estimator: standard path cards → a likely-path table with founding labels, future-price notes, eligibility, program line, and first-90-day totals.
- FAQ: three program questions added only while active.

## Analytics

Hooks use the existing dataLayer/custom event path. New events: `founding_banner_view`, `founding_terms_toggle` with `state: open|closed`, and `founding_hero_click`. Pricing and estimator events include the current boolean `founding_active`. No new third-party scripts or personal data fields are added.
