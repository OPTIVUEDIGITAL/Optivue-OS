# Growth OS Lead Intake Relay

This folder contains the server-side relay for Growth OS lead submissions.

## Hosting target

Cloudflare Workers.

Planned public endpoint:

`https://api.optivuedigital.com/growth-os/intake`

## Why use a relay

Never expose a raw Make webhook URL or another secret-bearing integration endpoint in browser JavaScript.

The browser submits to the Worker.

The Worker validates the request and forwards it to Make using the private:

`MAKE_WEBHOOK_URL`

environment secret.

## Current status

The connected Make organization/team is currently paused because its operations or data-transfer limit has been exceeded.

Until Make is restored:

- keep `production/js/runtime-config.js` with `leadSubmissionEnabled: false`
- do not deploy a live Make destination
- do not publish the raw Make webhook
- the Growth OS can still carry session context into Calendly

## Cloudflare Worker config

Template:

`wrangler.jsonc`

Required runtime values:

- `MAKE_WEBHOOK_URL` — secret, never commit its value
- `ALLOWED_ORIGIN` — production site origin, eventually `https://www.optivuedigital.com`

## Activation sequence

1. Resolve Make account/team limits.
2. Put the Growth OS webhook into learning mode.
3. Send the normalized payload from `docs/prospect-journey.md`.
4. Map learned fields into the Optivue Intelligence Sheet.
5. Validate deduplication.
6. Activate the Make scenario.
7. Deploy the Cloudflare Worker.
8. Store `MAKE_WEBHOOK_URL` as a Cloudflare secret.
9. Configure `ALLOWED_ORIGIN`.
10. Point `runtime-config.js` to the Worker endpoint and enable lead submission.
11. Run an end-to-end non-production lead test.
