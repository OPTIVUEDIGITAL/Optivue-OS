# Midnight Navy review

Prepared against the selected office-hero review design, not the older design on main. No production deployment or merge was performed.

## Implemented

- Midnight Navy tokens and existing theme toggle, with synchronous saved-theme initialization and native dark controls.
- Light palette preserved. Hero photo and projected floor text retain their original appearance in both modes, per the latest instruction. Only the hero CTA becomes navy with cream text in dark mode; other primary buttons retain lime.
- Removed WHO THIS IS FOR eyebrow; updated the ownership heading and both fit-column sentences; appended the manual live-human handling condition.
- Removed the entire business-specialization and What I build sections.
- Growth Map illustration uses a 1080 × 1080 maximum square canvas, scaling down responsively. Mobile View Details expands into readable cards, so that expanded detail view is intentionally taller than a square. Headings and supporting notes sit outside the illustration canvas.
- Kept Illustrative workflow. and the existing infinite animation/reduced-motion behavior; no Pause/Replay toolbar or inner vertical scrollbar.
- Consolidated and minified CSS and JavaScript using the existing esbuild pipeline. CSS gzip 14,752 bytes; combined JavaScript chunks gzip 21,785 bytes. No new runtime library.

## Files

Main source: src/design-tokens.json, src/css/midnight-navy.css and existing component CSS, src/js/theme-init.js, src/js/optivue.js, src/js/components/{compare-slider,spotlight-card}.js, src/{index,site}.html, estimator and thank-you HTML, src/growth-map/index.html, scripts/build.mjs. Generated production assets rebuilt. Added tests/midnight-navy.test.mjs and light-token fixture.

## Contrast

Calculated using WCAG sRGB relative luminance. These are solid-color token pairs, not an assertion that every pixel of text over a photograph has uniform contrast.

| Foreground | Page #0E1A2B | Surface #16263D | Requirement |
|---|---:|---:|---:|
| Cream #F6F2E8 | 15.64:1 | 13.62:1 | 4.5:1 |
| Muted #A9B7CB | 8.59:1 | 7.49:1 | 4.5:1 |
| Lime #D6F34E | 13.98:1 | 12.18:1 | 3:1 focus/icons |
| Border #607695 | 3.76:1 | 3.28:1 | 3:1 |
| Requested border #243752 | 1.45:1 | 1.26:1 | FAIL, replaced |
| LinkedIn #0B70D4 | 3.56:1 | 3.11:1 | 3:1 |

Navy text on lime buttons: 13.98:1. Cream text on the navy hero button: 15.64:1. LinkedIn was lightened from #0A66C2 (2.68:1 against the surface) to #0B70D4 only in dark mode. Other channel colors remain unchanged and exceed 3:1 against both dark backgrounds.

## Verification and limits

- npm run build: passed.
- npm test: passed, including 31 asset references and map requirements.
- node --test tests/midnight-navy.test.mjs: all 5 passed, including exact palette, unchanged light tokens, contrast, storage failure fallback, and parent theme inheritance.
- Browser responsive checks at nominal 375, 768 and 1280 widths: no horizontal page overflow. Square map measured 375 × 375 and 1080 × 1080. Browser frame scrollbars can reduce page content width by 15 px.
- Before/after computed styles for unchanged light sections matched at mobile and tablet; all 231 baseline desktop records had matching after records. This excludes intentionally edited copy/sections/map and is not a pixel-identical full-page assertion.
- Browser verified the exact requested copy, removed sections, navy hero CTA, theme toggle, dark state after reload, lime 3 px keyboard focus on the header CTA, live map 12-second infinite animation, and hidden map scrollbar. Reduced-motion static fixtures used for stable screenshots; production motion remains active.
- No #092C25 or #103C32 in src or production. The historical pre-edit inventory intentionally lists old values. Design tokens, static SVG artwork, review utilities and an unused legacy diagram component still contain color literals. This is not a claim that every literal in the repository was removed.
- Full legacy suite was run: 9 passed and 12 failed before adding the two bootstrap tests. Failures reference former unbundled production files, such as production/js/behavior.js and production/css/optivue.css. These older QA scripts need migration to the selected review build. Do not merge until the legacy CI migration and final full-page/accessibility checks are complete.
- No production browser verification, Lighthouse speed score, full automated keyboard audit, or filmstrip proof of zero theme flash is claimed. Theme initialization runs before styles, but visual flash is not formally measured.

## Screenshots

Screenshots are local development previews, not the deployed website. Before/after images use fixed reduced-motion fixtures for comparison.

| View | Before | After |
|---|---|---|
| Desktop light | [Before](screenshots/before-light-1280.jpg) | [After](screenshots/after-light-1280.jpg) |
| Desktop dark | [Before](screenshots/before-dark-1280.jpg) | [After](screenshots/after-dark-1280.jpg) |
| Mobile light | [Before](screenshots/before-light-375.jpg) | [After](screenshots/after-light-375.jpg) |
| Mobile dark | [Before](screenshots/before-dark-375.jpg) | [After](screenshots/after-dark-375.jpg) |

[Square Growth Map](screenshots/map-dark-1280.jpg)

[Pre-edit color inventory](colors-before.md)

## October 25 responsive map revision

Supersedes the earlier mobile View Details description. Removed the mobile overview/details layouts and toggle. The same 1080px square illustration now scales proportionally at every width, with all 6 animated paths and 24 stops. Supporting notes and credits remain outside the square. Below 880px, an always-visible channel transcript repeats the tiny diagram labels at readable 12–14px sizes. The founder portrait is 40px; name 13px; role and tally 12px.

Browser measured 1080 × 1080, 768 × 768 and 375 × 375; no horizontal overflow at tested sizes. Six 12-second infinite traveller animations run. Reduced-motion CSS and visibility controls retained. Build, asset verification, five theme tests and two map regression tests pass. Existing legacy-suite limitations above are unchanged.

[Updated mobile map](screenshots/map-consistent-mobile.jpg)
