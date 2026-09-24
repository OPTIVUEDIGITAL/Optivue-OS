# Growth System Scope Estimator admin guide

## Source files

- Questions, answer values, prices, status presentation, quick wins, noted-insight timing, and Phase 2 acceptance items live in `production/js/estimator-config.js`.
- Thresholds, ordered result rules, stage calculations, result copy assembly, session recovery, and clipboard output live in `production/js/estimator.js`.
- The confirmed Calendly URL and UTM forwarding live in `production/js/booking.js`.
- The standalone page and static SEO tags live in `production/estimator/index.html`.
- The `/diagnosis` redirect lives in `production/_redirects`. The estimator noindex response header lives in `production/_headers`.

## Editing controls

- Edit questions in `ESTIMATOR_CONFIG.questions`. Keep each field ID stable after launch so saved session data and analytics stay consistent.
- Edit thresholds in `getEstimatorResult`. Rule order matters because the first match wins.
- Edit prices only in `ESTIMATOR_CONFIG.prices`. Homepage pricing and estimator paths read the same values.
- Edit result copy in `RESULT_COPY`. Result E must end with “If your needs change, I'd be glad to hear from you.”
- Edit quick wins in `ESTIMATOR_CONFIG.quickWins`.
- Edit the Calendly URL in `production/js/booking.js` after the 20-minute Fit Call event URL is confirmed.
- To disable the estimator, remove its homepage links and add a temporary redirect from `/estimator` to `/`. Keep `/diagnosis` redirected away from the retired tool.

## Phase 1 privacy

Phase 1 uses static assets, `_redirects`, `_headers`, session storage, clipboard access, and client-side JavaScript. Questions collect no personal information. Clipboard output includes stages, recommendation, and path only. Estimator analytics accept categorical allowlisted fields and exclude names, email addresses, phone numbers, URLs, and free text.

## Cloudflare Workers Free plan boundary

The owner will remain on the Cloudflare Workers Free plan.

- Phase 1 uses no paid Cloudflare feature.
- Phase 2 uses Turnstile and a honeypot as the primary spam controls.
- Verify account-level free-plan access before adding any Cloudflare rate-limiting feature. Skip unavailable paid rate limiting.
- The CRM stores submissions and sends snapshot emails through its workflow.
- Use no KV, no D1, no Durable Objects, no R2, and no Queues for estimator submissions.
- Keep webhook and CRM secrets in Worker environment variables. Never place secrets in client-side code.

## Phase 2 acceptance

- [ ] Repository privacy confirmed before server integration.
- [ ] Email snapshot form uses Turnstile, honeypot, and server-side delivery.
- [ ] Free-plan availability checked before any rate-limiting feature is added.
- [ ] Transactional snapshot email sent by the CRM workflow.
- [ ] Send a Note restored on Result E.
