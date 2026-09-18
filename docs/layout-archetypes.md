# P3 Layout Archetypes

This file records the composition classification required by `docs/design-direction.md`.

| Section | Archetype | Dominant element |
| --- | --- | --- |
| Hero | Full-bleed editorial + single glass content panel | `CLICKS TO CLIENTS.` |
| Who this is for | Paper-light numbered list | Four business symptoms |
| Growth System | Dense interactive system block | Five-stage selector |
| Client Work | Asymmetric 62/38 mosaic | Express Medical Care / Revive case |
| Work Lab | 68/32 list + sticky detail rail | Work list |
| Pricing | Commercial comparison cards | Growth Accelerator |
| Diagnosis | Split explanation rail + working tool | Diagnosis tool |
| Saved Context | Form / context brief | Context capture surface |
| Estimator | Working tool + recommendation summary | Estimator controls |
| How I work | Horizontal scrolling process strip | Seven-step process |
| Final CTA | Single oversized statement | Final question |

## Deliberate grid violation

Exactly one element breaks the normal content container: `.ovgo-transform-detail` hangs left by `--ovgo-grid-break` on desktop and resets to the container on mobile.

## Responsive rule

The estimator does not shrink the desktop matrix mechanically. At `760px` and below, controls become compact two-column choice rows with the recommendation summary stacked underneath.
