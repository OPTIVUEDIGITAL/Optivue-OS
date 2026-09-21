// Phone-only acceptance suite. Keep this aligned with docs/passes/p3-mobile.md.
import { chromium } from "playwright";
import fs from "node:fs/promises";

const base = "http://127.0.0.1:8787";
const phones = [
  { name: "m-390", width: 390, height: 844 },
  { name: "m-430", width: 430, height: 932 },
];

await fs.mkdir("shots-mobile", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

const visible = (r) => r.width > 0 && r.height > 0;

for (const viewport of phones) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const baseline = await page.evaluate(() => {
    const root = document.querySelector("#optivue-growth-os");
    const hero = root?.querySelector(".ovgo-hero");
    const growth = root?.querySelector("optivue-growth-system");
    const cta = root?.querySelector(".ovgo-mobile-cta");
    const heroContent = root?.querySelector(".ovgo-hero__content");
    const heroFooter = root?.querySelector(".ovgo-hero__footer");

    const actionSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([type=hidden]):not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[role=button]",
      "[role=slider]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const actions = [...document.querySelectorAll(actionSelector)]
      .filter((el) => {
        if (el.closest("[hidden]")) return false;
        if (el.matches("input[type=checkbox],input[type=radio]") && el.closest("label")) return false;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: (el.textContent || el.getAttribute("aria-label") || el.getAttribute("name") || "").trim().slice(0, 80),
          width: r.width,
          height: r.height,
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
        };
      });

    const smallTargets = actions.filter((a) => a.width < 43.5 || a.height < 43.5);

    const closePairs = [];
    for (let i = 0; i < actions.length; i += 1) {
      for (let j = i + 1; j < actions.length; j += 1) {
        const a = actions[i];
        const b = actions[j];
        const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        const xGap = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
        const yGap = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));

        // Only compare separate, sibling-like targets aligned on the same row or column.
        if (horizontalOverlap > 8 && yGap > 0 && yGap < 8) {
          closePairs.push({ a: a.text, b: b.text, gap: yGap, axis: "vertical" });
        } else if (verticalOverlap > 8 && xGap > 0 && xGap < 8) {
          closePairs.push({ a: a.text, b: b.text, gap: xGap, axis: "horizontal" });
        }
      }
    }

    const formControls = [...document.querySelectorAll("input:not([type=hidden]),select,textarea")]
      .filter((el) => {
        if (el.closest("[hidden]")) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map((el) => ({
        id: el.id || el.name || el.tagName,
        fontSize: parseFloat(getComputedStyle(el).fontSize),
      }));

    const tooSmallInputs = formControls.filter((x) => x.fontSize < 16);

    const stageGrid = root?.querySelector(".ovgo-stage-grid");
    const pricingGrid = root?.querySelector(".ovgo-pricing-grid");
    const pricingCards = [...(pricingGrid?.querySelectorAll("[data-price-card]") || [])]
      .map((card) => ({ name: card.dataset.pricePlan, left: card.getBoundingClientRect().left }))
      .sort((a,b) => a.left - b.left);

    return {
      innerWidth: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth + 1,
      smallTargets,
      closePairs,
      tooSmallInputs,
      ctaPresent: Boolean(cta),
      ctaInitiallyVisible: Boolean(cta?.classList.contains("is-visible")),
      ctaBackdrop: cta ? getComputedStyle(cta).backdropFilter || getComputedStyle(cta).webkitBackdropFilter : "",
      heroBackdrop: heroContent ? getComputedStyle(heroContent).backdropFilter || getComputedStyle(heroContent).webkitBackdropFilter : "",
      heroFooterDisplay: heroFooter ? getComputedStyle(heroFooter).display : "missing",
      heroMinHeight: hero ? getComputedStyle(hero).minHeight : "",
      stageScrollable: Boolean(stageGrid && stageGrid.scrollWidth > stageGrid.clientWidth),
      pricingScrollable: Boolean(pricingGrid && pricingGrid.scrollWidth > pricingGrid.clientWidth),
      pricingFirst: pricingCards[0]?.name || null,
      pricingDomFirst: pricingGrid?.querySelector("[data-price-card]")?.dataset.pricePlan || null,
      growthRunningInitially: Boolean(growth?._raf),
      stageTabIndex: stageGrid?.tabIndex ?? null,
      pricingTabIndex: pricingGrid?.tabIndex ?? null,
    };
  });

  // Native keyboard scrolling for phone scrollers.
  const stageBefore = await page.locator(".ovgo-stage-grid").evaluate(el => el.scrollLeft);
  await page.locator(".ovgo-stage-grid").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(350);
  const stageAfter = await page.locator(".ovgo-stage-grid").evaluate(el => el.scrollLeft);

  const pricingBefore = await page.locator(".ovgo-pricing-grid").evaluate(el => el.scrollLeft);
  await page.locator(".ovgo-pricing-grid").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(350);
  const pricingAfter = await page.locator(".ovgo-pricing-grid").evaluate(el => el.scrollLeft);

  // Sticky CTA should appear only after the hero leaves.
  await page.locator("#systems").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const ctaAfterHero = await page.locator(".ovgo-mobile-cta").evaluate(el => el.classList.contains("is-visible"));

  // Booking modal suppresses sticky CTA.
  await page.locator(".ovgo-mobile-cta [data-ovgo-booking]").click();
  await page.waitForTimeout(100);
  const ctaDuringModal = await page.locator(".ovgo-mobile-cta").evaluate(el => el.classList.contains("is-visible"));
  const modalOpen = await page.locator("[data-ovgo-modal]").evaluate(el => !el.hidden);
  await page.getByRole("button", { name: "Close booking modal" }).click();

  // Mobile menu suppresses sticky CTA.
  await page.locator("[data-ovgo-menu-toggle]").click();
  await page.waitForTimeout(100);
  const ctaDuringMenu = await page.locator(".ovgo-mobile-cta").evaluate(el => el.classList.contains("is-visible"));
  await page.locator("[data-ovgo-menu-toggle]").click();

  // Form focus suppresses sticky CTA.
  await page.locator("#growth-brief").scrollIntoViewIfNeeded();
  await page.locator("#lead-name").focus();
  await page.waitForTimeout(100);
  const ctaDuringForm = await page.locator(".ovgo-mobile-cta").evaluate(el => el.classList.contains("is-visible"));
  await page.locator("#lead-name").blur();

  // Work accordion: first open by default; another click opens inline.
  await page.locator("#work").scrollIntoViewIfNeeded();
  const workButtons = page.locator(".ovgo-work-list [data-work-title]");
  const firstExpanded = await workButtons.nth(0).getAttribute("aria-expanded");
  await workButtons.nth(1).click();
  await page.waitForTimeout(350);
  const secondExpanded = await workButtons.nth(1).getAttribute("aria-expanded");
  const secondPanelVisible = await page.locator("#ovgo-work-mobile-detail-2").evaluate(el => !el.hidden && el.getBoundingClientRect().height > 0);

  // Hero graph should stop RAF when offscreen.
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const growthStoppedOffscreen = await page.locator("optivue-growth-system").evaluate(el => el._raf === null);

  await page.screenshot({ path: `shots-mobile/${viewport.name}.png`, fullPage: true });

  const result = {
    viewport: viewport.name,
    ...baseline,
    stageKeyboardScroll: stageAfter > stageBefore,
    pricingKeyboardScroll: pricingAfter > pricingBefore,
    ctaAfterHero,
    modalOpen,
    ctaDuringModal,
    ctaDuringMenu,
    ctaDuringForm,
    firstWorkOpen: firstExpanded === "true",
    secondWorkOpen: secondExpanded === "true",
    secondPanelVisible,
    growthStoppedOffscreen,
  };
  results.push(result);
  await page.close();
}

// Reduced-motion phone context.
const reducedPage = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await reducedPage.goto(base, { waitUntil: "networkidle" });
await reducedPage.waitForTimeout(250);
const reduced = await reducedPage.evaluate(() => {
  const growth = document.querySelector("optivue-growth-system");
  const stage = document.querySelector(".ovgo-stage-grid");
  const pricing = document.querySelector(".ovgo-pricing-grid");
  return {
    growthRafStopped: growth?._raf === null,
    stageScrollBehavior: stage ? getComputedStyle(stage).scrollBehavior : null,
    pricingScrollBehavior: pricing ? getComputedStyle(pricing).scrollBehavior : null,
    stageSnap: stage ? getComputedStyle(stage).scrollSnapType : null,
    pricingSnap: pricing ? getComputedStyle(pricing).scrollSnapType : null,
  };
});
await reducedPage.close();

await browser.close();

const failures = [];
for (const r of results) {
  if (r.horizontalOverflow) failures.push(`${r.viewport}: page horizontal overflow`);
  if (r.smallTargets.length) failures.push(`${r.viewport}: ${r.smallTargets.length} tappable targets below 44x44`);
  if (r.closePairs.length) failures.push(`${r.viewport}: ${r.closePairs.length} adjacent tappable pairs under 8px separation`);
  if (r.tooSmallInputs.length) failures.push(`${r.viewport}: form controls below 16px`);
  if (!r.ctaPresent || r.ctaInitiallyVisible) failures.push(`${r.viewport}: sticky CTA initial state incorrect`);
  if (!r.ctaAfterHero) failures.push(`${r.viewport}: sticky CTA did not appear after hero`);
  if (!r.modalOpen || r.ctaDuringModal) failures.push(`${r.viewport}: sticky CTA modal suppression failed`);
  if (r.ctaDuringMenu) failures.push(`${r.viewport}: sticky CTA menu suppression failed`);
  if (r.ctaDuringForm) failures.push(`${r.viewport}: sticky CTA form-focus suppression failed`);
  if (r.heroFooterDisplay === "none" || r.heroFooterDisplay === "missing") failures.push(`${r.viewport}: hero footer not restored`);
  if (!r.stageScrollable || !r.pricingScrollable) failures.push(`${r.viewport}: phone carousel not internally scrollable`);
  if (!r.stageKeyboardScroll || !r.pricingKeyboardScroll) failures.push(`${r.viewport}: keyboard scrolling failed`);
  if (r.pricingFirst !== "Growth Accelerator") failures.push(`${r.viewport}: featured pricing plan not visually first`);
  if (r.pricingDomFirst !== "Growth Accelerator") failures.push(`${r.viewport}: featured pricing plan not first in mobile DOM order`);
  if (!r.firstWorkOpen || !r.secondWorkOpen || !r.secondPanelVisible) failures.push(`${r.viewport}: inline work accordion failed`);
  if (!r.growthStoppedOffscreen) failures.push(`${r.viewport}: hero graph RAF still running offscreen`);
  if (String(r.heroBackdrop).includes("blur")) failures.push(`${r.viewport}: hero still uses backdrop blur`);
  if (!String(r.ctaBackdrop).includes("blur")) failures.push(`${r.viewport}: sticky CTA blur missing`);
}
if (!reduced.growthRafStopped) failures.push("reduced-motion: hero graph RAF running");
if (reduced.stageScrollBehavior !== "auto" || reduced.pricingScrollBehavior !== "auto") failures.push("reduced-motion: horizontal scroller smooth behavior not disabled");

await fs.writeFile("shots-mobile/mobile-results.json", JSON.stringify({ results, reduced, failures }, null, 2));
console.log(JSON.stringify({ results, reduced, failures }, null, 2));
if (failures.length) process.exit(1);
