import { initHeroTypewriter } from './hero-typewriter.js';
import { displayPrice } from './pricing-values.js';
import { initPricingBreakdowns } from './pricing.js';
import { initBooking } from './booking.js';
import { initEstimator } from './estimator.js';
import { ESTIMATOR_CONFIG } from './estimator-config.js';
import { RUNTIME_CONFIG } from './runtime-config.js';
import { addJourneyValue } from './context.js';


function initPricing(root) {
  root.querySelectorAll('[data-price-key]').forEach((element) => {
    const price = ESTIMATOR_CONFIG.prices[element.dataset.priceKey];
    if (price) element.textContent = displayPrice(element.dataset.priceKey,element.dataset);
  });
}

function initPricingPolicies(root, config = RUNTIME_CONFIG) {
  const container = root.querySelector('[data-pricing-policies]');
  if (!container) return;
  const policies = [];
  if (config.diagnosticCreditEnabled === true) policies.push("Your Audit fee is credited toward Fix or Fix + Grow if you go ahead within 30 days.");
  if (config.diagnosticGuaranteeEnabled === true) policies.push("If the Audit doesn't give you a clear 90-day plan, I'll refund it.");
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
  initHeroTypewriter(root);
  initTheme(root);
  initHeader(root);
  initMobileMenu(root);
  initSpotlights(root);
  initReveal(root);

  initMobileCta(root);
  initFaq(root);
  initBooking(root);
  initPricing(root);
  initPricingPolicies(root);
  initPricingBreakdowns(root);
  initEstimator(root);
}
