import fs from 'node:fs';
import { regionHTML } from '../production/js/founding-program.js';
import { PRICING_BREAKDOWNS } from '../production/js/pricing-config.js';
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderBreakdown(key) {
 const p=PRICING_BREAKDOWNS[key];
 return `<section id="pricing-panel-${key}" class="ovgo-breakdown" data-breakdown="${key}" aria-labelledby="pricing-panel-title-${key}"><h3 id="pricing-panel-title-${key}">${escape(p.name)}</h3>${key!=='care'?`<!-- founding:panel-${key}:start -->${regionHTML(`panel-${key}`)}<!-- founding:panel-${key}:end -->`:''}${p.intro?`<p><em>${escape(p.intro)}</em></p>`:''}<div class="ovgo-breakdown-columns"><div><h4>What's included</h4><ul>${p.items.map(i=>`<li><strong>${escape(i.label)}:</strong> ${escape(i.text)}</li>`).join('')}</ul></div><div><h4>Timeline and payment</h4><p>${escape(p.timeline)}</p>${p.needs?`<h4>What I need from you</h4><p>${escape(p.needs)}</p>`:''}<h4>Not included</h4><p>${escape(p.excluded)}</p></div></div>${p.closing?`<p>${escape(p.closing)}</p>`:''}</section>`;
}
if (process.argv[1]?.endsWith('build-pricing.mjs')) {
const path=new URL('../production/index.html',import.meta.url);
const html=fs.readFileSync(path,'utf8');
let output=html;
for(const key of Object.keys(PRICING_BREAKDOWNS)) {
 const re=new RegExp(`<!-- breakdown:${key}:start -->[\\s\\S]*?<!-- breakdown:${key}:end -->`);
 if(!re.test(output))throw Error(`Missing slot ${key}`);
 output=output.replace(re,`<!-- breakdown:${key}:start -->${renderBreakdown(key)}<!-- breakdown:${key}:end -->`);
}
if(process.argv.includes('--check')) { if(output!==html)throw Error('Static breakdown HTML differs from config. Run node scripts/build-pricing.mjs'); }
else fs.writeFileSync(path,output);

}
