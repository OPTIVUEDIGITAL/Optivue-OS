import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyticsEnvironment,PREVIEW_HOST} from '../../src/js/analytics-config.js';
import {sanitizeBehaviorParameters} from '../../src/js/analytics.js';
import {isCalendlyMessage,buildCalendlyUrl} from '../../src/js/booking.js';
import vm from 'node:vm';

test('requested section order and concept pricing survive integration',async()=>{
 const s=await readFile('dist/index.html','utf8');
 const ids=[...s.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(ids,['overview','growth-map','who-its-for','ownership','systems','reporting','package-intro','packages','care','ownership-steps','compare','questions','final']);
 for(const text of ['$800','$5,000','$3,500','$2,000','Build a visible, connected appointment-conversion system.','data-ovgo-calendly','Choose the level of help you need.'])assert(s.includes(text));
 assert(!s.includes('Package enquiry preview'));assert(!s.includes('Diagnose. Build. Improve.'));
 const map=await readFile('dist/growth-map/index.html','utf8');
 assert(!map.includes('growth-map-founder.webp'));assert(!map.includes('6 lines · 24 stops'));assert(!map.includes('Founder, Optivue Digital'));
});
test('policy pages keep branding and correct home links',async()=>{
 for(const f of ['privacy','terms','cookies']){const s=await readFile('dist/'+f+'/index.html','utf8');assert(s.includes('id="ovgo-mobile-menu"'));assert(s.includes('href="/#packages"'));assert(s.includes('mailto:rahmel@optivuedigital.com'));}
});
test('analytics accepts only intended hosts and controlled interaction fields',()=>{
 assert.equal(analyticsEnvironment(PREVIEW_HOST),null);
 assert.equal(analyticsEnvironment('growth.optivuedigital.com'),'production');
 assert.equal(analyticsEnvironment('terminal.local'),null);
 assert.equal(analyticsEnvironment('evil-'+PREVIEW_HOST),null);
 assert.deepEqual(sanitizeBehaviorParameters('section_view',{section_id:'packages',email:'private@example.com'}),{section_id:'packages'});
 assert.equal(sanitizeBehaviorParameters('section_view',{section_id:'private@example.com'}),null);
});
test('booking messages require both Calendly origin and the actual iframe',()=>{
 const frame={}; assert(isCalendlyMessage({origin:'https://calendly.com',source:frame},frame));
 assert(!isCalendlyMessage({origin:'https://calendly.com.evil.test',source:frame},frame));
 assert(!isCalendlyMessage({origin:'https://calendly.com',source:{}},frame));
 const u=new URL(buildCalendlyUrl('https://calendly.com/example/call','https://site.test/?utm_source=test&email=private@example.com'));
 assert.equal(u.searchParams.get('utm_source'),'test');assert(!u.searchParams.has('email'));
});
test('GA4 waits for consent, configures once, guards production and redacts URL queries',async()=>{
 const source=(await readFile('src/js/ga4.js','utf8')).replace(/^import .*;\n/gm,'');
 let consent=false;const listeners={}, scripts=[];const root={dataset:{}};
 const document={referrer:'https://example.com/path?email=private',documentElement:root,readyState:'complete',head:{appendChild:s=>scripts.push(s)},createElement:()=>({dataset:{},addEventListener(){}}),addEventListener(){}};
 const window={location:{href:'https://growth.optivuedigital.com/?email=private@example.com'},addEventListener:(n,f)=>listeners[n]=f};
 const context={window,document,URL,Date,allows:()=>consent,clearAnalytics(){},initConsent(){},analyticsEnvironment};
 vm.runInNewContext(source,context);assert.equal(scripts.length,0);
 consent=true;listeners['optivue:consentchange']();assert.equal(scripts.length,1);
 listeners['optivue:consentchange']();assert.equal(scripts.length,1);
 const config=window.dataLayer.find(x=>x[0]==='config');assert.equal(config[1],'G-9XBD3QZ5BQ');assert.equal(config[2].cookie_expires,15552000);assert.equal(config[2].cookie_update,false);assert.equal(config[2].site_environment,'production');assert.equal(config[2].debug_mode,undefined);assert.equal(config[2].page_location,'https://growth.optivuedigital.com/');assert.equal(config[2].page_referrer,'https://example.com/');
 assert(!JSON.stringify(window.dataLayer).includes('private@example.com'));
});

test('footer cleanup removes booking section and extra navigation while keeping cookie preferences',async()=>{const s=await readFile('dist/index.html','utf8');assert(!s.includes('id="booking"'));assert(!s.includes('aria-label="Footer navigation"'));assert(s.includes('<a href="/cookies#preferences" data-cookie-settings>Cookie settings</a>'));assert(s.includes('data-ovgo-modal'));});

test('thank-you counts once across repeat redirects and never counts an ordinary page visit',async()=>{
 const source=(await readFile('src/js/ga4.js','utf8')).replace(/^import .*;\n/gm,'');
 const data=new Map();
 function run(href){
  const window={location:{href},addEventListener(){}};
  const document={referrer:'',documentElement:{dataset:{}},readyState:'complete',head:{appendChild(){}},createElement:()=>({dataset:{},addEventListener(){}}),addEventListener(){}};
  const context={window,document,URL,Date,history:{state:null,replaceState(){}},sessionStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},allows:()=>true,clearAnalytics(){},initConsent(){},analyticsEnvironment};
  vm.runInNewContext(source,context);return window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='fit_call_booked');
 }
 assert.equal(run('https://growth.optivuedigital.com/thank-you').length,0);
 assert.equal(run('https://growth.optivuedigital.com/thank-you?src=calendly&invitee_email=private@example.com').length,1);
 assert.equal(run('https://growth.optivuedigital.com/thank-you?src=calendly').length,0);
});

test('estimator does not promise disabled audit credit',async()=>{
 const {getEstimatorResult}=await import('../../src/js/estimator.js');
 const result=getEstimatorResult({response_speed:'next_day'});
 assert(!result.pathNote.includes('credited'));assert(!result.total.includes('credited'));
});
