import test from 'node:test';import assert from 'node:assert/strict';
import {resolveConsent,makeConsent} from '../src/js/consent-core.js';
const now=Date.UTC(2026,9,25);
test('default denies every optional category',()=>assert.deepEqual(resolveConsent(null,now,false).choices,{analytics:false,functional:false,marketing:false}));
test('valid choices persist; version and expiry re-prompt',()=>{const r=makeConsent({analytics:true},now);assert.equal(resolveConsent(r,now+1,false).choices.analytics,true);assert.equal(resolveConsent({...r,version:'old'},now,false).known,false);assert.equal(resolveConsent(r,Date.UTC(2027,4,1),false).known,false);});
test('GPC overrides saved banner acceptance but permits explicit preferences',()=>{const r=makeConsent({analytics:true,functional:true},now);assert.equal(resolveConsent(r,now,true).choices.analytics,false);assert.equal(resolveConsent({...r,explicitGpcOverride:true},now,true).choices.analytics,true);});
test('withdrawal records only denied values and no identity',()=>{const r=makeConsent({},now);assert.deepEqual(r.choices,{analytics:false,functional:false,marketing:false});assert.deepEqual(Object.keys(r).sort(),['choices','explicitGpcOverride','timestamp','version']);});
test('malformed, future and forged records fail closed',()=>{for(const r of [{},makeConsent({analytics:true},now+10000),{version:'1.0',timestamp:now,choices:{analytics:'yes'}}])assert.equal(resolveConsent(r,now,false).choices.analytics,false);});
