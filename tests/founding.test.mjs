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
