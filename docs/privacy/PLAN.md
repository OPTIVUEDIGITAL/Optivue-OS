# Legal pages and consent

Base: latest selected review branch, which already includes merged PR #44. Static HTML/ES modules and esbuild, not Next.js. Preserve existing CTA URL, estimator route, active redirect logic, fonts and design tokens. The attachment's disabled-redirect assumption is stale; no redirect enablement or rewrite.

1. Audit actual storage, scripts, forms and endpoints.
2. Apply the two explicitly requested copy updates, using the latest About revision.
3. Add typed central config, policy generator and production completeness gate. Keep unknown owner details null; preview displays OWNER TO CONFIRM, production fails.
4. Add dependency-free basic consent mode, real GA4 gates, equal banner choices, accessible preferences, six-month record, GPC and withdrawal cleanup. Gate optional journey storage and persistent theme preference.
5. Preserve click-only Calendly iframe. Add its privacy notice and a first-use Continue action because third-party cookie behavior cannot be guaranteed from local source.
6. Validate unit behavior, build, mobile/desktop UI and draft policies. Publish private review only. Open draft PR against the existing review branch. No main or customer-domain deployment.
