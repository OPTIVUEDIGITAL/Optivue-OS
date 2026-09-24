import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { ESTIMATOR_CONFIG } from '../production/js/estimator-config.js';
const source = (await readFile(new URL('../production/js/optivue.js', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '');
test('homepage initializes stage content, prices and booking without a startup exception', () => {
  const element = () => ({ textContent: '', innerHTML: '', setAttribute() {}, addEventListener() {}, classList: { toggle() {} } });
  const stage = { ...element(), dataset: { stage: 'acquire' } };
  const fields = Object.fromEntries(['index','name','title','purpose','tools','capabilities'].map(key => [`[data-stage-${key}]`, element()]));
  const prices = Object.keys(ESTIMATOR_CONFIG.prices).map(key => ({...element(), dataset:{priceKey:key}}));
  let booking = false;
  const root = {dataset:{},querySelector:selector=>fields[selector] || null, querySelectorAll:selector=>selector==='[data-stage]'?[stage]:selector==='[data-price-key]'?prices:[]};
  vm.runInNewContext(source, {
    document:{getElementById:()=>root,documentElement:{style:{}}},
    localStorage:{getItem:()=>null},
    window:{matchMedia:()=>({matches:true}),innerWidth:1440,addEventListener(){}},
    ESTIMATOR_CONFIG,RUNTIME_CONFIG:{foundingClinicEnabled:false},addJourneyValue(){},
    initBooking(){booking=true;},initEstimator(){},
  });
  assert.ok(fields['[data-stage-purpose]'].textContent.length>0);
  assert.equal(booking,true);
  assert.deepEqual(prices.map(p=>p.textContent),Object.values(ESTIMATOR_CONFIG.prices).map(p=>p.display));
});
