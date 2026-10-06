import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
await fs.mkdir('shots',{recursive:true});
for(const width of [390,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8787',{waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-ovgo-modal]').isVisible(),false);
 assert.equal(await page.locator('h1').textContent(),'Turn more leads into booked visits');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 assert.equal(await page.locator('#pricing [data-ovgo-booking]').count(),1);
 for(const key of ['diagnostic','foundation','operations']) {
  await page.locator(`[data-pricing-trigger="${key}"]`).click();
  assert.equal(await page.locator(`[data-breakdown="${key}"]`).isVisible(),true);
  assert.equal(await page.locator('[data-breakdown]:visible').count(),1);
 }
 await page.locator('[data-pricing-toggle="operations"]').click();
 await page.screenshot({path:`shots/trim-copy-${width}.png`,fullPage:true});
 await page.locator('#pricing [data-ovgo-booking]').click();
 assert.equal(await page.locator('[data-ovgo-modal]').isVisible(),true);
 assert.equal(await page.locator('[data-breakdown="operations"]').isVisible(),false);
 console.log(`PASS ${width}px: modal hidden by default, no overflow, exact H1, one CTA, mutually exclusive pricing panels, booking separate`);
 await page.close();
}
await browser.close();
