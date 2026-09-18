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

| Client / subject | Asset path | What it proves | Factual caption | Permission / anonymisation | Status |
| --- | --- | --- | --- | --- | --- |
| Express Medical Care / Revive | TBD | TBD | TBD | TBD | Missing |
| Express Medical Care / Revive | TBD | TBD | TBD | TBD | Missing |
| CBP / Ideal Spine | TBD | TBD | TBD | TBD | Missing |
| CBP / Ideal Spine | TBD | TBD | TBD | TBD | Missing |
| CJB / LearnX | TBD | TBD | TBD | TBD | Missing |
| CJB / LearnX | TBD | TBD | TBD | TBD | Missing |
| Rahmel Dela Cruz | TBD | Human trust / operator identity | Real operator photograph | Owner-controlled asset; explicit website-use instruction is present in chat. No separate formal release is recorded. | Supplied in chat; not yet committed |

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

The operator photograph has been supplied in the working conversation, but the current GitHub connector does not support binary repository uploads. It should be committed as a WebP with an explicit width/height during the evidence intake.
