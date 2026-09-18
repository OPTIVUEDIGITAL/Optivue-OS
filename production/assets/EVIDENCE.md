# P0 Evidence Intake

This file tracks the human-only evidence required before P4 may begin.

The governing specification is `docs/design-direction.md`.

## Acceptance gate

P0 passes only when:

- at least six real client-work artefacts are present under `production/assets/`;
- each artefact has a factual one-line caption;
- each artefact has a permission status;
- each of the three public client projects is represented;
- one real operator photograph is present.

P0 blocks P4 only. P1–P3 may proceed while this table is incomplete.

| Client / subject | Private candidate | What it proves | Factual caption | Permission / anonymisation | Status |
| --- | --- | --- | --- | --- | --- |
| Express Medical Care / Revive | Raw Google Business Profile Performance screenshot | Local-search measurement and search-term analysis | Google Business Profile Performance view used to review profile views, discovery sources, and search terms for Revive. | Client publication permission not recorded. Keep private; anonymise/reconstruct before public use if written permission is unavailable. | Candidate identified; not committed |
| Express Medical Care / Revive | Revive Master Local SEO + Content Blueprint / source GSC data | Search diagnosis, service-page prioritisation, and implementation planning | Working SEO blueprint built from Search Console, GBP, indexing, and live-page review data supplied for Revive. | Client publication permission not recorded. Document may inform a sanitised reconstruction; do not publish raw client data. | Candidate identified; not committed |
| CBP / Ideal Spine | Kajabi podcast Analytics screenshot | AI podcast implementation reached a measurable live product state | Kajabi Analytics view for the Ideal Spine Sessions / Refining Room Recap podcast implementation. | Client publication permission not recorded. Account/user identity and performance data require sanitisation or reconstruction before public use. | Candidate identified; not committed |
| CBP / Ideal Spine | CBP portal / information-architecture working screen | Portal information architecture and member-access design work | Working CBP Online Institute portal/IA artefact showing how education, community, resources, and certification were organised. | Client publication permission not recorded. Use only after written sign-off or as an explicitly labelled sanitised reconstruction. | Candidate identified; not committed |
| CJB / LearnX | LinkedIn Campaign Manager professional-demographics screenshot | Paid acquisition targeting and audience analysis for the WAHVA campaign | LinkedIn Campaign Manager view showing the job-function mix reached by the WA Operators lead-generation ad set. | Client publication permission not recorded. Campaign/account details and performance values require sign-off or sanitised reconstruction. | Candidate identified; not committed |
| CJB / LearnX | LinkedIn Campaign Manager ad-set configuration screenshot | Campaign setup, targeting, placement, budget, and tracking configuration | LinkedIn ad-set configuration for the WAHVA WA Operators lead-generation campaign. | Client publication permission not recorded. Keep private until sign-off or reconstruct with sensitive values removed. | Candidate identified; not committed |
| Rahmel Dela Cruz | `production/assets/rahmel-dela-cruz.webp` | Human trust / operator identity | Rahmel Dela Cruz portrait supplied for the Optivue website. 640×640 WebP. | Owner-controlled asset; explicit website-use instruction is present in chat. No separate formal release is recorded. | Committed |

### Candidate-evidence rule

The six client rows above are **private source candidates only**. They are deliberately not copied into the public repository.

- A candidate is not publishable evidence.
- Model-generated mockups are rejected and are not listed here.
- Raw client/account screenshots stay private until the written-permission rule is satisfied.
- If permission is unavailable after the agreed waiting period, create an explicitly labelled sanitised reconstruction from the real work; remove identities and confidential values while preserving the actual workflow/interface structure.
- Never describe a reconstruction as a live client screenshot.

### P0 status

**SOURCE INTAKE COMPLETE; PUBLICATION GATE OPEN.**

Six real client-work source artefacts have been identified privately across the three named client projects, plus the operator portrait is committed. P0 is still **not publishable/complete for P4** until each client row has either written publication permission or an approved sanitised-reconstruction path under the governing permission rule.

## Allowed evidence

Examples named by the design direction:

- CRM workflow
- GA4 or dashboard view
- landing page
- GBP listing
- automation canvas

For client screenshots, anonymise identities by default **and** obtain written client sign-off. Anonymisation protects exposed third-party data; it does not replace contractual permission.

If written client permission is not available within two weeks, use a sanitised reconstruction and label it explicitly as a reconstruction. Never imply that a reconstruction is a live internal client screen.

Permission status may only be populated from an explicit written source. Asset presence, silence, or inferred conversational intent is not permission.

## P0 status

**BLOCKED — 0/6 client artefacts committed.**

The operator photograph is committed at `production/assets/rahmel-dela-cruz.webp` as a 640×640 WebP. Client evidence remains the blocking requirement for P4.
