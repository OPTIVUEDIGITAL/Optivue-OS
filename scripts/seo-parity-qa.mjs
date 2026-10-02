import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
await fs.mkdir('shots',{recursive:true});
for(const width of [390,768,1440]){
 const pages=[];
 for(const port of [8788,8787]){
  const p=await browser.newPage({viewport:{width,height:900}});
  await p.addInitScript(()=>{let seed=7;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;});
  await p.clock.install({time:new Date('2026-10-02T00:00:00Z')});
  await p.clock.pauseAt(new Date('2026-10-02T00:00:01Z'));
  await p.goto(`http://127.0.0.1:${port}`,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  pages.push(p);
 }
 const capture=async p=>p.evaluate(()=>{
  const phrase=document.querySelector('[data-hero-phrase]'), caret=document.querySelector('.ovgo-hero-phrase-live .ovgo-hero-caret');
  const box=e=>{const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(v=>Math.round(v*100)/100)};
  const style=getComputedStyle(phrase);
  return {phrase:phrase.textContent,phraseBox:box(phrase),cta:box(document.querySelector('[data-cta-location="hero"]')),caret:box(caret),font:style.font,variation:style.fontVariationSettings,spacing:style.letterSpacing,animation:getComputedStyle(caret).animationName};
 });
 for(const ms of [0,1800,40,400,5000,9000,19000,30000]){
  for(const p of pages)await p.clock.runFor(ms);
  assert.deepEqual(await capture(pages[1]),await capture(pages[0]),`hero parity ${width}px after ${ms}ms`);
  assert.equal(await pages[1].locator('h1').textContent(),'Turn more leads into booked visits');
 }
 for(let i=0;i<pages.length;i++){
  await pages[i].emulateMedia({reducedMotion:'reduce'});await pages[i].clock.resume();
  await pages[i].waitForFunction(()=>document.querySelector('[data-hero-phrase]').textContent==='booked visits');
  await pages[i].screenshot({path:`shots/seo-${i?'after':'before'}-${width}.png`,fullPage:true});
 }
 assert.deepEqual(await pages[1].locator('[data-cta-location="hero"]').boundingBox(),await pages[0].locator('[data-cta-location="hero"]').boundingBox());
 for(const p of pages)await p.close();
 console.log(`PASS ${width}px: seeded phrase order, timings, font, caret, CTA position, reduced motion`);
}
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
await nojs.goto('http://127.0.0.1:8787');
assert.equal(await nojs.locator('h1').textContent(),'Turn more leads into booked visits');
assert.equal(await nojs.locator('h1').isVisible(),true);
const response=await nojs.request.get('http://127.0.0.1:8787/assets/growth-os-social.png');
assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/image\/png/);
await browser.close();
console.log('PASS no-JS headline and social-image HTTP response');
