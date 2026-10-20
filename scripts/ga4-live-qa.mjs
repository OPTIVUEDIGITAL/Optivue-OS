// Post-deployment smoke test. Real Google transport, simulated Calendly completion.
// Debug traffic only. Does not create a calendar appointment or prove DebugView receipt.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const origin='https://growth.optivuedigital.com';
const expected=await fs.readFile(new URL('../production/index.html',import.meta.url),'utf8');
const browser=await chromium.launch({headless:true});
const report={started:new Date().toISOString(),events:[],responses:[],errors:[],booking:'simulated Calendly message, no appointment created'};
try {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  // Set debug mode before the production loader initializes. Never change site config.
  await context.addInitScript(()=>{
    window.dataLayer=[];
    window.gtag=function(){
      if(arguments[0]==='config')arguments[2]={...arguments[2],debug_mode:true};
      window.dataLayer.push(arguments);
    };
  });
  await context.route('https://calendly.com/**',route=>route.fulfill({contentType:'text/html',body:'<button onclick="parent.postMessage({event:\'calendly.event_scheduled\'},\'https://growth.optivuedigital.com\')">Test booking completion</button>'}));
  context.on('request',request=>{
    const u=new URL(request.url());
    if(!/(^|\.)google-analytics\.com$/.test(u.hostname)||!u.pathname.endsWith('/collect'))return;
    const bodies=(request.postData()||'').split('\n');
    for(const body of bodies){
      const params=new URLSearchParams(u.search);
      for(const [k,v]of new URLSearchParams(body))params.set(k,v);
      if(params.get('tid')!=='G-9XBD3QZ5BQ')continue;
      report.events.push({name:params.get('en'),location:params.get('dl'),debug:params.get('_dbg')??params.get('ep.debug_mode')??params.get('epn.debug_mode'),debug_parameters:Object.fromEntries([...params].filter(([key])=>/dbg|debug/.test(key))),booking_source:params.get('ep.booking_source')});
      if([...params.values()].some(v=>/private@example|invitee_email|answer_1|qa-private/.test(v)))report.errors.push('Private test value reached Google');
    }
  });
  context.on('response',response=>{
    const u=new URL(response.url());
    if(/(^|\.)google-analytics\.com$/.test(u.hostname)&&u.pathname.endsWith('/collect'))report.responses.push(response.status());
  });
  const page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(error.message));
  // Main's deployment runs independently from CI. Wait for the exact approved HTML.
  let deployed=false;
  for(let i=0;i<30;i++){
    const r=await context.request.get(origin+'/?release_check='+Date.now());
    if(r.ok()&&(await r.text())===expected){deployed=true;break;}
    await new Promise(resolve=>setTimeout(resolve,10000));
  }
  assert.ok(deployed,'Live HTML did not reach this commit within five minutes');
  report.html_sha256=crypto.createHash('sha256').update(expected).digest('hex');
  const waitEvent=async(name,count=1)=>{
    const deadline=Date.now()+30000;
    while(Date.now()<deadline){
      if(report.events.filter(e=>e.name===name).length>=count)return;
      await page.waitForTimeout(500);
    }
    assert.fail('No real Google collection request for '+name);
  };
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  await waitEvent('page_view');
  assert.ok(['1','true'].includes(report.events.find(e=>e.name==='page_view').debug),'Require debug mode before testing a conversion');
  await page.locator('[data-cta-location="hero"]').click();
  await waitEvent('book_fit_call_click');
  await page.frameLocator('[data-ovgo-calendly]').getByRole('button',{name:'Test booking completion'}).click();
  await page.waitForURL(origin+'/thank-you');
  await waitEvent('fit_call_booked');
  assert.equal(report.events.filter(e=>e.name==='fit_call_booked').length,1);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForTimeout(2500);
  assert.equal(report.events.filter(e=>e.name==='fit_call_booked').length,1,'Reload duplicated conversion');
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  await page.locator('#pricing [data-ovgo-booking]').click();
  await waitEvent('request_audit_click');
  await page.goto(origin+'/estimator',{waitUntil:'networkidle'});
  await page.locator('[data-estimator-start]').click();
  await waitEvent('estimator_start');
  for(let i=0;i<9;i++){
    const form=page.locator('[data-estimator-form]');
    const before=await form.locator('legend').textContent();
    await form.locator('.ovgo-estimator-option').first().click();
    const submit=form.locator('button[type="submit"]');
    if(await submit.count())await submit.click();
    if(i<8)await page.waitForFunction(text=>document.querySelector('[data-estimator-form] legend')?.textContent!==text,before);
  }
  await waitEvent('estimator_complete');
  await page.waitForTimeout(2500);
  assert.ok(report.events.every(e=>['1','true'].includes(e.debug)),'Test events must use debug mode');
  assert.ok(report.responses.length>0,'No Google collection response');
  assert.ok(report.responses.every(s=>s>=200&&s<300),'Google rejected a collection request');
  assert.ok(report.events.every(e=>!e.location||(!e.location.includes('?')&&!e.location.includes('#'))),'Unsanitized page location');
  assert.equal(report.events.find(e=>e.name==='fit_call_booked').booking_source,'calendly');
  assert.deepEqual(report.errors,[]);
  report.result='PASS: five custom events reached Google collection endpoint, duplicate reload suppressed';
  console.log(report.result);
} catch(error){report.result='FAIL';report.failure=error.message;throw error;}
finally{
  console.log(JSON.stringify(report));
  await fs.mkdir('shots',{recursive:true});
  await fs.writeFile('shots/ga4-live-report.json',JSON.stringify(report,null,2));
  await browser.close();
}
