import {addJourneyValue} from './context.js';
import {trackEvent} from './analytics.js';

/* Progressive enhancement: every bento card and its details render before JS. */
export function initBento(root) {
  const section = root?.querySelector('#systems.ovgo-bento');
  if (section) {
    const names = {
      'Google Ads': 'Google Ads leads near you',
      'Local Search': 'Local searches near you',
      'Google Business Profile': 'Local map enquiries near you'
    };
    section.querySelectorAll('[data-bento-source]').forEach((button) => {
      button.addEventListener('click', () => {
        section.querySelectorAll('[data-bento-source]').forEach((other) => {
          const active = button === other;
          other.classList.toggle('is-selected', active);
          other.setAttribute('aria-pressed', String(active));
        });
        const label = section.querySelector('[data-bento-search-label]');
        if (label) label.textContent = names[button.dataset.bentoSource] || 'Local patients near you';
        addJourneyValue('systemStagesViewed', 'Acquire');
        trackEvent('system_stage_select', {stage:'acquire'});
      });
    });
    section.querySelectorAll('.bento-time').forEach((button) => {
      button.addEventListener('click', () => {
        section.querySelectorAll('.bento-time').forEach((other) => {
          const active = other === button;
          other.classList.toggle('is-selected', active);
          other.setAttribute('aria-pressed', String(active));
        });
        addJourneyValue('systemStagesViewed', 'Convert');
        trackEvent('system_stage_select', {stage:'convert'});
      });
    });
    section.querySelectorAll('.bento-details').forEach((details) => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        const stage = details.querySelector('[data-bento-stage]')?.dataset.bentoStage;
        if (!stage) return;
        addJourneyValue('systemStagesViewed', stage[0].toUpperCase() + stage.slice(1));
        trackEvent('system_stage_select', {stage});
      });
    });
  }
  // Loading skeleton only appears when the lazy iframe approaches the viewport.
  // If JS fails, static fallback/iframe remains visible without an overlay.
  const frame = root?.querySelector('#growth-map-frame');
  const shell = frame?.closest('.ovgo-map-shell');
  if (!frame || !shell) return;
  let loaded = false;
  let timeout;
  let observer;
  const stop = () => {
    loaded = true;
    shell.classList.remove('is-loading');
    clearTimeout(timeout);
    observer?.disconnect();
  };
  frame.addEventListener('load', stop, {once:true});
  frame.addEventListener('error', stop, {once:true});
  const start = () => {
    if (loaded) return;
    try {
      if (frame.contentDocument?.readyState === 'complete') { stop(); return; }
    } catch { /* Embedded document access is optional. */ }
    shell.classList.add('is-loading');
    timeout = window.setTimeout(stop, 10000);
  };
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, {rootMargin:'250px'});
    observer.observe(shell);
  } else start();
}
