# Data and Cookie Inventory

Audit: 25 October 2026. Source: current selected review branch, all src HTML/CSS/JS, deployment config and previous PR state. PR #44 merged on 20 October. PR #48 contains the selected review design and is the parent of this draft. Other open PRs: #46 map preview, #43 copy, #41 estimator, #35 domain preparation. No unrelated branches changed.

| Item | Provider | Purpose | Category | Type / party | Duration |
|---|---|---|---|---|---|
| optivue-consent | Optivue | Consent version, timestamp, category choices, explicit GPC override | Necessary | First-party cookie, localStorage fallback | Six calendar months |
| optivue-estimator-v2 | Optivue | Resume visitor-started nine-question estimate | Necessary for requested tool | First-party sessionStorage | Tab session |
| optivue-theme | Optivue | Remember selected theme after permission | Functional | First-party localStorage | Until cleared or withdrawal |
| optivue-prospect-context-v1 | Optivue | Viewed stages and booking intent, optional | Analytics | First-party sessionStorage | Tab session or withdrawal |
| ov_fcb_sent and transient ov_fcb_storage_check | Optivue | Deduplicate thank-you conversion | Analytics | First-party sessionStorage | Tab session or withdrawal |
| gtag.js, _ga, _ga_9XBD3QZ5BQ | Google | Optional page and event measurement | Analytics | Third-party script/network, first-party cookies | Provider/configuration dependent, verify account settings |
| Calendly iframe | Calendly | Requested scheduling | Functional | Third-party iframe/scripts/cookies | Names and lifetimes vary, vendor settings unknown |
| Hosting requests | Cloudflare | Deliver and secure website | Necessary | Server request handling | Unknown |

No Meta, LinkedIn, Reddit, YouTube pixels, video embeds, chat or external fonts were found in the active build. Growth Map references are descriptive labels. Images and fonts are local. No cookie-setting Cloudflare feature is declared in wrangler.jsonc, and account-level settings are not visible here. Private ChatGPT preview hosting may add platform authentication outside the production site's code.

Estimator collects controlled choices: business type, location count, monthly lead range, primary problem, decision role, marketing-spend range, systems and follow-up selections. Answers stay in sessionStorage and are calculated locally. Controlled analytics events require consent. No active form sends personal data to an Optivue backend. Dormant lead-capture.js contains name/email/company/website fields and a fetch call, but is not imported/mounted; leadSubmissionEnabled=false and leadEndpoint is empty. No signup or login was added. No submission microcopy was added to the estimator because it does not submit personal details.

Calendly receives form details entered on its own service, and existing booking code forwards UTM campaign parameters. The exact hosted intake fields and vendor cookie behavior are not established by the repository. The notice and first-use Continue to booking action avoid loading that service without a deliberate choice. Functional opt-in skips only that extra confirmation on later requested opens. Analytics rejection does not block booking.

The prompt's Next.js, older CTA labels and disabled redirect assumptions differ from this code. The actual static build, current buttons, /estimator path, legacy /diagnosis redirect, Calendly URL and active redirect listener are preserved. No new deployment bindings or services. No consent logs are sent to a server.

Draft policy statements about external business practices remain explicitly unconfirmed. Source review cannot prove no sale/sharing across the entire business, identify actual GA retention, or verify contractual transfer safeguards.

Official references checked: ICO cookies guidance; Google basic Consent Mode documentation; California Attorney General CCPA guidance; Canadian OPC consent/access guidance; OAIC access/correction guidance; Philippines NPC data subject rights. See policy links. Policy text is a drafted baseline, not legal advice, and requires review by a qualified lawyer familiar with the relevant jurisdictions.
