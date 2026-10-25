# Draft review, 25 October 2026

Implemented latest ownership/About copy, removed About founder caption, and removed the mobile channel transcript. The animated six-route map now ends at the founder footer. Kept the existing booking redirect behavior and URLs.

## Checks executed

- Draft build succeeds. 43 production asset references verified.
- 16 focused consent, GA4 loader, navy and map tests pass.
- Full legacy suite: 22 pass, 12 fail. Failures refer to pre-bundling production/js filenames. Full suite is not green.
- Default consent denies optional categories. Tests exercise acceptance, rejection, GPC, version/expiry, malformed records, withdrawal, preview exclusion and single GA4 initialization.
- Browser: banner/options at 320 and 375 outer frame widths, terms at 768, cookies at 1280. Scrollbar and frame border reduce content width by 17px. No document horizontal overflow in measured legal views.
- Reject persists after reload. Optional checkboxes start unchecked. Escape closes preferences and returns focus to Cookie settings.
- Privacy title clipping found and fixed with sticky legal-page header. Terms screenshot verifies revised spacing.
- Mobile dark map: zero transcript sections, six animated travellers, founder footer retained. Screenshot records final ending.
- Normal production build deliberately fails with 17 missing legal config fields. Draft build is explicit LEGAL_PREVIEW=1.

## Limits

No Lighthouse, real-device Safari/Firefox, production GA4 receipt, Calendly end-to-end booking, or network HAR audit ran. Local loader tests do not prove Google's downstream receipt. Complete desktop/mobile screenshots for every policy and every before/after state were not captured. Existing baseline light-token regression passes, but this is not pixel-diff certification.

## Owner confirmation before public release

Supply contact/privacy email, postal-address preference, governing law, dispute venue, response timeframe, four retention periods, actual vendor/account settings and transfer locations. Confirm booking notice, no-sale/sharing practices and children policy. Review all OWNER TO CONFIRM markers. These policies are a drafting baseline, not legal sign-off. No public/main deployment performed.

## Actual inventory

See INVENTORY.md and src/config/legal.ts. GA4 and optional journey context require analytics consent. Theme persistence and requested Calendly embed use functional consent. Estimator progress supports the visitor-requested workflow. Fonts and images are local. Dormant lead-capture code is not mounted and has no enabled endpoint. No marketing pixel, video or chat embed was found in the active bundle.
