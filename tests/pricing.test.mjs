import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderBreakdown } from '../scripts/build-pricing.mjs';
import { PRICING_BREAKDOWNS } from '../production/js/pricing-config.js';
import { sanitizeEventParameters } from '../production/js/analytics.js';
const html=fs.readFileSync(new URL('../production/index.html',import.meta.url),'utf8');
test('every static breakdown matches shared config exactly and is expanded without JS',()=>{
 for(const key of Object.keys(PRICING_BREAKDOWNS)){
  const panel=html.split(`<!-- breakdown:${key}:start -->`)[1].split(`<!-- breakdown:${key}:end -->`)[0];
  assert.equal(panel,renderBreakdown(key));
  assert.doesNotMatch(panel,/\bhidden\b/);
 }
});
test('breakdown controls contain no interactive descendants or booking action',()=>{
 const triggers=[...html.matchAll(/<button[^>]*data-pricing-trigger[^>]*>([\s\S]*?)<\/button>/g)];
 assert.equal(triggers.length,3);
 for(const [,content] of triggers)assert.doesNotMatch(content,/<button|<a\b|data-ovgo-booking/);
});
test('pricing breakdown analytics allows only enumerated tier and device',()=>{
 assert.deepEqual(sanitizeEventParameters('pricing_breakdown_open',{tier:'care',device:'mobile',email:'x@example.com'}),{tier:'care',device:'mobile'});
 assert.deepEqual(sanitizeEventParameters('pricing_breakdown_open',{tier:'https://example.com',device:'free text'}),{});
});
