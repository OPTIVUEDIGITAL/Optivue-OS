# Cloudflare Deployment

## Final hosting model

```text
GitHub
  ↓
Cloudflare Workers Builds
  ↓
Cloudflare Worker + Static Assets
  ↓
growth.optivuedigital.com
```

GitHub remains the source of truth.

Cloudflare Workers + Static Assets serves the Growth OS front end.

The existing Wix marketing site remains on:

`https://www.optivuedigital.com/`

## Current deployment

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

Fallback hostname:

`https://optivue-growth-os.rahmeldc.workers.dev`

Branded production hostname:

`https://growth.optivuedigital.com`

## Wrangler configuration

The root Wrangler configuration is the deployment source of truth.

It enables:

- Worker name: `optivue-growth-os`
- `workers.dev` as a fallback
- version preview URLs
- static assets from `./production`
- custom domain: `growth.optivuedigital.com`

No runtime Worker script is required for the front end because Cloudflare serves the matching static assets directly.

## Verified domain state

The connected Wix account reports:

- Domain: `optivuedigital.com`
- Registrar: GoDaddy
- Current authoritative nameservers:
  - `ns47.domaincontrol.com`
  - `ns48.domaincontrol.com`
- Wix connection method: pointing
- Apex A record used by Wix: `185.230.63.107`
- `www` CNAME used by Wix: `pointing.wixdns.net`

This means the domain is not registered at Wix and does not need to be transferred away from Wix.

## Custom-domain activation

Cloudflare Workers Custom Domains require an active Cloudflare DNS zone.

Before merging the custom-domain configuration to `main`:

1. Inventory all current GoDaddy DNS records, especially MX, TXT, SPF, DKIM, DMARC, verification, SRV, and any existing subdomains.
2. Add `optivuedigital.com` as a Cloudflare DNS zone.
3. Recreate or confirm every required DNS record in Cloudflare.
4. Preserve the Wix website records:
   - apex A → `185.230.63.107`
   - `www` CNAME → `pointing.wixdns.net`
5. Change the domain nameservers at GoDaddy from the current GoDaddy nameservers to the two nameservers assigned by Cloudflare.
6. Wait until Cloudflare marks the zone Active.
7. Merge the branded-domain PR.
8. Cloudflare Workers Builds deploys `main` and Wrangler attaches `growth.optivuedigital.com` to the Worker.
9. Verify:
   - `https://www.optivuedigital.com/` still loads the Wix site
   - business email still sends and receives
   - `https://growth.optivuedigital.com/` loads the Growth OS
10. Keep `workers.dev` enabled until the branded hostname has been verified from multiple networks.

Do not change nameservers before the complete current DNS inventory has been captured.

## Production promotion

The `main` branch is the production branch.

Workflow:

1. create feature branch
2. open PR
3. Cloudflare creates a non-production Worker version / preview
4. run visual and functional QA
5. merge to `main`
6. Cloudflare automatically deploys the production Worker

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

The Cloudflare account and Workers Git deployment are configured.

ChatGPT does not currently have a direct Cloudflare DNS/account management connector in this conversation. GitHub deployment configuration can be updated here, but creating the Cloudflare DNS zone and changing GoDaddy nameservers still require access to those provider controls.
