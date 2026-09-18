# Cloudflare Deployment

## Final hosting model

```text
GitHub
  ↓
Cloudflare Workers Builds
  ↓
Cloudflare Worker + Static Assets
  ↓
www.optivuedigital.com
```

GitHub remains the source of truth.

Cloudflare Workers + Static Assets serves the production front end.

## Current staging deployment

Repository:

`OPTIVUEDIGITAL/Optivue-OS`

Production branch:

`main`

Cloudflare build settings:

- Build command: none
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Non-production branch builds: enabled
- Non-production deploy command: `npx wrangler versions upload`
- Cloudflare Access protection: off for public staging
- Build variables: none

Root deployment configuration:

`wrangler.jsonc`

Static asset directory:

`./production`

Staging hostname:

`https://optivue-growth-os.rahmeldc.workers.dev`

## Wrangler configuration

The root Wrangler configuration is the deployment source of truth.

It currently enables:

- Worker name: `optivue-growth-os`
- `workers.dev`
- version preview URLs
- static assets from `./production`

No runtime Worker script is required for the front end because Cloudflare can serve matching static assets directly.

## Production promotion

The `main` branch is the production branch.

Future workflow:

1. create feature branch
2. open PR
3. Cloudflare creates a non-production Worker version / preview
4. run visual and functional QA
5. merge to `main`
6. Cloudflare automatically deploys the production Worker

## Custom domain

Primary public hostname:

`www.optivuedigital.com`

Workers custom domains require an active Cloudflare DNS zone.

Before attaching the domain:

1. validate the `workers.dev` deployment
2. inventory every current Wix DNS record
3. preserve MX, TXT, verification, SPF, DKIM, and other service records
4. add `optivuedigital.com` to Cloudflare as a zone
5. migrate nameserver authority from Wix DNS hosting to Cloudflare
6. verify DNS and email behavior
7. attach `www.optivuedigital.com` to the Growth OS Worker as a Custom Domain
8. configure the preferred apex/www redirect

Domain registration can remain with Wix; only authoritative DNS hosting needs to move to Cloudflare for the Workers Custom Domain model.

Do not change nameservers until staging QA is complete and the current DNS inventory is captured.

## Security headers

The production site includes:

`production/_headers`

Workers Static Assets interprets this file natively.

It currently sets conservative static-site security headers without locking down third-party integrations such as Calendly or future analytics.

A stricter Content Security Policy should be added only after the final analytics, media, and API domains are known.

## Lead intake Worker

The secure lead relay remains a separate backend deployment.

Source:

`backend/lead-intake/worker.js`

Configuration template:

`backend/lead-intake/wrangler.jsonc`

Planned public endpoint:

`https://api.optivuedigital.com/growth-os/intake`

Private environment secret:

`MAKE_WEBHOOK_URL`

Do not deploy or enable lead submission until the Make Growth OS scenario is tested and active.

## Cloudflare connection status

The Cloudflare account and Workers Git deployment are now configured.

ChatGPT does not currently have a direct Cloudflare management connector in this conversation, so Cloudflare dashboard-only actions still require the account owner.

GitHub changes can be made from this conversation and Cloudflare should deploy them automatically through Workers Builds.
