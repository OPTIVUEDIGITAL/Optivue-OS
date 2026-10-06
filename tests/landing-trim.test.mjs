import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HERO_CONFIG } from '../production/js/hero-config.js';
const html=fs.readFileSync(new URL('../production/index.html',import.meta.url),'utf8');
const text=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ');
test('removed sections and Diagnose wording are absent',()=>{
 for(const phrase of ['Fix follow-up before adding more leads.','Built for businesses where an appointment is the sale.','What I build.','Connect each step from lead to booked visit.','Clear expectations before work begins.','Diagnose'])assert.ok(!text.includes(phrase),phrase);
 assert.doesNotMatch(html,/data-stage=|ovgo-stage-detail/);
});
test('one H1 has exactly one static sentence and no phrase list in static text',()=>{
 const headings=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
 assert.equal(headings.length,1);
 assert.equal(headings[0][1].replace(/<[^>]*>/g,''),'Turn more leads into booked visits');
 for(const phrase of HERO_CONFIG.phrases.slice(1))assert.ok(!text.includes(phrase),phrase);
 assert.match(html,/aria-hidden="true" class="ovgo-hero-headline-visual" hidden/);
});
test('all fragment navigation anchors resolve and first FAQ covers fit',()=>{
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(id),id);
 assert.match(html,/<div class="ovgo-faq-list"><details><summary>Is Optivue a fit for my clinic\?/);
 const strip=html.match(/<div class="ovgo-growth-strip">(.*?)<\/div>/)[1];
 assert.equal((strip.match(/<span>/g)||[]).length,5);
 assert.doesNotMatch(strip,/button|tabindex|role=/);
});
