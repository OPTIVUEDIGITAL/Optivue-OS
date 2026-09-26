import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const answers={business_type:'medical_wellness',location_count:'one',monthly_inquiries:'10_25',primary_problem:'cant_tell',follow_up_process:'manual',response_speed:'same_day',current_systems:['booking'],marketing_spend:'1000_2499',decision_role:'owner'};
await fs.mkdir('shots',{recursive:true});
for(const width of [390,1440])for(const mode of ['on','disabled','filled','expired']) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.addInitScript(({expired})=>{
  const RealDate=Date;
  const value=expired?'2027-02-01T00:01:00Z':'2026-09-26T12:00:00Z';
  window.Date=class extends RealDate {constructor(...args){super(...(args.length?args:[value]));}static now(){return new RealDate(value).getTime();}};
  window.dataLayer=[];
 },{expired:mode==='expired'});
 if(mode==='disabled'||mode==='filled')await context.route('**/js/estimator-config.js',async route=>{
  const response=await route.fetch();let body=await response.text();
  body=mode==='disabled'?body.replace('enabled: true, spotsTotal','enabled: false, spotsTotal'):body.replace('spotsRemaining: 3','spotsRemaining: 0');
  await route.fulfill({response,body});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787',{waitUntil:'networkidle'});
 const active=mode==='on';
 assert.equal(await page.locator('[data-founding-hero]').isVisible(),active);
 assert.equal(await page.locator('.ovgo-founding-banner').isVisible(),active);
 assert.equal(await page.locator('[data-founding-region="faq"] details').count(),active?3:0);
 assert.equal(await page.locator('#pricing [data-ovgo-booking]').count(),1);
 assert.equal(await page.locator('[data-pricing-trigger="diagnostic"] [data-price-key]').textContent(),active?'$750':'$1,500');
 assert.equal(await page.locator('[data-pricing-trigger="foundation"] [data-price-key]').textContent(),active?'from $5,000':'From $7,500');
 assert.equal(await page.locator('[data-pricing-trigger="operations"] [data-price-key]').textContent(),active?'$2,500':'From $3,500');
 assert.equal(await page.locator('[data-price-key="care"]').textContent(),'$350/month');
 await page.locator('[data-pricing-trigger="foundation"]').click();
 assert.equal(await page.locator('[data-founding-region="panel-foundation"]').isVisible(),active);
 if(active){
  await page.locator('[data-founding-terms] summary').click();
  assert.equal(await page.locator('[data-founding-terms]').getAttribute('open'),'');
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 await page.locator('#pricing').screenshot({path:`shots/founding-${mode}-${width}.png`});
 await page.goto('http://127.0.0.1:8787/estimator',{waitUntil:'networkidle'});
 await page.evaluate(answers=>sessionStorage.setItem('optivue-estimator-v2',JSON.stringify({version:2,screen:'result',step:8,answers,insightCount:0})),answers);
 await page.reload({waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 const result=await page.locator('.ovgo-estimator-result').textContent();
 assert.ok(result.includes(active?'$5,750':'$9,000'));
 assert.equal(result.includes('Founding Clinic pricing: 3 of 3 spots open.'),active);
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedSnapshot=text;}}});});
 await page.getByRole('button',{name:'Copy my snapshot',exact:true}).click();
 const copy=await page.evaluate(()=>window.copiedSnapshot);
 assert.ok(copy.includes(active?'$5,750':'$9,000'));
 assert.equal(copy.includes('Founding Clinic pricing:'),active);
 const events=await page.evaluate(()=>window.dataLayer.filter(e=>e.event.startsWith('estimator_')));
 assert.ok(events.length>0);assert.ok(events.every(e=>e.founding_active===active));
 assert.deepEqual(errors,[]);
 await context.close();console.log(`PASS founding ${mode} ${width}px: cards, breakdowns, FAQ, expiry, estimator, clipboard, analytics`);
}
const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
await page.goto('http://127.0.0.1:8787');
assert.equal(await page.locator('.ovgo-founding-banner').isVisible(),true);
assert.equal(await page.locator('[data-pricing-summary] [data-price-key="diagnostic"]').textContent(),'$750');
console.log('PASS founding static content without JavaScript');
await browser.close();
