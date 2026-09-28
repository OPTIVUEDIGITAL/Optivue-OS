import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ESTIMATOR_CONFIG as config } from '../production/js/estimator-config.js';
import { getEstimatorResult, buildSnapshotText, renderPricePath } from '../production/js/estimator.js';
import { renderPriceHTML } from '../production/js/pricing-values.js';
import { PRICING_BREAKDOWNS } from '../production/js/pricing-config.js';
const html = fs.readFileSync(new URL('../production/index.html', import.meta.url), 'utf8');
const retired = /Founding Clinic|founding (?:price|rate)|spots open|Standard (?:from )?\$|My first three clinics|Diagnostic|Foundation Launch|Growth Operations|\$1,500|\$7,500|\$3,500\/month|\$2,500\/month|\$750/;
const base = { business_type:'medical_wellness',location_count:'one',monthly_inquiries:'26_50',primary_problem:'ongoing',follow_up_process:'crm_automatic',response_speed:'within_hour',current_systems:['crm','booking','tracking','auto_followup'],marketing_spend:'2500_4999',decision_role:'owner' };
const cases = [
 ['A',{...base,monthly_inquiries:'not_sure',primary_problem:'not_sure',response_speed:'not_sure'},['diagnostic']],
 ['B',{...base,current_systems:[],follow_up_process:'manual'},['diagnostic','foundation']],
 ['C',base,['diagnostic','operations']],
 ['D',{...base,follow_up_process:'depends'},['diagnostic','foundation']],
 ['E',{...base,business_type:'ecommerce'},[]],
];
test('all estimator paths, credit notes, and copied snapshots use the approved offers', () => {
 for (const [id,answers,keys] of cases) {
  const result=getEstimatorResult(answers);
  assert.equal(result.id,id);
  assert.deepEqual(result.path.map(p=>p.label),keys.map(k=>config.prices[k].label));
  assert.deepEqual(result.path.map(p=>p.display),keys.map(k=>config.prices[k].display));
  const snapshot=buildSnapshotText(answers);
  assert.doesNotMatch(snapshot,retired);
  assert.doesNotMatch(renderPricePath(result),retired);
  if (['B','D'].includes(id)) assert.equal(result.total,'Typical first step: $800 Audit, then from $5,000 (Audit credited)');
  if (id==='C') assert.equal(result.total,'from $3,500 setup, then $2,000/month (Audit credited)');
  if (['B','C','D'].includes(id)) { assert.ok(snapshot.includes(result.total)); assert.ok(snapshot.includes('Audit credited if you continue within 30 days.')); }
 }
 const custom=getEstimatorResult({...base,location_count:'six_plus'});
 assert.equal(custom.path.length,1);
 assert.equal(custom.path[0].label,'Growth Systems Audit');
 assert.equal(custom.pathNote,'Scope and investment set after the Audit.');
 assert.equal(custom.total,'');
 assert.match(buildSnapshotText({...base,location_count:'six_plus'}),/Scope and investment set after the Audit\./);
});
test('public text and shipped JS contain no retired offers or promotional copy', () => {
 assert.equal(config.founding.enabled,false);
 function scan(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
   const path=directory+'/'+entry.name;
   if(entry.isDirectory())scan(path);
   else if(/\.(html|js|json|svg|txt)$/.test(path))assert.doesNotMatch(fs.readFileSync(path,'utf8'),retired,path);
  }
 }
 scan(new URL('../production',import.meta.url).pathname);
 assert.equal(renderPriceHTML(html),html);
 assert.doesNotMatch(html,/data-founding|founding:/i);
});
test('three static card prices, monthly terms, and care price match shared config', () => {
 for(const [key,price] of Object.entries(config.prices)) {
  const values=[...html.matchAll(new RegExp(`data-price-key="${key}"[^>]*>([^<]*)<`,'g'))].map(m=>m[1]);
  assert.ok(values.includes(price.cardDisplay||price.display));
  if(price.monthly)assert.ok(values.includes(`then ${price.monthly}`));
 }
 assert.equal((html.match(/data-cta-location="pricing"/g)||[]).length,1);
 assert.match(html,/Request an Audit/);
 assert.match(html,/Need upkeep only after a Fix\? Systems Care,/);
 assert.equal(config.prices.care.display,'$350/month');
 assert.ok(html.indexOf('ovgo-care-note')>html.indexOf('data-pricing-desktop-panel'));
});
test('replacement panels retain four sections and exact payment terms', () => {
 assert.equal(PRICING_BREAKDOWNS.diagnostic.items.length,7);
 assert.equal(PRICING_BREAKDOWNS.foundation.items.length,6);
 assert.equal(PRICING_BREAKDOWNS.operations.items.length,5);
 assert.equal(PRICING_BREAKDOWNS.foundation.timeline,'4–6 weeks. 50% to start, 50% on day 30.');
 assert.equal(PRICING_BREAKDOWNS.operations.timeline,`Setup paid upfront. Then ${config.prices.operations.monthly}, billed monthly in advance, month-to-month. 12-month commitment: ${config.prices.operations.annualMonthly}.`);
 for(const key of ['diagnostic','foundation','operations']) {
  const panel=html.split(`<!-- breakdown:${key}:start -->`)[1].split(`<!-- breakdown:${key}:end -->`)[0];
  for(const heading of ["What's included",'Timeline and payment','What I need from you','Not included'])assert.ok(panel.includes(`<h4>${heading}</h4>`));
  if(key!=='diagnostic')assert.ok(panel.includes('<em>Typical scope. Your exact scope comes from your Audit.</em>'));
 }
});
