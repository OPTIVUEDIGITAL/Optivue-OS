# SEO health implementation plan

Base: GitHub main 9a48bc583f452e8de89eba7579686c501c5d5696, tree 6dc6998cc6382adac2118c9921c48a2dc7ce2de3. Local bd867cf has the identical tree. Remote commit will parent main directly.

1. Preserve hero configuration and animation state machine. Separate static H1 from aria-hidden visual layer, reserving the same phrase heights with data attributes.
2. Update homepage metadata, image alt text, and requested subheadings. Generate a 1200x630 social PNG using existing token colors.
3. Generate static FAQPage JSON-LD from the visible FAQ at build time. Preserve ProfessionalService.
4. Add hostname-scoped Workers noindex rules without changing production or estimator rules. Retain homepage-only sitemap and robots allowance.
5. Validate static markup, schema parity, image size, tokens, contrast, full unit suite, and browser animation parity at 390/768/1440px. Push only fix/seo-health and obtain automatic preview.

No merge or production deploy. No design token additions, pricing changes, or dependencies.
