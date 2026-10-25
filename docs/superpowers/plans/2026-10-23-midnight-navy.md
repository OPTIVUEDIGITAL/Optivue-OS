# Midnight Navy Implementation Plan

Goal: apply the user-specified dark palette to the approved office-hero review, preserving light mode and all content, structure, typography and motion.

Architecture: retain static HTML/CSS/JavaScript and the existing esbuild pipeline. Centralize colors in design tokens, use the existing data-theme trigger, initialize the saved theme synchronously, and sync the embedded map. No new dependencies.

Baseline: review/office-hero-baseline, 015cf26. The user selected the latest review rather than the older production version. Open the color-only PR against this baseline branch. No production deployment or main merge.

- [ ] Record all source literals before edits and preserve baseline screenshots.
- [ ] Add contrast tests for the exact palette, adjusted supporting border, and six map channels.
- [ ] Replace hardcoded UI paint values with tokens. Preserve light values exactly. Keep the original hero photo and floor text in both themes, use a navy hero CTA in dark mode, and add dark focus states. Do not edit images or motion.
- [ ] Initialize the saved theme before page paint. Retain the existing toggle and light default. Sync embedded map and native controls.
- [ ] Build and verify static assets, unchanged light tokens/content/geometry, no old dark values, and all six responsive/theme combinations.
- [ ] Capture paired screenshots and document limits. Commit and open a PR. Do not merge or deploy.

Review focus: light-only selectors overriding saved dark theme, transparent borders below 3:1, shadow DOM controls, dark iframe first paint, hero photo contrast.
