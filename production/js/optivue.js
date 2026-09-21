import { initBooking } from './booking.js';
import { initDiagnosis } from './diagnosis.js';
import { initEstimator } from './estimator.js';
import { initLeadCapture } from './lead-capture.js';
import { addJourneyValue, snapshot } from './context.js';

const root = document.getElementById('optivue-growth-os');

if (root) {
  initTheme(root);
  initHeader(root);
  initMobileMenu(root);
  initSystemDetail(root);
  initTransformations(root);
  initWorkLab(root);
  initSpotlights(root);
  initReveal(root);
  if (window.matchMedia('(max-width: 760px)').matches) {
    initMobileExperience(root);
  }
  initBooking(root);
  initDiagnosis(root);
  initEstimator(root);
  initLeadCapture(root);
  initPricingRecommendation(root);
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

function initSystemDetail(root) {
  const data = {
    acquire: {
      index: 'STAGE 01',
      name: 'Acquire',
      title: 'Bring the right people into the system.',
      purpose: 'Build acquisition around clear intent and measurable business outcomes rather than disconnected traffic volume.',
      tools: ['Google Ads','Meta Ads','SEO','Google Business Profile','Content'],
      capabilities: ['Intent-focused acquisition','Channel-to-offer alignment','Search and local visibility','Campaign structure','Demand capture'],
    },
    convert: {
      index: 'STAGE 02',
      name: 'Convert',
      title: 'Turn attention into measurable intent.',
      purpose: 'Reduce friction between the first click and the actions that indicate a real prospect is ready to move forward.',
      tools: ['Landing Pages','CRO','Booking','Offer Structure','Lead Qualification'],
      capabilities: ['Conversion paths','Offer framing','Form design','Booking flow','Qualification logic'],
    },
    automate: {
      index: 'STAGE 03',
      name: 'Automate',
      title: 'Move leads forward without relying on manual follow-up.',
      purpose: 'Connect lead capture to CRM routing, email, SMS, pipeline stages, and clear ownership so response does not depend on memory.',
      tools: ['CRM','Email','SMS','Lead Routing','Pipeline Automation'],
      capabilities: ['Speed to lead','Routing rules','Lifecycle automation','Pipeline progression','Follow-up consistency'],
    },
    measure: {
      index: 'STAGE 04',
      name: 'Measure',
      title: 'Track what creates qualified opportunities and customers.',
      purpose: 'Define the events and outcomes that matter, then connect website behavior, campaigns, and CRM progression into usable reporting.',
      tools: ['GA4','GTM','Dashboards','Attribution','Reporting'],
      capabilities: ['Event tracking','Funnel visibility','Campaign attribution','CRM outcome mapping','Decision-ready reporting'],
    },
    optimize: {
      index: 'STAGE 05',
      name: 'Optimize',
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
      kicker: 'Healthcare & wellness',
      title: 'Express Medical Care / Revive',
      summary: 'Connect acquisition, landing experiences, qualification, CRM routing, automated follow-up, consultation booking, and performance visibility.',
      flow: ['Search / Ads / GBP','Landing Experience','Lead Capture','Qualification','CRM','SMS + Email','Consultation Pipeline','Customer','Analytics'],
    },
    cbp: {
      kicker: 'Education & membership',
      title: 'CBP / Ideal Spine',
      summary: 'Create a connected member-facing experience across portal UX, custom front-end implementation, content access, and supporting digital systems.',
      flow: ['Member Entry','Portal Experience','Content Access','Custom UI','Live / Recorded Resources','Member Journey'],
    },
    cjb: {
      kicker: 'Consulting & learning',
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
  const detailTitle = root.querySelector('[data-work-detail-title]');

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
      detailTitle.textContent = button.dataset.workTitle;
      addJourneyValue('workItemsViewed', button.dataset.workTitle);
      root.querySelector('.ovgo-work-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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



function initMobileExperience(root) {
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  if (!mobileQuery.matches) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = root.querySelector('.ovgo-hero');
  const modal = root.querySelector('[data-ovgo-modal]');
  const menuToggle = root.querySelector('[data-ovgo-menu-toggle]');
  const stageGrid = root.querySelector('.ovgo-stage-grid');
  const pricingGrid = root.querySelector('.ovgo-pricing-grid');
  const workList = root.querySelector('.ovgo-work-list');
  const desktopWorkDetail = root.querySelector('.ovgo-work-detail');
  const cleanup = [];

  // Persistent phone CTA. Booking.js initializes after this function, so it
  // attaches the existing Calendly behavior without duplicating routing logic.
  const mobileCta = document.createElement('div');
  mobileCta.className = 'ovgo-mobile-cta';
  mobileCta.innerHTML = '<button class="ovgo-btn ovgo-btn--primary" type="button" data-ovgo-booking data-ovgo-intent="proposal">Book a discovery call</button>';
  root.append(mobileCta);

  let heroVisible = true;
  let formFocused = false;

  const updateCta = () => {
    const modalOpen = Boolean(modal && !modal.hidden);
    const menuOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    mobileCta.classList.toggle('is-visible', !heroVisible && !modalOpen && !menuOpen && !formFocused);
  };

  if (hero) {
    const heroObserver = new IntersectionObserver((entries) => {
      heroVisible = entries[0]?.isIntersecting ?? true;
      updateCta();
    }, { threshold: 0.01 });
    heroObserver.observe(hero);
    cleanup.push(() => heroObserver.disconnect());
  }

  const stateObserver = new MutationObserver(updateCta);
  if (modal) stateObserver.observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  if (menuToggle) stateObserver.observe(menuToggle, { attributes: true, attributeFilter: ['aria-expanded'] });
  cleanup.push(() => stateObserver.disconnect());

  const onFocusIn = (event) => {
    formFocused = Boolean(event.target instanceof Element && event.target.closest('form'));
    updateCta();
  };
  const onFocusOut = () => {
    requestAnimationFrame(() => {
      formFocused = Boolean(document.activeElement instanceof Element && document.activeElement.closest('form'));
      updateCta();
    });
  };
  document.addEventListener('focusin', onFocusIn, true);
  document.addEventListener('focusout', onFocusOut, true);
  cleanup.push(() => {
    document.removeEventListener('focusin', onFocusIn, true);
    document.removeEventListener('focusout', onFocusOut, true);
  });

  // Native snap carousel indicators for the five live system stages.
  if (stageGrid) {
    const stageCards = [...stageGrid.querySelectorAll('.ovgo-stage')];
    stageGrid.tabIndex = 0;

    const dots = document.createElement('div');
    dots.className = 'ovgo-carousel-dots';
    dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = stageCards.map((_, index) => '<span class="ovgo-carousel-dot' + (index === 0 ? ' is-active' : '') + '"></span>').join('');
    stageGrid.insertAdjacentElement('afterend', dots);
    const dotEls = [...dots.children];

    let scrollFrame = 0;
    const updateDots = () => {
      scrollFrame = 0;
      const gridLeft = stageGrid.getBoundingClientRect().left;
      let activeIndex = 0;
      let activeDistance = Number.POSITIVE_INFINITY;
      stageCards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - gridLeft);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeIndex = index;
        }
      });
      dotEls.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
    };
    const onStageScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateDots);
    };
    stageGrid.addEventListener('scroll', onStageScroll, { passive: true });
    cleanup.push(() => {
      stageGrid.removeEventListener('scroll', onStageScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      dots.remove();
      stageGrid.removeAttribute('tabindex');
    });
  }

  // Give the native pricing scroller a keyboard focus target and put the
  // featured plan first in DOM order on phones only. Restore source order if
  // this mobile initializer is destroyed.
  if (pricingGrid) {
    const pricingCards = [...pricingGrid.querySelectorAll('[data-price-card]')];
    const featuredCard = pricingGrid.querySelector('.ovgo-price-card.is-featured');
    if (featuredCard && pricingCards[0] !== featuredCard) pricingGrid.prepend(featuredCard);

    pricingGrid.tabIndex = 0;
    pricingGrid.setAttribute('role', 'region');
    pricingGrid.setAttribute('aria-label', 'Pricing plans');
    cleanup.push(() => {
      pricingCards.forEach((card) => pricingGrid.append(card));
      pricingGrid.removeAttribute('tabindex');
      pricingGrid.removeAttribute('role');
      pricingGrid.removeAttribute('aria-label');
    });
  }

  // Work detail becomes an inline one-open-at-a-time accordion on phones.
  if (workList && desktopWorkDetail) {
    const workButtons = [...workList.querySelectorAll('[data-work-title]')];
    const panels = new Map();

    workButtons.forEach((button, index) => {
      const panel = desktopWorkDetail.cloneNode(true);
      panel.className = 'ovgo-work-mobile-detail';
      panel.id = 'ovgo-work-mobile-detail-' + (index + 1);
      panel.hidden = index !== 0;
      panel.querySelector('[data-work-detail-title]')?.replaceChildren(document.createTextNode(button.dataset.workTitle || 'Work detail'));
      button.setAttribute('aria-expanded', String(index === 0));
      button.setAttribute('aria-controls', panel.id);
      button.insertAdjacentElement('afterend', panel);
      panels.set(button, panel);
    });

    const onWorkClick = (event) => {
      const button = event.target instanceof Element ? event.target.closest('[data-work-title]') : null;
      if (!button || !workList.contains(button)) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const panel = panels.get(button);
      const willOpen = button.getAttribute('aria-expanded') !== 'true';

      panels.forEach((candidatePanel, candidateButton) => {
        candidatePanel.hidden = true;
        candidateButton.setAttribute('aria-expanded', 'false');
      });

      if (willOpen && panel) {
        panel.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        addJourneyValue('workItemsViewed', button.dataset.workTitle);
        requestAnimationFrame(() => {
          button.closest('.ovgo-work-item')?.scrollIntoView({
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
            block: 'start',
          });
        });
      }
    };

    workList.addEventListener('click', onWorkClick, true);
    cleanup.push(() => {
      workList.removeEventListener('click', onWorkClick, true);
      panels.forEach((panel, button) => {
        panel.remove();
        button.removeAttribute('aria-expanded');
        button.removeAttribute('aria-controls');
      });
    });
  }

  updateCta();

  const destroy = () => {
    cleanup.splice(0).forEach((fn) => fn());
    mobileCta.remove();
    mobileQuery.removeEventListener('change', onMediaChange);
  };
  const onMediaChange = (event) => {
    if (!event.matches) destroy();
  };
  mobileQuery.addEventListener('change', onMediaChange);
}

function initPricingRecommendation(root) {
  const cards = [...root.querySelectorAll('[data-price-card]')];

  const apply = () => {
    const recommended = snapshot().estimator.recommendedPlan;
    cards.forEach((card) => {
      const match = Boolean(recommended) && card.dataset.pricePlan === recommended;
      card.classList.toggle('is-recommended', match);
      let badge = card.querySelector('[data-recommended-badge]');
      if (match && !badge) {
        badge = document.createElement('div');
        badge.className = 'ovgo-recommended-badge';
        badge.dataset.recommendedBadge = '';
        badge.textContent = 'LIKELY FIT BASED ON YOUR ESTIMATE';
        card.querySelector('.ovgo-price-card__content')?.prepend(badge);
      } else if (!match && badge) {
        badge.remove();
      }
    });
  };

  apply();
  window.addEventListener('ovgo:contextchange', apply);
}
