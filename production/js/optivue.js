import { initBooking } from './booking.js';
import { initDiagnosis } from './diagnosis.js';
import { initEstimator } from './estimator.js';
import { initLeadCapture } from './lead-capture.js';
import { addJourneyValue } from './context.js';

const root = document.getElementById('optivue-growth-os');

if (root) {
  initTheme(root);
  initHeader(root);
  initMobileMenu(root);
  initSystemInspector(root);
  initTransformations(root);
  initWorkLab(root);
  initSpotlights(root);
  initReveal(root);
  initBooking(root);
  initDiagnosis(root);
  initEstimator(root);
  initLeadCapture(root);
}

function initTheme(root) {
  const key = 'optivue-theme';
  const stored = localStorage.getItem(key);
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  let theme = stored || preferred;

  const apply = () => {
    root.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    root.querySelectorAll('optivue-growth-system,optivue-spotlight-card').forEach((element) => {
      element.setAttribute('theme', theme);
    });
  };

  apply();

  root.querySelector('[data-ovgo-theme]')?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, theme);
    apply();
  });

  const growth = root.querySelector('optivue-growth-system');
  const syncDensity = () => growth?.setAttribute('density', window.innerWidth < 760 ? 'reduced' : 'full');
  syncDensity();
  window.addEventListener('resize', syncDensity, { passive: true });
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

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a,button').forEach((element) => element.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

function initSystemInspector(root) {
  const data = {
    acquire: {
      index: 'STAGE 01',
      name: 'ACQUIRE ENGINE',
      title: 'Bring the right people into the system.',
      purpose: 'Build acquisition around clear intent and measurable business outcomes rather than disconnected traffic volume.',
      tools: ['Google Ads','Meta Ads','SEO','Google Business Profile','Content'],
      capabilities: ['Intent-focused acquisition','Channel-to-offer alignment','Search and local visibility','Campaign structure','Demand capture'],
    },
    convert: {
      index: 'STAGE 02',
      name: 'CONVERSION ENGINE',
      title: 'Turn attention into measurable intent.',
      purpose: 'Reduce friction between the first click and the actions that indicate a real prospect is ready to move forward.',
      tools: ['Landing Pages','CRO','Booking','Offer Structure','Lead Qualification'],
      capabilities: ['Conversion paths','Offer framing','Form design','Booking flow','Qualification logic'],
    },
    automate: {
      index: 'STAGE 03',
      name: 'AUTOMATION ENGINE',
      title: 'Move leads forward without relying on manual follow-up.',
      purpose: 'Connect lead capture to CRM routing, email, SMS, pipeline stages, and clear ownership so response does not depend on memory.',
      tools: ['CRM','Email','SMS','Lead Routing','Pipeline Automation'],
      capabilities: ['Speed to lead','Routing rules','Lifecycle automation','Pipeline progression','Follow-up consistency'],
    },
    measure: {
      index: 'STAGE 04',
      name: 'MEASUREMENT ENGINE',
      title: 'Track what creates qualified opportunities and customers.',
      purpose: 'Define the events and outcomes that matter, then connect website behavior, campaigns, and CRM progression into usable reporting.',
      tools: ['GA4','GTM','Dashboards','Attribution','Reporting'],
      capabilities: ['Event tracking','Funnel visibility','Campaign attribution','CRM outcome mapping','Decision-ready reporting'],
    },
    optimize: {
      index: 'STAGE 05',
      name: 'OPTIMIZATION ENGINE',
      title: 'Use performance data to improve the system.',
      purpose: 'Use what the system reveals to improve messaging, user experience, channel efficiency, and the highest-friction parts of the journey.',
      tools: ['CRO','Campaign Optimization','Search Intelligence','Funnel Analysis','UX Improvement'],
      capabilities: ['Friction diagnosis','Creative iteration','Landing-page improvement','Search opportunity analysis','Budget prioritization'],
    },
  };

  const buttons = [...root.querySelectorAll('[data-stage]')];
  const index = root.querySelector('[data-stage-index]');
  const name = root.querySelector('[data-stage-name]');
  const title = root.querySelector('[data-stage-title]');
  const purpose = root.querySelector('[data-stage-purpose]');
  const tools = root.querySelector('[data-stage-tools]');
  const capabilities = root.querySelector('[data-stage-capabilities]');

  function select(key) {
    const item = data[key];
    if (!item) return;
    buttons.forEach((button) => {
      const active = button.dataset.stage === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    index.textContent = item.index;
    name.textContent = item.name;
    title.textContent = item.title;
    purpose.textContent = item.purpose;
    tools.innerHTML = item.tools.map((tool) => `<span>${tool}</span>`).join('');
    capabilities.innerHTML = item.capabilities.map((capability) => `<li>${capability}</li>`).join('');
    addJourneyValue('systemStagesViewed', item.name);
  }

  buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.stage)));
  select('acquire');
}

function initTransformations(root) {
  const data = {
    revive: {
      kicker: '[ HEALTHCARE & WELLNESS // CONNECTED ACQUISITION ]',
      title: 'Express Medical Care / Revive',
      summary: 'Connect acquisition, landing experiences, qualification, CRM routing, automated follow-up, consultation booking, and performance visibility.',
      flow: ['Search / Ads / GBP','Landing Experience','Lead Capture','Qualification','CRM','SMS + Email','Consultation Pipeline','Customer','Analytics'],
    },
    cbp: {
      kicker: '[ EDUCATION & MEMBERSHIP // DIGITAL INFRASTRUCTURE ]',
      title: 'CBP / Ideal Spine',
      summary: 'Create a connected member-facing experience across portal UX, custom front-end implementation, content access, and supporting digital systems.',
      flow: ['Member Entry','Portal Experience','Content Access','Custom UI','Live / Recorded Resources','Member Journey'],
    },
    cjb: {
      kicker: '[ CONSULTING & LEARNING // MARKETING OPERATIONS ]',
      title: 'CJB / LearnX',
      summary: 'Connect content, prospecting, performance reporting, dashboards, and marketing execution into clearer operational workflows.',
      flow: ['Market / Prospects','Content','Lead Generation','Scorecards','Reporting','Marketing Decisions'],
    },
  };

  const cards = [...root.querySelectorAll('.ovgo-transform-card')];
  const kicker = root.querySelector('[data-transform-kicker]');
  const title = root.querySelector('[data-transform-title]');
  const summary = root.querySelector('[data-transform-summary]');
  const flow = root.querySelector('[data-transform-flow]');

  function select(key) {
    const item = data[key];
    if (!item) return;
    cards.forEach((card) => card.classList.toggle('is-active', card.querySelector(`[data-transform="${key}"]`) != null));
    kicker.textContent = item.kicker;
    title.textContent = item.title;
    summary.textContent = item.summary;
    flow.innerHTML = item.flow.map((label, index) => `<span>${label}</span>${index < item.flow.length - 1 ? '<i>→</i>' : ''}`).join('');
    addJourneyValue('transformationsViewed', item.title);
  }

  root.querySelectorAll('[data-transform]').forEach((button) => button.addEventListener('click', () => select(button.dataset.transform)));
  select('revive');
}

function initWorkLab(root) {
  const filters = [...root.querySelectorAll('[data-filter]')];
  const items = [...root.querySelectorAll('.ovgo-work-item')];
  const inspectorTitle = root.querySelector('[data-work-inspector-title]');

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((other) => other.classList.toggle('is-active', other === button));
      items.forEach((item) => {
        item.hidden = filter !== 'all' && !item.dataset.category.split(' ').includes(filter);
      });
    });
  });

  root.querySelectorAll('[data-work-title]').forEach((button) => {
    button.addEventListener('click', () => {
      inspectorTitle.textContent = button.dataset.workTitle;
      addJourneyValue('workItemsViewed', button.dataset.workTitle);
      root.querySelector('.ovgo-work-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

function initSpotlights(root) {
  root.querySelectorAll('[data-price-card]').forEach((card) => {
    const spotlight = card.querySelector('optivue-spotlight-card');
    if (!spotlight) return;
    card.addEventListener('click', () => {
      const plan = card.dataset.pricePlan || card.querySelector('h3')?.textContent?.trim();
      if (plan) addJourneyValue('pricingPlansViewed', plan);
    });
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      spotlight.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      spotlight.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      spotlight.style.setProperty('--spot-x', '-9999px');
      spotlight.style.setProperty('--spot-y', '-9999px');
    });
  });
}

function initReveal(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sections = [...root.querySelectorAll('.ovgo-section > *, .ovgo-final-cta > *')];
  sections.forEach((element) => element.setAttribute('data-ovgo-reveal', ''));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  sections.forEach((element) => observer.observe(element));
}
