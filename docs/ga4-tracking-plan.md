# Growth OS tracking and release review

## Current status, October 20, 2026

PR #44 merged with owner approval on October 20. Cloudflare deployed commit a16e41670ae71298b16c8b016b64d2cfbeea75ee. The live homepage matches the release byte for byte, contains one shared GA4 loader reference, and omits the two hero lines the owner requested removed. No other hero copy, design or pricing changed.

The live browser smoke test reached Google's collection endpoint for all five custom events, received HTTP 204 responses, counted one simulated booking, and suppressed its reload. A corrected QA run confirmed explicit debug parameters on outbound events. These checks prove browser transport, not GA4 DebugView receipt or a real appointment. No calendar appointment was created. Windsor's same-day aggregate query still returned no rows. Property 558572047 and web stream 16114331804 use G-9XBD3QZ5BQ. No new property was created.

Evidence: release run 39444494551, artifact 12275611098, and corrected live QA run 39446153128. The first QA parser checked only _dbg and did not record alternate debug fields. One synthetic booking was sent around 15:04 UTC (23:04 Manila). Its debug status is unverified, so exclude it from customer booking totals. Later runs require an explicit debug pageview before testing a conversion. Debug mode alone does not guarantee exclusion from standard reports unless a developer-traffic filter is active.

Automatic form_start was observed from enhanced measurement. GA4 dashboard review, developer-traffic filter status, key-event/custom-dimension setup, real booking tests, and the direct Calendly confirmation redirect remain unverified. Windsor exposes no GA4 settings write actions. Do not describe those account settings as completed.

## Event map

| Event | Exact trigger | Parameters sent | Deduplication | Optimization decision |
| --- | --- | --- | --- | --- |
| page_view | One gtag config on each production HTML document load | page_location without query/hash, referrer origin only | Shared loader guard, no second manual pageview | Which pages receive visits? |
| book_fit_call_click | A booking button opens the existing modal, excluding the Audit CTA | cta_location: nav, hero, final, footer, sticky, estimator, or unknown | One delegated listener per root, one event per intentional click | Which sections create booking intent? |
| request_audit_click | Growth Systems Audit CTA opens the modal | cta_location, normally pricing | Mutually exclusive with book_fit_call_click for that click | Does the offer produce interest? This is not a paid Audit sale. |
| estimator_start | Start the Estimate button begins the questionnaire | None | Resume does not fire start. Explicitly starting again can count another attempt. | Do estimator visitors begin? |
| estimator_complete | Loading finishes and the result renders | None | Reopening a saved result does not fire completion | Does the questionnaire retain visitors? |
| fit_call_booked | Top-level /thank-you loads with incoming src=calendly, after URL cleaning, on production only | booking_source: calendly | sessionStorage ov_fcb_sent, once per tab session | How many browser booking confirmations reach the site? |

Only the five listed custom event names go to Google. Existing local pricing/estimator UI notifications remain local and do not become GA4 custom events. Form answers, names, emails, phone numbers, invitee/event IDs and Calendly payloads are excluded from gtag calls. CTA locations use an enum and never accept arbitrary field values.

## Booking journey

- Embedded booking: verify both Calendly origin and the actual iframe window, require the open modal, then navigate the parent to /thank-you?src=calendly. No conversion fires in the message listener.
- Direct Calendly link: configure Calendly's external confirmation redirect to https://growth.optivuedigital.com/thank-you?src=calendly after the route is published.
- If Calendly redirects its iframe first, the thank-you loader promotes the clean fixed destination to the parent and returns without configuring GA4 inside the iframe.
- The top-level thank-you removes the entire query and hash before gtag config and overrides page_location with origin/pathname. An inability to clean the URL stops analytics initialization.
- sessionStorage access is wrapped. If reads or writes fail, skip the booking event, keep the page usable, and allow the sanitized pageview. A storage write probe runs before queuing the event; the sent flag is set after queuing.
- Static noindex/nofollow, no-store headers and no-referrer apply to the thank-you route. It is absent from the sitemap.

## Limits, read before interpreting reports

src=calendly is a public URL marker, not authenticated proof of a booking. Anyone visiting that marked URL can produce a count. Session deduplication suppresses a second genuine booking in the same tab session; another tab or device can count separately. Ad blockers, consent decisions, network failures, closed tabs and denied storage can undercount. A queued gtag command is not evidence of Google's receipt. Reconcile with Calendly's meeting records before reporting actual booked meetings.

This implementation is a browser funnel, not a CRM revenue integration. It does not establish qualified leads, attended calls, paid Audits or sales. Keep those outcomes in your CRM until a separate approved integration exists.

All page_location query strings and referrer paths are omitted to limit personal-data exposure. This can reduce campaign/referral detail. Existing UTM forwarding to Calendly is unchanged. Do not claim original email/LinkedIn campaign attribution for direct Calendly bookings until it is independently tested. booking_source=calendly identifies the booking tool, not the original acquisition source.

JavaScript URL cleaning happens after the first hosting request. Keep Calendly's “Pass event details to your redirected page” OFF to prevent private information reaching hosting logs in the first place. Account consent and enhanced-measurement settings need a separate dashboard check. Do not enable additional Google tags or Calendly's native Google Analytics integration alongside this installation without a duplicate-event review.

## GA4 dashboard setup, pending account access

1. Confirm the existing web stream G-9XBD3QZ5BQ; never create a second property.
2. Mark only fit_call_booked as the primary booking key event. Keep CTA clicks and estimator events as diagnostic steps.
3. Register event-scoped text custom dimensions cta_location and booking_source if absent. Inspect existing definitions first. These definitions are not retroactive.
4. Inspect enhanced measurement: disable automatic form interactions, site-search measurement and history-change pageviews for this booking funnel if enabled, then check for duplicate pageviews. Site-search collection can read search terms from the real browser URL even when page_location is sanitized. Keep email redaction enabled. Verify automatic outbound-link parameters do not capture sensitive URLs. Do not turn on ads personalization for this setup.
5. Create a funnel: page_view → book_fit_call_click OR request_audit_click → fit_call_booked. Use a separate estimator funnel: estimator page_view → estimator_start → estimator_complete → book_fit_call_click → fit_call_booked. Scope analyses to the same user/session appropriately; raw event totals are not unique visitors.
6. Compare device category, landing page, source/medium and cta_location only when the data exists. Report sample size and date range. Do not draw optimization conclusions from one or two conversions.

## Test checklist and acceptance

Automated Node tests exercise the actual loader/analytics/booking code with isolated browser boundary doubles. They check preview exclusion, duplicate loader execution, URL cleaning before config, marker gating, session repeats, denied storage (including read-only storage), frame promotion, iframe-origin/source validation, event allowlisting, parameter stripping and local pricing hooks. Existing regression tests must also pass.

Before merge:
- Run node --test tests/*.test.mjs, all three wrangler build steps, contrast audit, git diff --check.
- Compare homepage/estimator against LIVE_BASE after removing only the shared head script reference. All existing CSS, tokens, images, pricing and offer copy must be unchanged. The owner separately approved removal of the hero ownership/experience line and founder signature on October 20.
- Run design-qa in GitHub and inspect desktop/mobile screenshots and Calendly appearance. Previous PR #44 saw an inner iframe background change from the approved embed parameters. Obtain real mobile evidence before approval.
- Verify Cloudflare preview build and exact commit. Preview URLs must issue zero Google tag/collect requests. Do not promote a preview or manually deploy.

After publication approval, before declaring tracking complete:
1. Use Chrome with tracking blockers disabled for the test, and your normal required analytics consent. Use Tag Assistant's preview/debug session; do not install a second GA tag.
2. In Network inspect gtag/js and g/collect requests. Confirm tid=G-9XBD3QZ5BQ. On each fresh page load expect one page_view; no personal data in dl, dr or custom parameters.
3. Open every booking CTA once. Confirm one correct click event and the correct cta_location. Closing the modal must not count a booking.
4. Complete all nine estimator questions. Confirm one start and one completion. Reload/resume the saved result; no extra completion.
5. Make one authorized test booking through the website. Confirm top-level thank-you, removal of all query/hash, and one fit_call_booked in DebugView with booking_source=calendly. Reload/back/reopen the marked link in the same tab; no second booking event.
6. Open /thank-you directly without the marker; zero booking events.
7. Repeat a direct Calendly-link booking in a fresh tab/session and on a 390px/mobile device. Confirm actual redirect support on the current Calendly plan, email confirmation, and meeting entry.
8. Inspect denied-storage behavior. Page remains readable and no booking event is emitted when storage is unavailable.
9. Visit the Cloudflare preview; zero Google loads and collection requests, including the thank-you route.
10. Verify Realtime and DebugView receipt, then next-day standard reports. Reconcile test bookings against Calendly, label them as tests in the review log, and cancel test appointments only with authorization.

Evidence needed: commit and preview/build status, test outputs, desktop/mobile appearance, GA4 event screenshots or readback, sanitized network payload summary, real booking confirmation outcomes. Never include invitee details or credentials in evidence.

## Sources

- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developer.calendly.com/api-docs/overview/embedding/notifying-the-parent-window
- https://calendly.com/help/how-to-redirect-invitees-to-another-site-after-booking

Calendly's current help page lists external redirects for Professional, Standard, Standard Plus, Teams, Teams Plus and Enterprise plans. This account's entitlement is unverified. Do not buy an upgrade automatically. If unavailable, the embedded flow still has the parent-message redirect, but direct-link confirmation tracking is blocked pending a separate decision.
