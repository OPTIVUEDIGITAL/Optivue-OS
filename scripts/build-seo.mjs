import fs from 'node:fs';
const page = new URL('../production/index.html', import.meta.url);
export function faqEntities(html) {
  const section = html.match(/<section id="faq"[\s\S]*?<\/section>/)?.[0];
  if (!section) throw Error('FAQ section missing');
  const text = value => value.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').replace(/\s+/g, ' ').trim();
  return [...section.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(([, question, answer]) => ({
    '@type': 'Question', name: text(question), acceptedAnswer: {'@type': 'Answer', text: text(answer)}
  }));
}
export function renderSeo(html) {
  const data = {'@context':'https://schema.org', '@type':'FAQPage', mainEntity:faqEntities(html)};
  if (!data.mainEntity.length) throw Error('FAQ has no questions');
  const block = `<!-- faq-schema:start --><script type="application/ld+json">${JSON.stringify(data).replaceAll('<','\\u003c')}</script><!-- faq-schema:end -->`;
  return html.includes('<!-- faq-schema:start -->') ? html.replace(/<!-- faq-schema:start -->[\s\S]*?<!-- faq-schema:end -->/, block) : html.replace('</head>', `  ${block}\n</head>`);
}
if (process.argv[1]?.endsWith('build-seo.mjs')) {
  const html=fs.readFileSync(page,'utf8'), output=renderSeo(html);
  if (process.argv.includes('--check')) { if(output!==html) throw Error('FAQ schema differs from visible FAQ. Run node scripts/build-seo.mjs'); }
  else fs.writeFileSync(page,output);
}
