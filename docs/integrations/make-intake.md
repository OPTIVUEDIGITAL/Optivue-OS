# Make Integration — Growth OS Intake

## Objective

Connect the standalone Growth OS lead-generation layer to the existing Optivue Client Intelligence & Diagnosis System without replacing the current Google Form workflow.

## Existing intake

Existing scenario:

`LIVE - Optivue | 01 Intake → Intelligence Sheet`

It currently:

1. watches Google Form discovery responses
2. appends mapped responses to the Intelligence Sheet
3. initializes Diagnosis Inputs
4. deduplicates intake and diagnosis rows

The existing workflow uses the current Optivue discovery form and should remain unchanged.

## Staged Growth OS intake

A separate Make scenario has been created:

`DRAFT - Optivue | Growth OS → Intelligence Sheet`

It currently contains only a generic webhook trigger and remains inactive.

The private webhook URL is intentionally **not stored in this repository**.

## Normalized payload

The website contract is documented in:

`docs/prospect-journey.md`

It combines:

- identity
- business context
- diagnosis
- estimator
- journey intent
- explicit consent

## Current blocker

The connected Make organization/team is currently paused because its operations or data-transfer allowance has been exceeded.

Because of that:

- webhook schema learning could not complete
- downstream Sheets mappings were not added
- the Growth OS webhook scenario remains inactive
- browser lead submission remains disabled

This is an account-state blocker, not a front-end code failure.

## Safe current behavior

`production/js/runtime-config.js` keeps:

`leadSubmissionEnabled: false`

The Growth OS can still:

- retain anonymous journey context during the session
- show diagnosis results
- show estimator recommendations
- indicate likely-fit pricing
- collect identity in memory
- prefill available Calendly identity fields
- continue to booking

It does not claim a lead was saved when the backend is unavailable.

## Activation procedure

After Make limits are restored:

1. verify the draft Growth OS intake scenario is still inactive
2. start webhook learning
3. send one representative normalized payload
4. inspect the learned schema
5. map compatible fields into the existing Discovery Responses structure
6. initialize the existing eight Diagnosis Inputs categories
7. reuse or reproduce the current deduplication rules
8. add a controlled webhook response
9. run test payloads
10. activate the scenario
11. deploy the secure relay
12. store the private webhook URL only as a server-side environment secret
13. configure the public relay URL in `runtime-config.js`
14. enable lead submission
15. perform a full end-to-end test

## Security rule

Never expose the Make webhook URL in:

- GitHub source
- browser HTML
- browser JavaScript
- portable embed code
- public documentation
