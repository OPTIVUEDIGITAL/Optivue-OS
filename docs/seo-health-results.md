# SEO health validation

Branch: fix/seo-health. Base: main 9a48bc583f452e8de89eba7579686c501c5d5696. No merge or production deploy.

## Passed
- 70 unit tests, token generation check, contrast check.
- Browser parity against unchanged main at 390, 768, 1440px: same seeded phrase order, timing, text geometry, caret position, CTA position, reduced-motion behavior.
- Full hero loop: CLS 0 at all three widths; no horizontal overflow; all eight phrases; no-JS fallback.
- Exactly one H1 with textContent `Turn more leads into booked visits`; phrase reservations use data attributes.
- Exact requested alt text, title/meta/social tags and two subheadings.
- Social PNG 1200x630, 49,736 bytes; colors from existing dark bg/text/blue/muted tokens. No token changes.
- ProfessionalService JSON-LD parses and has expected type, name, URL and founder. FAQPage contains six Questions with Answers matching the visible FAQ exactly. This is local structural/content validation, not a Google Rich Results Test or a guarantee of rich-result eligibility.
- Sitemap XML lists only https://growth.optivuedigital.com/ and robots.txt references the sitemap.
- GitHub Design QA passed on 2a52a9ff, including responsive browser checks, pricing, mobile experience and Lighthouse budgets.

## Response checks
Local Wrangler static assets:
- production host /: 200; no X-Robots-Tag, meta index,follow,max-image-preview:large.
- production host /estimator: 200; X-Robots-Tag noindex.
- workers.dev host /: 200; X-Robots-Tag noindex, nofollow.
- workers.dev host /estimator: 200; headers include noindex and noindex, nofollow.
Live production: 200, indexable meta and unchanged canonical, no noindex header.
Live branch preview: 200; X-Robots-Tag noindex only. Social PNG serves 200 image/png.

## Unresolved platform behavior
Cloudflare version/alias previews replace the requested header value with noindex. A Worker response handler setting noindex, nofollow produced the same live result on version ed765186. The handler was removed because it offered no observed benefit and would count asset requests against the free Worker quota. Static hostname rules remain for Workers hostnames. Exact live preview nofollow header acceptance is NOT passed. No production deployment was used to test the base Workers hostname.

## robots.txt
```
User-agent: *
Allow: /

Sitemap: https://growth.optivuedigital.com/sitemap.xml
```
