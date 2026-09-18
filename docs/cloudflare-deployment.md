# Cloudflare Deployment

## Final hosting model

```text
GitHub
  ↓
Cloudflare Pages
  ↓
www.optivuedigital.com
```

GitHub remains the source of truth.

Cloudflare Pages serves the production front end.

Wix may continue to manage the domain/DNS during the initial launch.

## Staging deployment

Create a Cloudflare Pages project from:

`OPTIVUEDIGITAL/Optivue-OS`

Use:

- Framework preset: None
- Production branch during staging: `release/cloudflare-staging`
- Build command: `exit 0`
- Build output directory: `production`
- Root directory: repository root

No Node build is required for the public site.

Cloudflare should provide a temporary hostname similar to:

`optivue-growth-os.pages.dev`

Use that URL for visual and functional QA before connecting the real domain.

## Production promotion

After staging QA:

1. merge the release PR into `main`
2. in Cloudflare Pages, change the production branch to `main`
3. confirm the main deployment succeeds
4. only then attach the custom domain

## Custom domain

Primary public hostname:

`www.optivuedigital.com`

In Cloudflare Pages:

1. Workers & Pages
2. select the Optivue Growth OS Pages project
3. Custom domains
4. Set up a domain
5. enter `www.optivuedigital.com`

If DNS remains managed by Wix, create the CNAME at Wix only **after** Cloudflare Pages has associated the custom domain.

The CNAME should point:

```text
www.optivuedigital.com
→ <your-project>.pages.dev
```

Do not manually create that CNAME before adding the custom domain in Pages.

## Apex domain

For the initial launch:

`optivuedigital.com`

can remain on Wix and redirect to:

`https://www.optivuedigital.com`

This lets the Growth OS run on Cloudflare without requiring an immediate domain registrar or nameserver migration.

A later infrastructure phase may move the entire DNS zone to Cloudflare if desired.

## Cloudflare Pages security headers

The production site includes:

`production/_headers`

This currently sets conservative static-site security headers without locking down third-party integrations such as Calendly or future analytics.

A stricter Content Security Policy should be added only after the final analytics, media, and API domains are known.

## Lead intake Worker

The secure lead relay is separate from Pages.

Source:

`backend/lead-intake/worker.js`

Configuration template:

`backend/lead-intake/wrangler.jsonc`

Planned public endpoint:

`https://api.optivuedigital.com/growth-os/intake`

Private environment secret:

`MAKE_WEBHOOK_URL`

Do not deploy/enable lead submission until the Make Growth OS scenario is tested and active.

## Cloudflare connection status

The Cloudflare account exists, but ChatGPT currently does not have an active Cloudflare connector available in this conversation.

Until that connector is available, the Cloudflare dashboard steps above require a one-time manual action by the account owner.

The GitHub side is prepared so no code rewrite is required when the Pages project is created.
