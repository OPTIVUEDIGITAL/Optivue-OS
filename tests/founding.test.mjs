import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ESTIMATOR_CONFIG as C} from '../production/js/estimator-config.js';
import {foundingActive,priceFor,first90Days,foundingMarkup,renderFoundingHTML} from '../production/js/founding-program.js';
const before=new Date('2027-01-31T23:59:59Z'),after=new Date('2027-02-01T00:00:00Z');
const off=change=>({...C,founding:{...C.founding,...change}});
test('founding end date is inclusive, remaining spots never change automatically',()=>{
 assert.equal(foundingActive(C,before),true);assert.equal(foundingActive(C,after),false);
 assert.equal(foundingActive(off({enabled:false}),before),false);assert.equal(foundingActive(off({spotsRemaining:0}),before),false);
 assert.equal(C.founding.spotsRemaining,3);
});
test('ON and OFF resolve all prices and first 90 day totals',()=>{
 assert.equal(priceFor('diagnostic',C,before).display,'$750');assert.equal(priceFor('foundation',C,before).display,'from $5,000');assert.equal(priceFor('operations',C,before).display,'$2,500/month');
 assert.match(first90Days(C,before),/\$5,750/);
 for(const [config,date] of [[off({enabled:false}),before],[off({spotsRemaining:0}),before],[C,after]]){
  for(const key of Object.keys(C.prices))assert.equal(priceFor(key,config,date).display,C.prices[key].display);
  assert.match(first90Days(config,date),/\$9,000/);
  for(const region of ['hero','banner','faq','card-diagnostic','panel-foundation'])assert.equal(foundingMarkup(region,config,date),'');
 }
 assert.equal(priceFor('care',C,before).display,priceFor('care',C,after).display);
});
import { getEstimatorResult,buildSnapshotText,renderPricePath } from '../production/js/estimator.js';
const answers={business_type:'medical_wellness',location_count:'one',current_systems:[],follow_up_process:'manual'};
test('estimator B and D paths, custom Diagnostic, and clipboard use the same program state',()=>{
 for(const a of [answers,{...answers,follow_up_process:'depends'}]){
  const r=getEstimatorResult(a,{config:C,now:before});assert.match(r.total,/\$5,750/);assert.equal(r.path[0].display,'$750');
  assert.match(renderPricePath(r),/founding/);assert.match(buildSnapshotText(a,{config:C,now:before}),/3 of 3 spots open/);
  const standard=getEstimatorResult(a,{config:C,now:after});assert.match(standard.total,/\$9,000/);assert.equal(standard.path[0].display,'$1,500');assert.equal(standard.foundingLine,'');
 }
 const custom=getEstimatorResult({...answers,location_count:'six_plus'},{config:C,now:before});assert.equal(custom.path.length,1);assert.equal(custom.path[0].display,'$750');
});
test('static builder renders ON and all OFF variants from config',()=>{
 const html=fs.readFileSync(new URL('../production/index.html',import.meta.url),'utf8');
 const on=renderFoundingHTML(html,C,before);
 for(const region of ['hero','banner','faq','card-diagnostic','card-foundation','card-operations','panel-diagnostic','panel-foundation','panel-operations'])assert.ok(on.includes(`data-founding-region="${region}">`));
 assert.match(on,/data-price-key="diagnostic">\$750/);
 assert.equal((on.match(/data-cta-location="pricing"/g)||[]).length,1);
 assert.match(on,/Just need upkeep\? Systems Care,/);
 for(const [config,date] of [[off({enabled:false}),before],[off({spotsRemaining:0}),before],[C,after]]){
  const out=renderFoundingHTML(html,config,date);
  assert.doesNotMatch(out,/Founding Clinic pricing|founding price|Founding price|\$750|\$2,500/);
  assert.match(out,/data-price-key="diagnostic">\$1,500/);
  assert.match(out,/data-price-key="foundation">From \$7,500/);
  assert.match(out,/data-price-key="care" data-price-exact>\$350\/month/);
 }
 assert.doesNotMatch(on,/<(?:s|del)\b|was \$|countdown/i);
});
test('new founding copy keeps sentences under 21 words',()=>{
 for(const region of ['hero','banner','faq','panel-diagnostic','panel-foundation','panel-operations']){
  const text=foundingMarkup(region,C,before).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  // Check sentence-based copy, excluding UI labels before the first sentence.
  for(const sentence of text.split(/[.!?]/).slice(1,-1))assert.ok(sentence.trim().split(/\s+/).length<=20,sentence);
 }
});
