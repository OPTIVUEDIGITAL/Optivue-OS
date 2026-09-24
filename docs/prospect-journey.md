# Unified Prospect Journey

## Primary journey

```text
Hero
→ Growth System
→ Transformations / Work Lab
→ Growth System Scope Estimator
→ Five-stage snapshot
→ Recommendation and preliminary path
→ Copy snapshot or open Calendly
```

Visitors may enter at any point. The experience should preserve context rather than force a fixed funnel.

## Context events

### Proof signals
- work_item_viewed
- transformation_viewed
- system_stage_viewed

### Commercial signals
- estimator_start
- estimator_result_view
- pricing_plan_viewed
- pricing_plan_selected

### Conversion signals
- lead_capture_started
- lead_submitted
- proposal_requested
- booking_opened

## Lead payload

The normalized payload should contain:

```json
{
  "version": "1.0",
  "source": "optivue-growth-os",
  "submittedAt": "ISO-8601",
  "identity": {
    "name": "",
    "email": "",
    "company": "",
    "website": ""
  },
  "business": {
    "industry": "",
    "primaryOffer": "",
    "serviceArea": "",
    "goal": "",
    "challenge": ""
  },
  "journey": {
    "workItemsViewed": [],
    "transformationsViewed": [],
    "systemStagesViewed": [],
    "pricingPlansViewed": [],
    "proposalIntent": false,
    "bookingIntent": false
  },
  "consent": {
    "contactConsent": false,
    "marketingContact": false,
    "submitted": false,
    "timestamp": ""
  }
}
```

## Privacy boundary

Anonymous interaction context may be stored locally in the browser.

Do not transmit identity or PII until the visitor explicitly submits a form.

The site should make it clear what is being submitted and why.

## Estimator journey

The Phase 1 estimator stores progress in versioned session storage. Results appear without identity fields. Clipboard sharing stays on the visitor's device. Fit Call clicks retain approved UTM parameters, and analytics receive categorical allowlisted values only.
