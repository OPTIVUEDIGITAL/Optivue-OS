import { initPricingBreakdowns } from './pricing.js';
import { initBooking } from './booking.js';
import { initEstimator } from './estimator.js';
import { ESTIMATOR_CONFIG } from './estimator-config.js';
import { RUNTIME_CONFIG } from './runtime-config.js';
import { addJourneyValue } from './context.js';


function initPricing(root) {
  root.querySelectorAll('[data-price-key]').forEach((element) => {
    const price = ESTIMATOR_CONFIG.prices[element.dataset.priceKey];
    if (price) element.textContent = 'priceLowercase' in element.dataset ? price.display.replace(/^From /, 'from ') : price.display;
  });
}

function initPricingPolicies(root, config = RUNTIME_CONFIG) {
  const container = root.querySelector('[data-pricing-policies]');
  if (!container) return;
  const policies = [];
  if (config.diagnosticCreditEnabled === true) policies.push("Your Diagnostic fee is credited toward the Foundation Launch if you go ahead within 30 days.");
  if (config.diagnosticGuaranteeEnabled === true) policies.push("If the Diagnostic doesn't give you a clear 90-day plan, I'll refund it.");
  container.replaceChildren();
  for (const text of policies) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    container.append(paragraph);
  }
  container.hidden = policies.length === 0;
}

function initTheme(root) {
  const stored = localStorage.getItem('optivue-theme');
  let theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const apply = () => {
    root.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    root.querySelectorAll('optivue-growth-system,optivue-spotlight-card').forEach((element) => element.setAttribute('theme', theme));
  };
  apply();
  root.querySelector('[data-ovgo-theme]')?.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('optivue-theme', theme); apply(); });
  const growth = root.querySelector('optivue-growth-system');
  const sync = () => growth?.setAttribute('density', 'full');
  sync();
  window.addEventListener('resize', sync, { passive: true });
}

function initHeader(root) {
  const header = root.querySelector('[data-ovgo-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileMenu(root) {
  const toggle = root.querySelector('[data-ovgo-menu-toggle]');
  const menu = root.querySelector('[data-ovgo-mobile-menu]');
  if (!toggle || !menu) return;
  const setOpen = (open) => { toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; document.documentElement.style.overflow = open ? 'hidden' : ''; };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a,button').forEach((element) => element.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

const STAGES = {
  acquire: { index:'STAGE 01', name:'Acquire', title:'Get the right local leads.', purpose:"I connect local search, Google Business Profile and paid campaigns to clear booking pages. Your plan sets the channels.", tools:['Google Ads','Local Search','Google Business Profile'], capabilities:['Which sources produce leads','Where local demand enters','Which campaign paths deserve attention'] },
  convert: { index:'STAGE 02', name:'Convert', title:'Give every prospect a clear next step.', purpose:"I build pages with clear next steps. Your visitors get a simpler path to booking.", tools:['Landing Pages','Booking','Conversion Review'], capabilities:['Where prospects stop','Which steps create friction','How each lead reaches booking'] },
  automate: { index:'STAGE 03', name:'Automate', title:'Route leads and set follow-up steps.', purpose:"I set lead routing and consent-based follow-up in your CRM. Your team sees who needs a reply.", tools:['CRM','Email','SMS','Lead Routing'], capabilities:['Which leads need action','How quickly follow-up starts','Where each lead sits in the process'] },
  measure: { index:'STAGE 04', name:'Measure', title:'See which leads become clients.', purpose:'The clinic problem: reports stop at clicks and form fills. What I build: tracking from source through booking and patient outcome, where technically and legally possible.', tools:['GA4','GTM','Call Tracking','Reporting'], capabilities:['Which leads book','Which leads show up','Which sources connect to new patients'] },
  optimize: { index:'STAGE 05', name:'Optimize', title:'Fix the biggest bottleneck first.', purpose:"I use your results to choose the next fix. Your team gets one clear priority.", tools:['CRO','Campaign Review','Funnel Analysis'], capabilities:['The current priority','Evidence behind the decision','What gets fixed next'] },
};

function initSystemDetail(root) {
  const buttons = [...root.querySelectorAll('[data-stage]')];
  const fields = { index:root.querySelector('[data-stage-index]'), name:root.querySelector('[data-stage-name]'), title:root.querySelector('[data-stage-title]'), purpose:root.querySelector('[data-stage-purpose]'), tools:root.querySelector('[data-stage-tools]'), capabilities:root.querySelector('[data-stage-capabilities]') };
  if (!buttons.length || Object.values(fields).some((field) => !field)) return;
  const select = (key) => {
    const item = STAGES[key];
    buttons.forEach((button) => { const active = button.dataset.stage === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
    fields.index.textContent = item.index; fields.name.textContent = item.name; fields.title.textContent = item.title; fields.purpose.textContent = item.purpose;
    fields.tools.innerHTML = item.tools.map((label) => `<span>${label}</span>`).join(''); fields.capabilities.innerHTML = item.capabilities.map((label) => `<li>${label}</li>`).join('');
    addJourneyValue('systemStagesViewed', item.name);
  };
  buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.stage)));
  select('acquire');
}

function initSpotlights(root) {
  root.querySelectorAll('[data-price-card]').forEach((card) => {
    const spotlight = card.querySelector('optivue-spotlight-card');
    if (!spotlight) return;
    card.addEventListener('pointermove', (event) => { const rect = card.getBoundingClientRect(); spotlight.style.setProperty('--spot-x', `${event.clientX - rect.left}px`); spotlight.style.setProperty('--spot-y', `${event.clientY - rect.top}px`); }, { passive:true });
    card.addEventListener('pointerleave', () => { spotlight.style.setProperty('--spot-x', '-9999px'); spotlight.style.setProperty('--spot-y', '-9999px'); });
  });
}

function initReveal(root) {
  // Content is visible by default. A failed observer never blocks reading.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver !== 'function') return;
  try {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    root.querySelectorAll('.ovgo-section > *, .ovgo-final-cta > *').forEach((item) => observer.observe(item));
  } catch { /* Optional enhancement. Static content stays readable. */ }
}

function initFoundingClinic(root) {
  const section = root.querySelector('[data-founding-clinic]');
  if (!section || !RUNTIME_CONFIG.foundingClinicEnabled || !RUNTIME_CONFIG.foundingClinicSpots || !RUNTIME_CONFIG.foundingClinicTerms) return;
  section.hidden = false;
  section.querySelector('#founding-title').textContent = `Founding Clinic Program · ${RUNTIME_CONFIG.foundingClinicSpots} spots`;
  section.querySelector('[data-founding-copy]').textContent = `I'm documenting results for my first health, wellness and aesthetics case studies. Founding clinics receive ${RUNTIME_CONFIG.foundingClinicTerms} in exchange for permission to publish approved or anonymized results and access to measurement data.`;
}

function initMobileCta(root) {
  const bar = root.querySelector('[data-mobile-cta]');
  const heroButton = root.querySelector('[data-cta-location="hero"]');
  const final = root.querySelector('[data-final-cta]');
  if (!bar || !heroButton || !final || typeof IntersectionObserver !== 'function') return;
  const visible = new Set();
  try {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)); bar.classList.toggle('is-visible', visible.size === 0); }, { threshold:.05 });
    observer.observe(heroButton); observer.observe(final);
  } catch { /* Inline booking actions remain available. */ }
}

function initFaq(root) {
  const items = [...root.querySelectorAll('.ovgo-faq-list details')];
  items.forEach((item) => item.addEventListener('toggle', () => { if (item.open) items.forEach((other) => { if (other !== item) other.open = false; }); }));
}

const root = document.getElementById('optivue-growth-os');
if (root) {
  initTheme(root);
  initHeader(root);
  initMobileMenu(root);
  initSystemDetail(root);
  initSpotlights(root);
  initReveal(root);
  initFoundingClinic(root);
  initMobileCta(root);
  initFaq(root);
  initBooking(root);
  initPricing(root);
  initPricingPolicies(root);
  initPricingBreakdowns(root);
  initEstimator(root);
}
