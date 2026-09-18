# Unified Prospect Journey

## Primary journey

```text
Hero
→ Growth System
→ Transformations / Work Lab
→ Growth Diagnosis
→ Diagnosis Result
→ Save / Request Full Roadmap
→ Project Estimator
→ Pricing Recommendation
→ Request Custom Proposal
→ Calendly
```

Visitors may enter at any point. The experience should preserve context rather than force a fixed funnel.

## Context events

### Proof signals
- work_item_viewed
- transformation_viewed
- system_stage_viewed

### Diagnostic signals
- diagnosis_started
- diagnosis_completed
- bottleneck_identified

### Commercial signals
- estimator_started
- estimator_completed
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
  "diagnosis": {
    "channels": [],
    "systems": [],
    "landing": "",
    "qualification": "",
    "followup": "",
    "statuses": {},
    "primaryBottleneck": "",
    "recommendedAction": ""
  },
  "estimator": {
    "primaryNeed": "",
    "complexity": "",
    "channels": [],
    "infrastructure": [],
    "urgency": "",
    "supportModel": "",
    "recommendedPlan": "",
    "startingInvestment": ""
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
