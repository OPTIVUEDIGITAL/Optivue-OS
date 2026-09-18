# P0 Evidence Intake

This file tracks the publication-safe evidence used by the P4 evidence layer.

The governing specification is `docs/design-direction.md`.

## Privacy rule

No raw client-system screenshot is published in this repository unless written client permission is recorded separately.

The current public evidence uses **sanitised reconstructions**. They show workflow shape and interface mechanics only. They intentionally exclude patient/member/worker information, personal data, account identifiers, credentials, private URLs, campaign IDs, webhook URLs, and other security-sensitive details.

A reconstruction is always labelled as a reconstruction on the image and in its page caption.

## Evidence register

| Client / subject | Asset path | What it proves | Factual caption | Permission / anonymisation | Status |
| --- | --- | --- | --- | --- | --- |
| Express Medical Care / Revive | `production/assets/evidence/revive-workflow-reconstruction.webp` | Lead-routing workflow shape | Stage changes determine what follow-up happens next. | Sanitised reconstruction; no raw client screen or personal data published. Written client sign-off not recorded. | Committed |
| Express Medical Care / Revive | `production/assets/evidence/revive-measurement-reconstruction.webp` | Acquisition-to-consultation measurement path | Measurement connects acquisition activity to the consultation outcome. | Sanitised reconstruction; no account IDs, campaign IDs, private URLs, or client records published. Written client sign-off not recorded. | Committed |
| CBP / Ideal Spine | `production/assets/evidence/cbp-portal-reconstruction.webp` | Member-portal information structure | One member entry point keeps live sessions and supporting content in the same portal. | Sanitised reconstruction; no member information or private portal data published. Written client sign-off not recorded. | Committed |
| CBP / Ideal Spine | `production/assets/evidence/cbp-content-flow-reconstruction.webp` | Content-to-member workflow | One source session is reused across several member-facing formats. | Sanitised reconstruction; no member records or private content URLs published. Written client sign-off not recorded. | Committed |
| CJB / LearnX | `production/assets/evidence/cjb-scorecard-reconstruction.webp` | Daily scorecard structure | A daily scorecard makes marketing activity and status easier to review. | Sanitised reconstruction; illustrative dummy values only, with no worker, prospect, or company record data. Written client sign-off not recorded. | Committed |
| CJB / LearnX | `production/assets/evidence/cjb-content-workflow-reconstruction.webp` | Content and follow-up workflow | One source idea can feed publishing and follow-up work. | Sanitised reconstruction; no prospect database, worker record, private URL, or account data published. Written client sign-off not recorded. | Committed |
| Rahmel Dela Cruz | `production/assets/rahmel-dela-cruz.webp` | Human trust / operator identity | Portrait of Rahmel Dela Cruz used in the How I work section. | Owner-controlled asset; explicit website-use instruction is present in chat. | Committed |

## P0 status

**PASS FOR THE PUBLICATION-SAFE P4 PATH — six labelled reconstructions and one real operator photograph are committed.**

This status does **not** claim written client permission for publishing raw internal screenshots. Raw internal client evidence remains intentionally excluded until explicit written permission exists.
