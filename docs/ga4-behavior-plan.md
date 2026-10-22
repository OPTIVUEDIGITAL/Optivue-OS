# Growth OS measurement plan

Status: implemented in the private review copy. Production activation and GA4 property receipt remain unverified.

Measurement ID: G-9XBD3QZ5BQ. Production host: growth.optivuedigital.com. Preview traffic stays local.

| Event | Trigger and parameters | Decision supported |
|---|---|---|
| page_view / user_engagement | Existing Google tag. Production domain only. | Landing-page traffic and engagement. |
| scroll_depth | 25, 50, 75, 90. Each once per page load, after scrolling. | How far visitors reach. Dynamic content changes page length. |
| section_view | section_id. Heading at least 50% visible for one continuous second in a visible tab. Once per page load. | Which sections appear on screen. Exposure is not proof of reading. |
| navigation_click / estimator_link_click | section_id, nav_location. One event per click. | Where visitors navigate and enter the estimator. |
| growth_map_interaction | action: details, overview, pause, resume, replay. Trusted same-origin frame only. | Use of the workflow explanation. |
| pricing_breakdown_open | tier, device. Existing handler, now forwarded to GA4. | Which scope visitors explore. No second click handler. |
| faq_open | faq_id. Fires when an answer opens. | Common questions and concerns. |
| system_stage_select / reporting_compare | stage / input_method. Slider interaction once per page. | Interest in process and reporting evidence. |
| theme_change / mobile_menu_toggle | theme / action. | Display preferences and mobile navigation use. |
| book_fit_call_click / request_audit_click | cta_location. Existing booking handler. | Booking intent by CTA placement. |
| booking_modal_close | action: escape, button, backdrop. | Booking exits. A close is not proof of abandonment. |
| calendly_step_view | step: event_type, date_time, scheduled. Once each per page, validated source and origin. | Progress through supported Calendly embed messages. Never sends invitee payloads. |
| fit_call_booked | booking_source: calendly. Existing thank-you marker and per-tab deduplication. | Booking conversion proxy. The URL marker is not server-verified confirmation. Confirm against Calendly records. |
| estimator_view / estimator_start / estimator_resume / estimator_complete / estimator_restart | No custom answer values. | Estimator funnel and repeat attempts. |
| estimator_question_answered / estimator_back | question_number only. Repeated answers count as interactions. | Step drop-off and backtracking without business answers. |
| estimator_stage_expand / estimator_cta_click | stage / cta from fixed allowlists. | Result exploration and next actions. |

## GA4 property setup and release checks

1. Register event-scoped custom dimensions: section_id, nav_location, action, tier, faq_id, stage, cta, cta_location, step, question_number, theme, input_method, booking_source. Use the existing Percent scrolled dimension for percent_scrolled and GA4 device category for devices. Do not duplicate definitions already present.
2. Keep enhanced measurement page views and existing scroll measurement. Google scroll records 90% only. Use the custom scroll_depth event consistently for the four milestones and do not sum scroll plus scroll_depth. Audit enhanced form and search collection for unwanted free-text data before release.
3. Mark fit_call_booked as the primary key event if not already configured. Keep CTA clicks and section views as diagnostic events, not equivalent conversions.
4. Build a funnel: page_view → book_fit_call_click OR request_audit_click → calendly_step_view → fit_call_booked. Separate funnel: estimator_view → estimator_start → estimator_question_answered → estimator_complete → estimator_cta_click. Compare device category and session source / medium.
5. Build a section reach report and pricing/FAQ interaction report. Compare rates using exposed users as denominator. Section exposure is not causation. Establish a baseline before changing copy.
6. After approval to release the redesign to the real domain, test desktop and mobile in GA4 DebugView with the Google Analytics Debugger and a developer-traffic filter. Check the measurement ID, event values, duplicate prevention, and network collection requests. Turn debug mode off after QA.
7. Verify Realtime and subsequently processed reports. Custom dimensions typically require 24–48 hours after setup to appear in reporting. Reconcile booking counts with Calendly. Do not make dummy bookings without explicit approval.
8. Test blocked analytics and unavailable storage: the website must still work. Consent choices, content blockers and network failures prevent complete measurement. Do not promise 100% visitor coverage.

## Privacy and implementation boundaries

Custom GA4 parameters use fixed enums or question numbers. No names, email addresses, phone numbers, patient information, form answers, free-text questions, raw link URLs, or Calendly payloads are forwarded. Existing conversion names remain intact. One sender handles production events. No duplicate Google tag is added. Map events route through the parent page. Scroll events use a passive listener and one animation-frame callback. Section views use IntersectionObserver and a one-second timer. The new About image uses WebP, explicit dimensions, lazy loading and the full uncropped aspect ratio.

## Verification evidence

24 targeted automated checks passed for analytics, privacy, deduplication, scroll milestones and routes. Browser interaction checks and private deployment are verified separately. GA4 Admin settings and receipt in the live property have not been verified in this task.

## Official references

- https://support.google.com/analytics/answer/9216061
- https://developers.google.com/analytics/devguides/collection/ga4/events
- https://support.google.com/analytics/answer/14240153
- https://support.google.com/analytics/answer/7201382
