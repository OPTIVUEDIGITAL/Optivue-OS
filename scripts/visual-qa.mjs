import { chromium } from "playwright";
import fs from "node:fs/promises";

const widths = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

await fs.mkdir("shots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of widths) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto("http://127.0.0.1:8787", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    firstCtaTop: document.querySelector("[data-ovgo-booking]")?.getBoundingClientRect().top ?? null,
    viewportHeight: window.innerHeight,
  }));

  const horizontalOverflow = Math.max(metrics.scrollWidth, metrics.bodyScrollWidth) > metrics.innerWidth + 1;
  const firstCtaWithinThreeScreens = metrics.firstCtaTop === null
    ? false
    : metrics.firstCtaTop <= metrics.viewportHeight * 3;

  results.push({
    viewport: viewport.name,
    horizontalOverflow,
    firstCtaWithinThreeScreens,
    ...metrics,
  });

  await page.screenshot({
    path: `shots/${viewport.name}.png`,
    fullPage: true,
  });

  await page.close();
}

// Check the mobile hero boundary in both themes and with enlarged root text.
for (const theme of ['light', 'dark']) {
  for (const textScale of [1, 2]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
    await page.evaluate(({ theme, textScale }) => {
      document.documentElement.style.fontSize = `${16 * textScale}px`;
      document.querySelector('#optivue-growth-os').setAttribute('data-theme', theme);
      document.querySelector('optivue-growth-system').setAttribute('theme', theme);
    }, { theme, textScale });
    const boundaries = await page.evaluate(() => {
      const hero = document.querySelector('.ovgo-hero').getBoundingClientRect();
      const copy = document.querySelector('.ovgo-hero__content').getBoundingClientRect();
      const diagram = document.querySelector('.ovgo-hero__system').getBoundingClientRect();
      const audience = document.querySelector('.ovgo-audience').getBoundingClientRect();
      return {
        heroContainsChildren: hero.bottom >= Math.max(copy.bottom, diagram.bottom) - 1,
        diagramFollowsCopy: diagram.top >= copy.bottom - 1,
        audienceFollowsDiagram: audience.top >= diagram.bottom - 1,
      };
    });
    results.push({ viewport: `390-${theme}-${textScale}x`, ...boundaries });
    await page.screenshot({ path: `shots/390-${theme}-${textScale}x.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
await fs.writeFile("shots/layout-results.json", JSON.stringify(results, null, 2));

const failed = results.filter(r => r.horizontalOverflow || r.firstCtaWithinThreeScreens === false || r.heroContainsChildren === false || r.diagramFollowsCopy === false || r.audienceFollowsDiagram === false);
console.log(JSON.stringify(results, null, 2));
if (failed.length) process.exit(1);
