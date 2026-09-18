# Growth OS Lead Intake Relay

This folder contains a lightweight server-side relay template for Growth OS lead submissions.

## Why use a relay

Do not expose a raw Make webhook URL or secret-bearing integration endpoint in browser JavaScript.

The public site should submit to a controlled endpoint such as:

`https://api.optivuedigital.com/growth-os/intake`

The relay then forwards the validated payload to Make using the private `MAKE_WEBHOOK_URL` environment secret.

## Current status

A draft Make scenario exists for the Growth OS intake, but the connected Make organization/team is currently paused because its operations or data-transfer limit has been exceeded.

Until that is resolved:

- keep `production/js/runtime-config.js` with `leadSubmissionEnabled: false`
- do not publish the raw Make webhook URL
- the lead form can still carry context into Calendly for the active session

## Required environment values

- `MAKE_WEBHOOK_URL` — private Growth OS Make webhook
- `ALLOWED_ORIGIN` — final Growth OS site origin, e.g. `https://growth.optivuedigital.com`

## Activation sequence

1. Resolve Make account/team limit.
2. Put the Growth OS Make webhook into learning mode.
3. Send the normalized sample payload from `docs/prospect-journey.md`.
4. Map learned fields into the existing Optivue Intelligence Sheet.
5. Activate the Make scenario.
6. Deploy this relay with `MAKE_WEBHOOK_URL` stored as a secret.
7. Set `production/js/runtime-config.js` to the relay URL and enable lead submission.
8. Run an end-to-end test with a non-production test lead.
