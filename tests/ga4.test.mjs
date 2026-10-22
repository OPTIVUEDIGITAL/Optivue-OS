import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const loader = fs.readFileSync(new URL('../production/js/ga4.js', import.meta.url), 'utf8');
const analytics = fs.readFileSync(new URL('../production/js/analytics.js', import.meta.url), 'utf8').replace(/export /g, '');
const booking = fs.readFileSync(new URL('../production/js/booking.js', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '').replace(/export /g, '');
import { initEstimator } from '../production/js/estimator.js';
const host = 'https://growth.optivuedigital.com';

function harness(url = host + '/', storage = new Map(), blocked = false) {
  const calls = [], scripts = [], order = [], notifications = [];
  const location = new URL(url);
  location.assign = value => { location.assigned = value; };
  const context = { URL, URLSearchParams, Date, WeakSet, Set, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    sessionStorage: { getItem(k) { if (blocked) throw Error('blocked'); return storage.get(k) ?? null; }, setItem(k,v) { if (blocked) throw Error('blocked'); storage.set(k,v); }, removeItem(k) { storage.delete(k); } },
    document: { referrer: 'https://calendly.com/event?invitee_email=private@example.com', title: 'Growth OS', createElement: () => ({}), head: { appendChild: s => scripts.push(s) } },
    history: { state: null, replaceState(_s,_t,path) { order.push('clean'); const u = new URL(path, location); location.href = u.href; } },
  };
  context.window = { location, gtag(...args) { calls.push(args); order.push(args[0]); }, dispatchEvent(e) { notifications.push(e); } };
  context.location = location;
  context.window.sessionStorage = context.sessionStorage;
  context.window.history = context.history;
  vm.createContext(context);
  return { context, calls, scripts, order, storage, notifications, run: () => vm.runInContext(loader, context) };
}

test('preview and localhost never initialize Google or send GA4 events', () => {
  for (const url of ['https://preview.workers.dev/', 'http://localhost/', 'https://growth.optivuedigital.com.evil.test/']) {
    const h = harness(url); h.run(); vm.runInContext(analytics, h.context);
    vm.runInContext("trackEvent('book_fit_call_click', {cta_location:'hero'})",h.context);
    assert.equal(h.scripts.length,0); assert.equal(h.calls.length,0);
  }
});

test('loader inserts one Google script and config once despite repeated execution', () => {
  const h = harness(); h.run(); h.run();
  assert.equal(h.scripts.length,1);
  assert.equal(h.calls.filter(c=>c[0]==='config').length,1);
  assert.equal(h.calls.find(c=>c[0]==='config')[1],'G-9XBD3QZ5BQ');
});

test('thank-you strips the entire query and hash before any analytics config', () => {
  const h = harness(host+'/thank-you?src=calendly&invitee_email=private@example.com&answer_1=secret#private'); h.run();
  assert.equal(h.context.location.href,host+'/thank-you');
  assert.ok(h.order.indexOf('clean') < h.order.indexOf('config'));
  const cfg = h.calls.find(c=>c[0]==='config')[2];
  assert.equal(cfg.page_location,host+'/thank-you');
  assert.equal(cfg.page_referrer,'https://calendly.com/');
  assert.ok(!JSON.stringify(h.calls).includes('private'));
});

test('only marked thank-you counts a booking, once per tab session', () => {
  const storage = new Map();
  for (const url of [host+'/?src=calendly',host+'/thank-you',host+'/thank-you?src=other']) {
    const h=harness(url);h.run();assert.equal(h.calls.filter(c=>c[1]==='fit_call_booked').length,0);
  }
  const h=harness(host+'/thank-you?src=calendly',storage);h.run();
  const event=h.calls.find(c=>c[1]==='fit_call_booked');
  assert.deepEqual(JSON.parse(JSON.stringify(event)),['event','fit_call_booked',{booking_source:'calendly'}]);
  assert.equal(storage.get('ov_fcb_sent'),'1');
  const revisit=harness(host+'/thank-you?src=calendly',storage);revisit.run();
  assert.equal(revisit.calls.filter(c=>c[1]==='fit_call_booked').length,0);
});

test('blocked storage leaves pageview usable and skips un-deduplicated booking', () => {
  const h=harness(host+'/thank-you?src=calendly',new Map(),true);
  assert.doesNotThrow(h.run);
  assert.equal(h.calls.filter(c=>c[0]==='config').length,1);
  assert.equal(h.calls.filter(c=>c[1]==='fit_call_booked').length,0);
});

test('readable but unwritable storage never queues a booking conversion', () => {
  const h=harness(host+'/thank-you?src=calendly');
  h.context.sessionStorage.setItem=()=>{throw Error('quota');};h.run();
  assert.equal(h.calls.filter(c=>c[1]==='fit_call_booked').length,0);
});

test('framed Calendly redirect promotes a clean URL and sends no iframe analytics', () => {
  const h=harness(host+'/thank-you?src=calendly&invitee_email=private@example.com');
  let destination;h.context.window.self=h.context.window;
  h.context.window.top={location:{replace:u=>destination=u}};h.run();
  assert.equal(destination,host+'/thank-you?src=calendly');assert.equal(h.calls.length,0);
});

test('footer and sticky CTA sections retain their controlled location labels', () => {
  const h=harness();vm.runInContext(analytics,h.context);
  vm.runInContext("trackEvent('book_fit_call_click',{cta_location:'footer'});trackEvent('book_fit_call_click',{cta_location:'sticky'})",h.context);
  assert.deepEqual(h.calls.map(c=>c[2].cta_location),['footer','sticky']);
});

test('shared analytics forwards only approved interaction names and enum locations', () => {
  const h=harness();vm.runInContext(analytics,h.context);
  vm.runInContext("trackEvent('book_fit_call_click',{cta_location:'hero',email:'private@example.com'});trackEvent('request_audit_click',{cta_location:'pricing'});trackEvent('estimator_start');trackEvent('estimator_complete');trackEvent('fit_call_booked');trackEvent('estimator_question_answered',{business_type:'private'})",h.context);
  assert.deepEqual(h.calls.map(c=>c[1]),['book_fit_call_click','request_audit_click','estimator_start','estimator_complete']);
  assert.ok(!JSON.stringify(h.calls).includes('private'));
  assert.equal(h.calls[0][2].cta_location,'hero');
});

test('legacy local hooks remain available without sending arbitrary events to GA4', () => {
  const h=harness('http://localhost/');h.context.window.dataLayer=[];vm.runInContext(analytics,h.context);
  vm.runInContext("trackEvent('pricing_breakdown_open',{tier:'care',device:'mobile',email:'private@example.com'})",h.context);
  assert.equal(h.calls.length,0);
  assert.equal(h.context.window.dataLayer[0].event,'pricing_breakdown_open');
  assert.equal(h.context.window.dataLayer[0].tier,'care');
  assert.equal(h.notifications.length,1);
});

test('validated iframe completion redirects parent once and never counts a booking itself', () => {
  const h=harness(); const handlers={}; const frame={contentWindow:{}}; const modal={hidden:false};
  const redirects=[]; let registrations=0;
  h.context.location.assign=value=>redirects.push(value);
  h.context.setJourneyFlag=()=>{};h.context.snapshot=()=>({identity:{}});h.context.trackEvent=(...args)=>h.calls.push(args);
  h.context.window.addEventListener=(name,fn)=>{registrations++;handlers[name]=fn;};
  h.context.document.addEventListener=()=>{};
  const root={querySelector:s=>s==='[data-ovgo-modal]'?modal:s==='[data-ovgo-calendly]'?frame:null,querySelectorAll:()=>[],addEventListener:()=>{}};
  h.context.root=root;vm.runInContext(booking+'\ninitBooking(root);initBooking(root);',h.context);
  assert.equal(registrations,1);
  const data={event:'calendly.event_scheduled'};
  Object.defineProperty(data,'payload',{get(){throw Error('Invitee payload must never be read');}});
  const message={origin:'https://calendly.com',source:frame.contentWindow,data};
  for (const origin of ['https://evil.test','https://calendly.com.evil.test','http://calendly.com','https://sub.calendly.com','null']) {
    handlers.message({...message,origin});
  }
  handlers.message({...message,source:{}});
  handlers.message({...message,data:{event:'calendly.event_type_viewed'}});
  handlers.message({...message,data:null});
  modal.hidden=true;handlers.message(message);modal.hidden=false;
  assert.equal(redirects.length,0);
  for(let i=0;i<3;i++) handlers.message(message);
  assert.deepEqual(redirects,['/thank-you?src=calendly']);
  const destination=harness(host+redirects[0],h.storage);destination.run();
  const events=destination.calls.filter(c=>c[1]==='fit_call_booked');
  assert.deepEqual(JSON.parse(JSON.stringify(events)),[['event','fit_call_booked',{booking_source:'calendly'}]]);
  const revisit=harness(host+redirects[0],h.storage);revisit.run();
  assert.equal(revisit.calls.filter(c=>c[1]==='fit_call_booked').length,0);
  assert.deepEqual(h.calls.map(c=>c[0]),['calendly_step_view','calendly_step_view']);
  assert.deepEqual(h.calls.map(c=>c[1].step),['event_type','scheduled']);
  assert.equal(h.calls.filter(c=>c[0]==='fit_call_booked').length,0);
});

test('thank-you route is statically readable, noindex, and absent from sitemap', () => {
  const html=fs.readFileSync(new URL('../production/thank-you/index.html',import.meta.url),'utf8');
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
  assert.equal((html.match(/src="\/js\/ga4.js"/g)||[]).length,1);
  assert.match(html,/Check your inbox/);
  const headers=fs.readFileSync(new URL('../production/_headers',import.meta.url),'utf8');
  assert.match(headers,/\/thank-you\n\s+X-Robots-Tag: noindex, nofollow\n\s+Cache-Control: no-store/);
  assert.doesNotMatch(fs.readFileSync(new URL('../production/sitemap.xml',import.meta.url),'utf8'),/thank-you/);
});

test('returning to estimator intro does not double-count a started attempt', () => {
  const h=harness();const previousWindow=globalThis.window;const previousStorage=globalThis.sessionStorage;
  globalThis.window=h.context.window;window.matchMedia=()=>({matches:true});globalThis.sessionStorage=h.context.sessionStorage;
  const elements=new Map();
  const mount={innerHTML:'',querySelector(selector){
    if(selector.includes('insight'))return null;
    if(!elements.has(selector))elements.set(selector,{handlers:{},addEventListener(n,fn){this.handlers[n]=fn;},focus(){}});
    return elements.get(selector);
  }};
  const root={querySelector:()=>mount};
  try {
    initEstimator(root);
    elements.get('[data-estimator-start]').handlers.click();
    elements.get('[data-estimator-back]').handlers.click();
    elements.get('[data-estimator-start]').handlers.click();
    assert.equal(h.calls.filter(c=>c[1]==='estimator_start').length,1);
  } finally {globalThis.window=previousWindow;globalThis.sessionStorage=previousStorage;}
});

test('behavior events send only approved values and strip all contact data',()=>{
 const h=harness();vm.runInContext(analytics,h.context);
 vm.runInContext(`trackEvent('scroll_depth',{percent_scrolled:50,email:'private@example.com'});trackEvent('section_view',{section_id:'about',name:'private'});trackEvent('estimator_question_answered',{question_number:2,business_type:'private'});trackEvent('growth_map_interaction',{action:'details',payload:'private'});trackEvent('pricing_breakdown_open',{tier:'diagnostic',device:'mobile',email:'private'});`,h.context);
 assert.deepEqual(h.calls.map(c=>c[1]),['scroll_depth','section_view','estimator_question_answered','growth_map_interaction','pricing_breakdown_open']);
 assert.ok(!JSON.stringify(h.calls).includes('private'));
});
test('invalid behavior fields and unapproved events never reach GA4',()=>{
 const h=harness();vm.runInContext(analytics,h.context);
 vm.runInContext(`trackEvent('scroll_depth',{percent_scrolled:51});trackEvent('section_view',{section_id:'private@example.com'});trackEvent('growth_map_interaction',{action:'private'});trackEvent('estimator_question_answered',{question_number:999});trackEvent('random_event',{email:'private'});`,h.context);
 assert.equal(h.calls.length,0);
});
test('all new behavior events stay local on the private review site',()=>{
 const h=harness('https://optivue-growth-review-oct23.rahmeldc.chatgpt.site/site.html');vm.runInContext(analytics,h.context);
 vm.runInContext(`trackEvent('scroll_depth',{percent_scrolled:90});trackEvent('section_view',{section_id:'about'});trackEvent('growth_map_interaction',{action:'details'});`,h.context);
 assert.equal(h.calls.length,0);assert.equal(h.notifications.length,3);
});
