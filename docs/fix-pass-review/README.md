# Growth OS fix pass review

Status: code prepared locally on `feat/estimator-v2`. Visual approval pending. No push, merge, or deployment during this pass.

## A. Production source before edits

Remote `main` and `feat/estimator-v2` both pointed to `fc68ad15c8375ad22df52e8df0cf2ac886883f66`. There was no feature-branch commit ahead of remote main. The earlier estimator work had already reached production.

Cloudflare check: Workers Builds: optivue-growth-os, success.
Build: eb6bf094-3276-4a8f-ba9f-83636c5046f0.
Version: 4fa605c0-42f5-463a-b34c-d0929c9b46de.
The check lists a feat-estimator-v2 preview alias. Because both branches have the same commit, this alone does not identify which branch triggered the production promotion. Production showed the released homepage and estimator. The previous release verified the served JavaScript hash against the same source.

Local pre-fix commit `c9f67dc` has the same source tree as remote `fc68ad1`, with different commit metadata due to the GitHub API handoff. This fix pass does not alter remote history.

## B. Indexing

Repository and live `/robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://growth.optivuedigital.com/sitemap.xml
```

No site-wide Googlebot disallow. Homepage meta: `index,follow,max-image-preview:large`. Estimator meta: `noindex`. Homepage canonical remains `https://growth.optivuedigital.com/`.

Before: `_headers` applied noindex to `/estimator*`.
After: exact `/estimator` and `/estimator/*` rules. Other routes do not receive this rule. Estimator canonical remains `https://growth.optivuedigital.com/estimator`.

## C. Rendering before fixes

- Four pricing card bodies existed in HTML, but the first three prices were empty until JavaScript ran.
- The spotlight custom element created a shadow root without a slot. Wrapping the card body inside this decoration hid the card body after upgrade.
- Scroll-reveal added opacity-zero styles to offscreen content. A full-page capture from the top showed blank sections.
- The stage description, tools, and capability list were empty before JavaScript.
- The live DOM contained one `#systems` section. Literal triple DOM rendering was not reproduced. No visual claim is made about the reported overlap after this fix without the requested captures.
- A true JavaScript-disabled browser capture was not available.

## Changes prepared

| Request | Change / limitation |
| --- | --- |
| 1. Static pricing | Four prices in HTML, all matched against shared config by a regression test. Spotlight decoration moved outside content. Static card backgrounds added. |
| 2. Stage/reveal failures | One stage section. Static initial detail, tools and capabilities. Normal-flow detail and following section. Default-visible content. Missing or throwing IntersectionObserver does not abort optional reveal/mobile CTA setup. Overlap needs visual review. |
| 3. Confirm placeholders | Removed public placeholders, client names and unconfirmed scope. Recorded in `../confirm-items.md`. Founding program stays off and requires confirmed values. |
| 4–5. Hero | Explicit navigation clearance. Diagram gets its own grid column instead of sitting behind the copy panel. SVG uses meet sizing and all nine nodes. Static SVG fallback added. |
| 6. Follow-up row | Width and auto margins match the page grid. First item's left padding removed. |
| 7. Stage titles | Common grid rows and zero auto top margin align titles within each row. |
| 8. FAQ | Native markers hidden. Existing plus/minus remains. |
| 9. Final CTA | Heading and actions centered with auto margins. |
| 10. Reporting | Start 35%, No tracking/Tracked corner labels, explanation to the right on desktop and below on mobile. Caption is Illustrative tracking view. Event-detail label separated from bars in both SVGs. |
| 11 / later slider instruction | Later explicit About-slider requirement takes precedence. 4:5, start 50%, no before/after tags, founder caption, no process strip. Existing candid/working photos retained. New face photo pending. |
| 12. Audience section | Exact requested scenario copy, prompt and estimator link. Eyebrow made visible. |
| 13. Who I Work With | Exact supplied heading/body inserted after Client Work. Supplied long sentences preserved. |
| 14–16. Voice | Work Lab heading becomes What I build. Three delivery-context we/we'll phrases changed to I. No section has repeated booked visit(s) in body copy. Estimator answer choices retain visitor-voice we. |
| 17–20. Brand | Growth OS section name and five-stage subline, Growth OS Scope Estimator display/title, founder bylines, consistent ownership promise, requested footer and links. Privacy link omitted. |
| 21. Client Work | Anonymous names, Implementation experience / Implementation case study labels. Equal column widths and content-sized cards replace oversized first card. Unconfirmed medical-practice scope omitted. |
| Slider interaction | White full-height divider, round handle at least 44px, existing blue token ring, keyboard arrows/Home/End, pointer capture and preserved grab offset. Pointer cancellation stops movement. |

No existing design tokens changed. No paid Cloudflare features added. No Phase 2 forms or email handling added. Existing prices, commitments and disclaimer preserved.

## Validation

- `node --test`: 49 passed, 0 failed. Full output: `tests.txt`.
- `node scripts/build-tokens.mjs --check`: exit 0.
- `python scripts/contrast.py`: all 20 configured pairs pass, minimum 4.58:1. Full output: `contrast.txt`. This script does not replace visual inspection.
- `git diff --check`: clean.
- Local QA HTTP server: homepage 200, four static prices, one stage section, zero placeholders, unchanged canonical. Estimator 200 with noindex header/meta and updated static title. Diagnosis 301 to /estimator. Evidence: `http.json`.
- HTTP checks use the repository QA server, not a new Wrangler deployment.
- No-JavaScript content verified at HTML level. Full JS-disabled browser layout is unverified.

## Screenshots and missing inputs

Captured: `before-live-1363.jpg`, the actual available browser viewport width. This is the pre-fix production page, not the updated build.

Not captured: before/after at 390px, 768px, 1440px, JS-disabled screenshots, updated slider screenshots, and reference/build side-by-side views.

The browser has no advertised viewport-resize capability. It rejected local-file navigation under its URL security policy. No alternate browser or deployment was used to bypass the rejection.

The two referenced approval images were not attached in the available message/files. Exact visual matching remains unverified. Rahmel must supply those images and the new face photo. Approval remains pending.

## Local review

Apply the supplied patch to a clean checkout of current main using `git apply --check` first, then `git apply`. Stay on `feat/estimator-v2`. Run `node --test` and `node scripts/qa-server.mjs`; open http://127.0.0.1:8787 locally. Review at 390, 768 and 1440 pixels with JavaScript on/off before approval. Do not push yet: the branch previously triggered Cloudflare builds.
