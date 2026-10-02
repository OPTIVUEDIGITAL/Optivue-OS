import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HERO_CONFIG } from '../production/js/hero-config.js';
import { phraseCycle, initHeroTypewriter } from '../production/js/hero-typewriter.js';
import { renderHeroHeadline } from '../scripts/build-hero.mjs';
const html=fs.readFileSync(new URL('../production/index.html',import.meta.url),'utf8');
test('hero static HTML, accessible heading and configured reservations match',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.includes(renderHeroHeadline()));
 assert.equal(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g,''),'Turn more leads into booked visits');
 assert.ok(html.includes('aria-hidden="true" class="ovgo-hero-headline-visual"'));
 assert.ok(html.includes('I build the systems that turn attention into qualified leads, booked calls, and revenue.'));
 assert.equal(HERO_CONFIG.phrases.length,8);
 assert.equal(HERO_CONFIG.phrases[0],'booked visits');
 assert.equal(HERO_CONFIG.typeMs,70);assert.equal(HERO_CONFIG.deleteMs,40);
 assert.equal(HERO_CONFIG.holdMs,1800);assert.equal(HERO_CONFIG.gapMs,400);
});
test('every cycle starts with booked visits, includes each phrase once and never repeats at boundaries',()=>{
 let previous;
 const orders=new Set();
 for(let i=0;i<100;i++) {
  const cycle=phraseCycle(HERO_CONFIG.phrases);
  assert.equal(cycle[0],'booked visits');
  assert.deepEqual([...cycle].sort(),[...HERO_CONFIG.phrases].sort());
  for(const phrase of cycle){assert.notEqual(previous,phrase);previous=phrase;}
  orders.add(cycle.join('|'));
 }
 assert.ok(orders.size>1);
});
function harness(reduced=false) {
 let now=0,id=0;const jobs=new Map(),events={},motionEvents={};
 const motion={matches:reduced,addEventListener:(k,f)=>motionEvents[k]=f,removeEventListener:k=>delete motionEvents[k]};
 const win={matchMedia:()=>motion,performance:{now:()=>now},setTimeout:(f,delay)=>{jobs.set(++id,{f,at:now+delay});return id;},clearTimeout:id=>jobs.delete(id)};
 const doc={defaultView:win,hidden:false,addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k]};
 const text={textContent:''};const hero={dataset:{},ownerDocument:doc,querySelector:selector=>selector==='[data-hero-phrase]'?text:null};
 const cleanup=initHeroTypewriter({querySelector:()=>hero});
 function advance(ms){const end=now+ms;while(true){const entry=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(!entry||entry[1].at>end)break;now=entry[1].at;jobs.delete(entry[0]);entry[1].f();}now=end;}
 return {advance,text,doc,events,motion,motionEvents,jobs,cleanup};
}
test('typing timing and hidden-tab pause preserve remaining delay without catch-up',()=>{
 const h=harness();assert.equal(h.text.textContent,'booked visits');
 h.advance(1000);h.doc.hidden=true;h.events.visibilitychange();h.advance(10000);
 assert.equal(h.text.textContent,'booked visits');assert.equal(h.jobs.size,0);
 h.doc.hidden=false;h.events.visibilitychange();h.advance(799);assert.equal(h.text.textContent,'booked visits');
 h.advance(1);assert.equal(h.text.textContent,'booked visit');
 h.advance(40);assert.equal(h.text.textContent,'booked visi');
 h.cleanup();assert.equal(h.jobs.size,0);
});
test('reduced motion starts static and changing preference resets and stops typing',()=>{
 const h=harness(true);h.advance(30000);assert.equal(h.text.textContent,'booked visits');assert.equal(h.jobs.size,0);
 h.motion.matches=false;h.motionEvents.change();h.advance(1800);assert.equal(h.text.textContent,'booked visit');
 h.motion.matches=true;h.motionEvents.change();h.advance(30000);assert.equal(h.text.textContent,'booked visits');assert.equal(h.jobs.size,0);
});
