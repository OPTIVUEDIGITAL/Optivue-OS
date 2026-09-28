# Items awaiting owner confirmation

These items do not render in public HTML. Do not restore them until Rahmel approves.

| Item | Previous wording / scope | Public treatment |
| --- | --- | --- |
| Client naming permission | Revive Medical Wellness & Aesthetics, CBP Online Institute / Ideal Spine, LearnX by CJB Systems | Use anonymous business descriptions. |
| Medical practice scope | SEO and website copy for local searches. Copy and image plans for Google Business Profile. [CONFIRM exact scope] | Omit the entire scope paragraph. |
| Client results and figures | [CONFIRM permission for each] | No figures or permission placeholder. |
| Call availability | [CONFIRM: Calls are available during US Eastern business hours.] | Omit the FAQ item and About availability paragraph. |
| Founding Clinic Program | [CONFIRM: 2] spots; [CONFIRM: Diagnostic fee fully credited toward the Foundation Build] | Feature stays off, values are null. Runtime also requires confirmed values. |
| Privacy page | [CONFIRM: privacy page] | Omit footer link until a real page exists. |

The new request confirms the footer location and service regions: Baguio City, Philippines, serving the US, UK, Canada and Australia. The old unconfirmed areaServed property was omitted from structured data.

## Delivery voice

Changed `Each month, we review results.` to `Each month, I review the results.`
Changed `We check follow-up before you spend more on ads.` to `I check your follow-up before you spend more on ads.`
Also changed final CTA `we'll discuss` to `I help you decide`.
Remaining `we` options in the estimator describe the visitor's business, not Optivue delivery. They stay unchanged.

## Approval boundary

The owner authorized a GitHub-plugin push to feat/estimator-v2 for Cloudflare preview review. Never modify main or run a deployment. No merge before visual approval.

## Slider references resolved

The supplied image.png shows About, and image(1).png shows Reporting. The approved face portrait already exists as production/assets/rahmel-dela-cruz.webp. The matching right image is rahmel-working-after.webp. No replacement image is needed for this reference.

## Optional Diagnostic policies
- Diagnostic credit: awaiting owner confirmation. `diagnosticCreditEnabled` defaults to `false` in `production/js/runtime-config.js`.
- Deliverable guarantee: awaiting owner confirmation. `diagnosticGuaranteeEnabled` defaults to `false` in the same config.
- Both statements stay absent from rendered content until their individual flags are set to `true`. No payment or refund automation is enabled.
