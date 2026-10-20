import fs from 'node:fs';
import { HERO_CONFIG } from '../production/js/hero-config.js';
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderHeroHeadline(config = HERO_CONFIG) {
  return `<h1 data-hero-typewriter><span class="ovgo-sr-only">Turn more leads into booked visits</span><span aria-hidden="true" class="ovgo-hero-headline-visual"><span>Turn more leads into </span><span class="ovgo-hero-phrase-line">${config.phrases.map(phrase=>`<span class="ovgo-hero-phrase-reserve">${escape(phrase)}<i class="ovgo-hero-caret"></i></span>`).join('')}<span class="ovgo-hero-phrase-live"><span data-hero-phrase>booked visits</span><i class="ovgo-hero-caret"></i></span></span></span></h1>`;
}
if (process.argv[1]?.endsWith('build-hero.mjs')) {
 const path = new URL('../production/index.html',import.meta.url);
 const html = fs.readFileSync(path,'utf8');
 const output = html.replace(/<!-- hero-headline:start -->[\s\S]*?<!-- hero-headline:end -->/,`<!-- hero-headline:start -->${renderHeroHeadline()}<!-- hero-headline:end -->`);
 if (process.argv.includes('--check')) { if (output !== html) throw Error('Hero headline differs from config. Run node scripts/build-hero.mjs'); }
 else fs.writeFileSync(path,output);
}
