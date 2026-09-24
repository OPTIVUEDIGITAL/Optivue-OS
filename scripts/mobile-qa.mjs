import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = process.env.OPTIVUE_QA_URL || 'http://127.0.0.1:8787';
const viewports = [
  { name: '390px', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const common = { business_type: 'medical_wellness', location_count: 'one', monthly_inquiries: '26_50', primary_problem: 'more_inquiries', follow_up_process: 'crm_automatic', response_speed: 'within_hour', current_systems: ['crm', 'booking', 'tracking', 'auto_followup', 'ads'], marketing_spend: '2500_4999', decision_role: 'owner' };
const results = {
  A: { ...common, monthly_inquiries: '10_25', primary_problem: 'not_sure', marketing_spend: '1000_2499' },
  B: { ...common, monthly_inquiries: '10_25', primary_problem: 'cant_tell', follow_up_process: 'manual', response_speed: 'same_day', current_systems: ['booking'], marketing_spend: '1000_2499' },
  C: common,
  D: { ...common, primary_problem: 'not_enough_book', follow_up_process: 'depends', response_speed: 'next_day', current_systems: ['crm', 'ads'] },
  E: { ...common, business_type: 'ecommerce' },
};

await fs.mkdir('artifacts/estimator-qa', { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(`${base}/estimator`, { waitUntil: 'networkidle' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: `artifacts/estimator-qa/${viewport.name}-intro.png`, fullPage: true });

  await page.getByRole('button', { name: 'Start the Estimate' }).click();
  await page.screenshot({ path: `artifacts/estimator-qa/${viewport.name}-question.png`, fullPage: true });
  const questionMetrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    optionHeights: [...document.querySelectorAll('.ovgo-estimator-option')].map((element) => element.getBoundingClientRect().height),
    fieldsets: document.querySelectorAll('fieldset').length,
    legends: document.querySelectorAll('legend').length,
  }));
  checks.push({ viewport: viewport.name, screen: 'question', ...questionMetrics });

  for (const [result, answers] of Object.entries(results)) {
    await page.evaluate(({ answers }) => sessionStorage.setItem('optivue-estimator-v2', JSON.stringify({ version: 2, screen: 'result', step: 8, answers, insightCount: 0 })), { answers });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForSelector('.ovgo-estimator-result');
    await page.screenshot({ path: `artifacts/estimator-qa/${viewport.name}-result-${result}.png`, fullPage: true });
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      stageCount: document.querySelectorAll('.ovgo-estimator-stage').length,
      resultHeading: document.querySelector('.ovgo-estimator-recommendation h3')?.textContent || '',
    }));
    checks.push({ viewport: viewport.name, screen: `result-${result}`, ...metrics });
  }
  await page.close();
}

await browser.close();
const failures = checks.filter((check) => check.overflow || (check.screen === 'question' && (check.fieldsets !== 1 || check.legends !== 1 || check.optionHeights.some((height) => height < 56))) || (check.screen.startsWith('result-') && check.stageCount !== 5));
await fs.writeFile('artifacts/estimator-qa/results.json', JSON.stringify({ checks, failures }, null, 2));
console.log(JSON.stringify({ screenshots: viewports.length * 7, checks: checks.length, failures }, null, 2));
if (failures.length) process.exit(1);
