# Landing-page trim and copy fixes

Branch: feat/landing-trim-copy. Based on main 831e2f321ea8a5b7598ffda041c4eadedc2f90bf (local equivalent tree a49020e68c2f3026739e31f2e700c799608e2760). Preview only; no merge or production deployment.

## Trim
Five sections removed: follow-up bullet section, appointment-business description, What I build, interactive stages, and Fit / Not a fit. How It Works is Audit. Fix. Grow. with five static chips. Reporting, ownership, and About use the approved short copy. Fit question is the first FAQ. FAQ JSON-LD regenerated to match all seven visible questions.

Eight content sections plus the unchanged final CTA (nine top-level HTML sections).

## Before → after copy
- You pay software directly → You pay for software directly.
- at the provider's rates → at the providers' rates.
- Three ways to start. → Three ways to work together.
- Every plan starts with an Audit of your clinic's lead follow-up. All prices in USD. → Every plan starts with an Audit. All prices in USD. (Latest owner instruction supersedes prior SEO subheading.)
- Fix your main landing page or booking path. → I fix your main landing page or booking path.
- Fix tracking for calls, forms, and bookings. → I fix tracking for calls, forms, and bookings.
- approvals within 2 business days, one staff contact → approvals within 2 business days, and one staff contact.
- extra pages or locations, CRM data migration → extra pages or locations, and CRM data migration.
- Ad spend, new locations or service launches, major rebuilds. → Ad spend, new locations or service launches, and major rebuilds.
- billed monthly in advance, month-to-month. → billed in advance. Month-to-month.
- Lower setup because we keep working together. → Lower setup fee, because we keep working together.
- qualified leads, booked calls, and revenue → qualified leads, booked visits, and revenue.
- 8 years working → Eight years working.
- health, wellness and aesthetics → health, wellness, and aesthetics (schema); hero eyebrow receives the serial comma.
- hours, services and photos → hours, services, and photos (estimator quick win).
- forms, CRM, follow-up, booking and reports → forms, CRM, follow-up, booking, and reports (estimator result).
- Prose numerals: Up to 3 channels → Up to three channels; How 3 nearby competitors → How three nearby competitors; Up to 3 agreed changes → Up to three agreed changes; Up to 1 hour → Up to one hour; reply within 1/2 business days → reply within one/two business days. Timeline/spec values retain numerals.
- Audit from $800 / one-time → $800 / one-time · one location.
- Fix from $5,000 → separate From label above $5,000.
- Fix + Grow from $3,500 setup / then $2,000/month → separate From label above $3,500 setup / $2,000/month.

Items 9–11 target lists removed by the approved trim. They are not restored. The replacement Fit FAQ keeps its approved wording.

## Preserved
Typewriter config, timing, order logic, caret, reduced-motion fallback, and generated H1 are unchanged. Both slider elements and assets remain unchanged. Pricing interaction component and booking CTA remain unchanged. No price amounts, design tokens, runtime dependencies, or hosting settings changed.

## Modal
“Find the next priority” is the booking dialog title. The × is a separate close button. Their ancestor has hidden, with .ovgo-modal[hidden] { display:none }. They are absent from the default visible page.

## Verification
74 unit tests pass. Hero, pricing, prices, SEO, and token generation checks pass. Contrast checks pass (minimum 4.58:1). Forbidden public strings have zero matches.

Visible copy: 1,168 → 641 words (527 fewer, 45.1%). Includes nav and footer; excludes collapsed pricing panels, FAQ answers, hidden controls, measurement strings, and image text. Reproduce with scripts/count-visible-copy.py.

Production deployment 89168d50 still reports failure at asset upload, code 10013. This branch does not claim to resolve that separate hosting issue.

Browser verification: 390/768/1440px pass for no overflow, exact H1, hidden default modal, one pricing CTA, exclusive panels, and booking isolation. Pricing/estimator acceptance at 390/1440px passes all result paths and clipboard pricing. Screenshots saved as shots/trim-copy-{width}.png.
