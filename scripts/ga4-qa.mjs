// Browser integration test. All Google/Calendly traffic is intercepted.
// No real booking or Google Analytics collection occurs in this test.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../production/', import.meta.url));
const origin = 'https://growth.optivuedigital.com';
const browser = await chromium.launch({ headless: true });
await fs.mkdir('shots', { recursive: true });
const googleEvents = page => page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event').map(e => Array.from(e)));

async function fixture(width, hostname = 'growth.optivuedigital.com') {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  let googleLoads = 0;
  await context.route('https://www.googletagmanager.com/**', async route => {
    googleLoads++;
    await route.fulfill({ contentType: 'text/javascript', body: '// Google stub: no network collection' });
  });
  await context.route('https://calendly.com/**', route => route.fulfill({ contentType: 'text/html', body: '<button onclick="parent.postMessage({event:\'calendly.event_scheduled\'},\'https://growth.optivuedigital.com\')">Test booking</button>' }));
  await context.route('https://' + hostname + '/**', async route => {
    const url = new URL(route.request().url());
    const relative = decodeURIComponent(url.pathname).replace(/^\//, '');
    let file = path.resolve(root, relative || 'index.html');
    if (!file.startsWith(root)) return route.abort();
    try {
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const body = await fs.readFile(file);
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' }[path.extname(file)] || 'application/octet-stream';
      await route.fulfill({ contentType: type, body });
    } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
  return { context, page: await context.newPage(), loads: () => googleLoads };
}

try {
  for (const width of [390, 1440]) {
    const f = await fixture(width); const { page } = f;
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(f.loads(), 1);
    await page.locator('[data-cta-location="hero"]').click();
    assert.deepEqual((await googleEvents(page)).map(e=>[e[1],e[2]?.cta_location]), [['book_fit_call_click','hero']]);
    await page.frameLocator('[data-ovgo-calendly]').getByRole('button',{name:'Test booking'}).click();
    await page.waitForURL(origin + '/thank-you');
    assert.equal((await googleEvents(page)).filter(e=>e[1]==='fit_call_booked').length,1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await page.screenshot({path:`shots/thank-you-${width}.png`,fullPage:true});
    await page.reload({waitUntil:'networkidle'});
    assert.equal((await googleEvents(page)).filter(e=>e[1]==='fit_call_booked').length,0);
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    await page.locator('#pricing [data-ovgo-booking]').click();
    assert.deepEqual((await googleEvents(page)).map(e=>e[1]),['request_audit_click']);
    await page.goto(origin+'/estimator',{waitUntil:'networkidle'});
    await page.locator('[data-estimator-start]').click();
    await page.locator('[data-estimator-back]').click();
    await page.locator('[data-estimator-start]').click();
    assert.equal((await googleEvents(page)).filter(e=>e[1]==='estimator_start').length,1);
    for(let i=0;i<9;i++) {
      const fieldset=page.locator('[data-estimator-form]');
      const before=await fieldset.locator('legend').textContent();
      await fieldset.locator('.ovgo-estimator-option').first().click();
      const submit=fieldset.locator('button[type="submit"]');
      if(await submit.count())await submit.click();
      if(i<8)await page.waitForFunction(text=>document.querySelector('[data-estimator-form] legend')?.textContent!==text,before);
    }
    await page.locator('.ovgo-estimator-result').waitFor();
    assert.equal((await googleEvents(page)).filter(e=>e[1]==='estimator_complete').length,1);
    await page.reload({waitUntil:'networkidle'});
    await page.locator('[data-estimator-resume]').click();
    assert.equal((await googleEvents(page)).filter(e=>e[1]==='estimator_complete').length,0);
    await f.context.close();
    console.log(`PASS ${width}px: production tag, CTA, iframe-to-parent confirmation, one booking, clean URL, reload suppression, no overflow`);
  }
  const direct=await fixture(390);
  await direct.page.goto(origin+'/thank-you?src=calendly&invitee_email=private%40example.com&answer_1=secret#private',{waitUntil:'networkidle'});
  assert.equal(direct.page.url(),origin+'/thank-you');
  const dl=await direct.page.evaluate(()=>JSON.stringify(window.dataLayer));
  assert.ok(!dl.includes('private')&&!dl.includes('secret'));
  assert.equal((await googleEvents(direct.page)).filter(e=>e[1]==='fit_call_booked').length,1);
  await direct.context.close();
  const framed=await fixture(390);
  await framed.page.goto(origin+'/',{waitUntil:'networkidle'});
  await framed.page.locator('[data-cta-location="hero"]').click();
  // Simulate Calendly's native redirect occurring in the iframe first.
  await framed.page.locator('[data-ovgo-calendly]').evaluate(frame=>{frame.src='/thank-you?src=calendly&invitee_email=private%40example.com';});
  await framed.page.waitForURL(origin+'/thank-you');
  assert.equal((await googleEvents(framed.page)).filter(e=>e[1]==='fit_call_booked').length,1);
  await framed.context.close();
  const preview=await fixture(390,'preview.workers.dev');
  await preview.page.goto('https://preview.workers.dev/thank-you?src=calendly',{waitUntil:'networkidle'});
  assert.equal(preview.loads(),0);assert.equal((await googleEvents(preview.page)).length,0);
  await preview.context.close();
  console.log('PASS direct redirect privacy and preview exclusion (simulated external services, not a real Calendly booking)');
} finally { await browser.close(); }
