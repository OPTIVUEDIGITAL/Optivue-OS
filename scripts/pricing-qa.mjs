import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PRICING_BREAKDOWNS } from '../production/js/pricing-config.js';
const browser=await chromium.launch({headless:true});
const keys=['diagnostic','foundation','operations'];
await fs.mkdir('shots',{recursive:true});
for(const width of [390,768,1023,1024,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 await page.route('https://calendly.com/**',route=>route.fulfill({status:200,body:'Booking test'}));
 await page.goto('http://127.0.0.1:8787',{waitUntil:'networkidle'});
 await page.evaluate(()=>{window.dataLayer=[];});
 assert.equal(await page.locator('#pricing [data-ovgo-booking]').count(),1);
 for(const key of keys){
  await page.locator(`[data-pricing-trigger="${key}"]`).click();
  assert.equal(await page.locator(`[data-breakdown="${key}"]`).isVisible(),true);
  for(const other of keys.filter(k=>k!==key))assert.equal(await page.locator(`[data-breakdown="${other}"]`).isVisible(),false);
  assert.equal(await page.locator('[data-ovgo-modal]').isVisible(),false);
 }
 if(width>=1024){
  await page.locator('[data-pricing-trigger="operations"]').press('ArrowRight');
  assert.equal(await page.locator('[data-pricing-trigger="diagnostic"]').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('[data-pricing-desktop-panel] [data-breakdown="diagnostic"]').isVisible(),true);
  await page.locator('[data-pricing-trigger="diagnostic"]').press('End');
  assert.equal(await page.locator('[data-pricing-trigger="operations"]').getAttribute('aria-selected'),'true');
 } else {
  const trigger=page.locator('[data-pricing-trigger="diagnostic"]');
  await trigger.focus();await trigger.press('Enter');
  assert.equal(await page.locator('[data-breakdown="diagnostic"]').isVisible(),true);
  await trigger.press('Space');assert.equal(await page.locator('[data-breakdown="diagnostic"]').isVisible(),false);
  await trigger.press('Tab');
  assert.equal(await page.locator('#pricing [data-ovgo-booking]').evaluate(e=>document.activeElement===e),true);
 }
 await page.locator('[data-price-plan="90-Day Growth Foundation Launch"] .ovgo-pricing-action').click();
 assert.equal(await page.locator('[data-breakdown="foundation"]').isVisible(),true);
 const before=await page.locator('[data-breakdown]:visible').count();
 await page.locator('#pricing [data-ovgo-booking]').click();
 assert.equal(await page.locator('[data-ovgo-modal]').isVisible(),true);
 assert.equal(await page.locator('[data-breakdown]:visible').count(),before);
 await page.keyboard.press('Escape');
 await page.locator('[data-pricing-toggle="care"]').click();
 assert.equal(await page.locator('[data-breakdown="care"]').isVisible(),true);
 if(width<1024)assert.equal(await page.locator('[data-breakdown]:visible').count(),1);
 for(const [key,config] of Object.entries(PRICING_BREAKDOWNS)){
  const text=await page.locator(`[data-breakdown="${key}"]`).textContent();
  for(const item of config.items)assert.ok(text.includes(`${item.label}: ${item.text}`));
  for(const field of ['timeline','needs','excluded','closing','intro'])if(config[field])assert.ok(text.includes(config[field]));
 }
 const events=await page.evaluate(()=>window.dataLayer.filter(e=>e.event==='pricing_breakdown_open'));
 assert.ok(events.some(e=>e.tier==='care'&&e.device===(width>=1024?'desktop':'mobile')));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 await page.locator('#pricing').screenshot({path:`shots/pricing-${width}.png`});
 await page.close();
 console.log(`PASS pricing ${width}px: triggers, keyboard, booking isolation, copy, analytics, overflow`);
}
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},javaScriptEnabled:false});
 await page.goto('http://127.0.0.1:8787');
 for(const key of [...keys,'care'])assert.equal(await page.locator(`[data-breakdown="${key}"]`).isVisible(),true);
 await page.close();console.log(`PASS no-JS breakdowns ${width}px`);
}
await browser.close();
