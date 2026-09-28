import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const answers={business_type:'medical_wellness',location_count:'one',monthly_inquiries:'26_50',primary_problem:'ongoing',follow_up_process:'crm_automatic',response_speed:'within_hour',current_systems:['crm','booking','tracking','auto_followup'],marketing_spend:'2500_4999',decision_role:'owner'};
const retired=/Founding Clinic|founding price|spots open|Diagnostic|Foundation Launch|Growth Operations|\$1,500|\$7,500|\$750|\$2,500\/month|\$3,500\/month/;
const cases=[
 ['A',{...answers,monthly_inquiries:'not_sure',primary_problem:'not_sure',response_speed:'not_sure'},1,'from $800'],
 ['B',{...answers,current_systems:[],follow_up_process:'manual'},2,'Typical first step: $800 Audit, then from $5,000 (Audit credited)'],
 ['C',answers,2,'from $3,500 setup, then $2,000/month (Audit credited)'],
 ['D',{...answers,follow_up_process:'depends'},2,'Typical first step: $800 Audit, then from $5,000 (Audit credited)'],
 ['custom',{...answers,location_count:'six_plus'},1,'Scope and investment set after the Audit.'],
 ['E',{...answers,business_type:'ecommerce'},0,'Back to Optivue Growth OS'],
];
await fs.mkdir('shots',{recursive:true});
for(const width of [390,1440]) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787',{waitUntil:'networkidle'});
 assert.doesNotMatch(await page.locator('body').innerText(),retired);
 assert.equal(await page.locator('[data-pricing-trigger="diagnostic"] [data-price-key]').textContent(),'from $800');
 assert.equal(await page.locator('[data-pricing-trigger="foundation"] [data-price-key]').textContent(),'from $5,000');
 assert.equal(await page.locator('[data-pricing-trigger="operations"] [data-price-short]').textContent(),'from $3,500 setup');
 assert.equal(await page.locator('[data-pricing-trigger="operations"] [data-price-monthly]').textContent(),'then $2,000/month');
 assert.equal(await page.locator('[data-price-key="care"]').textContent(),'$350/month');
 for(const key of ['diagnostic','foundation','operations']) {
  await page.locator(`[data-pricing-trigger="${key}"]`).click();
  assert.equal(await page.locator(`[data-breakdown="${key}"]`).isVisible(),true);
  await page.locator('#pricing').screenshot({path:`shots/revamp-${key}-${width}.png`});
 }
 for(const [id,values,rows,expected] of cases) {
  await page.goto('http://127.0.0.1:8787/estimator',{waitUntil:'networkidle'});
  await page.evaluate(answers=>sessionStorage.setItem('optivue-estimator-v2',JSON.stringify({version:2,screen:'result',step:8,answers,insightCount:0})),values);
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  const result=await page.locator('.ovgo-estimator-result').textContent();
  assert.ok(result.includes(expected),`${id}: ${result}`);assert.doesNotMatch(result,retired);
  assert.equal(await page.locator('.ovgo-estimator-price-table tbody tr').count(),rows);
  if(id!=='E') {
   await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedSnapshot=text;}}});});
   await page.getByRole('button',{name:'Copy my snapshot',exact:true}).click();
   const copy=await page.evaluate(()=>window.copiedSnapshot);
   assert.ok(copy.includes(expected));assert.doesNotMatch(copy,retired);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.locator('.ovgo-estimator-result').screenshot({path:`shots/revamp-estimator-${id}-${width}.png`});
 }
 assert.deepEqual(errors,[]);
 await context.close();console.log(`PASS pricing revamp ${width}px: approved prices, all estimator paths, clipboard, no retired copy, overflow`);
}
await browser.close();
