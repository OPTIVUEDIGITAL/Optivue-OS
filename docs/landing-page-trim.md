# Landing page trim

## Scope

Preview branch only. No merge or production deployment.

The page moves from 14 top-level sections to eight content sections plus the unchanged closing CTA (nine HTML sections total): hero, lead problems, ownership, How It Works, reporting, pricing, About, FAQ, then the closing CTA.

## Copy count

Before: 1,162 words. After: 637 words. Reduction: 525 words (45.2%).

The count includes navigation, page copy, FAQ questions, and footer. It excludes collapsed pricing breakdowns, FAQ answers, hidden menus, screen-reader duplicates, measurement text, sticky duplicate actions, scripts, and the closed booking modal. Words in image assets are not counted. The default headline is counted once. The reproducible standard-library counter is `scripts/count-visible-copy.py`.

Baseline: approved hero commit d8a6ea3a4be8c267788d8ff94cb2b40658b52e3d.

## Before → after

- Five removed sections: follow-up problems, interactive stage detail, appointment-business description, work examples, and Fit / Not a fit.
- “Diagnose. Build. Improve.” → “Audit. Fix. Grow.” with the three supplied steps and five non-interactive Growth OS chips.
- Reporting explanation → “See what your reports are missing.” and “See which ads, calls, and forms turned into booked visits.”
- Ownership body → the two supplied short paragraphs. Table unchanged.
- About body → the three supplied short paragraphs. Heading, photo slider, and caption unchanged.
- Fit section → first FAQ item, “Is Optivue a fit for my clinic?” with the supplied answer.
- H1 → exactly one static sentence. Animated display sits outside H1 with aria-hidden. Measurement phrases use data attributes and CSS generated content, never DOM text nodes.

## Preserved

Pricing and breakdown markup, audience section and estimator link, final CTA, footer, ownership comparison table, and both slider elements match the previous version. Hero copy, proof, signature, and links remain unchanged. No design tokens or dependencies added.

## Verification

68 unit tests. Static hero/pricing generation checks. Existing contrast checks. Browser QA checks heading accessibility, complete phrase cycles, CTA position, CLS, responsive overflow, reduced motion, no-JS behavior, pricing interactions, estimator, and Lighthouse.
