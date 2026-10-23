import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const output=process.env.GROWTH_MAP_QA_OUTPUT || '/tmp/optivue-growth-map-qa';
const base=process.env.GROWTH_MAP_QA_URL || 'http://127.0.0.1:8793/preview/growth-map';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const report={screenshots:[],checks:[],failures:[]};
const check=(name,condition)=>{report.checks.push({name,pass:!!condition});if(!condition)report.failures.push(name)};
try{
 for(const theme of ['light','dark'])for(const width of [320,360,390,768,1024,1280,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},colorScheme:theme});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text())});
  await page.goto(`${base}?theme=${theme}`);await page.evaluate(()=>document.fonts.ready);
  const measures=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bodySize:Math.min(...[...document.querySelectorAll('.gm-section p,.gm-section li,.gm-section summary')].map(e=>parseFloat(getComputedStyle(e).fontSize))),titleSize:Math.min(...[...document.querySelectorAll('.gm-station h3')].map(e=>parseFloat(getComputedStyle(e).fontSize))),markers:document.querySelectorAll('.gm-source-track').length,robots:document.querySelector('meta[name="robots"]').content}));
  check(`${theme}-${width}: no horizontal overflow`,!measures.overflow);check(`${theme}-${width}: readable type`,measures.bodySize>=14&&measures.titleSize>=16);check(`${theme}-${width}: five source routes`,measures.markers===5);check(`${theme}-${width}: noindex`,measures.robots==='noindex, nofollow');
  const baseline=await page.locator('.gm-ownership').evaluate(el=>el.getBoundingClientRect().top+scrollY);
  for(const summary of await page.locator('.gm-details summary').all()){
   await summary.focus();await page.keyboard.press('Enter');check(`${theme}-${width}: Enter opens disclosure`,await summary.evaluate(e=>e.parentElement.open));await page.keyboard.press('Space');check(`${theme}-${width}: Space closes disclosure`,!await summary.evaluate(e=>e.parentElement.open));
  }
  for(const summary of await page.locator('.gm-details summary').all())await summary.click();
  const expanded=await page.locator('.gm-ownership').evaluate(el=>el.getBoundingClientRect().top+scrollY);check(`${theme}-${width}: stable disclosure layout`,Math.abs(expanded-baseline)<1);
  await page.screenshot({path:`${output}/${theme}-${width}-expanded.png`,fullPage:true});
  report.screenshots.push(`${theme}-${width}-expanded.png`);
  if(width>=1024){const summary=page.locator('summary').first();await summary.focus();await page.keyboard.press('Escape');check(`${theme}-${width}: Escape closes`,!await summary.evaluate(e=>e.parentElement.open))}
  for(const detail of await page.locator('details').all())await detail.evaluate(e=>e.open=false);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${output}/${theme}-${width}.png`,fullPage:true});report.screenshots.push(`${theme}-${width}.png`);
  check(`${theme}-${width}: no console errors or warnings`,errors.length===0);if(errors.length)report.failures.push(...errors);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});await page.goto(base);check('Reduced motion: zero active dot animations',await page.locator('.gm-dot').evaluateAll(els=>els.every(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).display==='none')));await page.close();
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});const nojs=await context.newPage();await nojs.goto(base);await nojs.locator('summary').first().click();check('Without JavaScript: native disclosure works',await nojs.locator('details').first().evaluate(e=>e.open));check('Without JavaScript: ownership remains visible',await nojs.locator('.gm-ownership').isVisible());await context.close();
}finally{await browser.close();await writeFile(`${output}/results.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,failed:report.failures.length,screenshots:report.screenshots.length,output}));
assert.equal(report.failures.length,0,report.failures.join('\n'));
