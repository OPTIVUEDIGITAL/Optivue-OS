import fs from 'node:fs';
import { HERO_CONFIG } from '../production/js/hero-config.js';
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderHeroHeadline(config = HERO_CONFIG) {
  return `<div class="ovgo-hero-headline" data-hero-typewriter><h1><span>Turn more leads into </span><span class="ovgo-hero-phrase-line">${config.phrases.map(phrase=>`<span aria-hidden="true" class="ovgo-hero-phrase-reserve" data-measure="${escape(phrase)}"><i class="ovgo-hero-caret"></i></span>`).join('')}<span>booked visits</span></span></h1><span aria-hidden="true" class="ovgo-hero-headline-visual" hidden><span data-hero-fixed></span><span class="ovgo-hero-phrase-line"><span class="ovgo-hero-phrase-live"><span data-hero-phrase></span><i class="ovgo-hero-caret"></i></span></span></span></div>`;
}
if (process.argv[1]?.endsWith('build-hero.mjs')) {
 const path = new URL('../production/index.html',import.meta.url);
 const html = fs.readFileSync(path,'utf8');
 const output = html.replace(/<!-- hero-headline:start -->[\s\S]*?<!-- hero-headline:end -->/,`<!-- hero-headline:start -->${renderHeroHeadline()}<!-- hero-headline:end -->`);
 if (process.argv.includes('--check')) { if (output !== html) throw Error('Hero headline differs from config. Run node scripts/build-hero.mjs'); }
 else fs.writeFileSync(path,output);
}
