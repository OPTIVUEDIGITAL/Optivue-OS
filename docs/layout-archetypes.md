# P3 Layout Archetypes

This file records the composition classification required by `docs/design-direction.md`.

| Section | Archetype | Dominant element |
| --- | --- | --- |
| Hero | Full-bleed editorial + single glass content panel | `CLICKS TO CLIENTS.` |
| Who this is for | Paper-light numbered list | Four business symptoms |
| Growth System | Dense interactive system block | Five-stage selector |
| Client Work | Asymmetric 62/38 mosaic | Express Medical Care / Revive case |
| Work Lab | 68/32 list + sticky detail rail | Work list |
| Pricing | Commercial comparison cards | Growth Operations |
| Saved Context | Form / context brief | Context capture surface |
| Estimator route | Mobile guided flow, desktop question + live snapshot | One question per screen |
| How I work | Horizontal scrolling process strip | Seven-step process |
| Final CTA | Single oversized statement | Final question |

## Deliberate grid violation

Exactly one element breaks the normal content container: `.ovgo-transform-detail` hangs left by `--ovgo-grid-break` on desktop and resets to the container on mobile.

## Responsive rule

The estimator starts as a single-column 390px flow. At 640px, short options use two columns. At 1024px, the question sits beside a sticky live snapshot.
