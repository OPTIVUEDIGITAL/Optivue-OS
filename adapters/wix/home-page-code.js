/**
 * Wix Studio adapter for Optivue Growth OS home page.
 * This file is intentionally platform-specific; shared UI logic lives elsewhere.
 */
import { local } from 'wix-storage-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import wixWindowFrontend from 'wix-window-frontend';

const THEME_KEY = 'optivue-theme';
const CALENDLY_URL = 'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit';

$w.onReady(function () {
  initTheme();
  initDensity();
  initCtas();
});

function initTheme() {
  const stored = local.getItem(THEME_KEY);
  const prefersLight =
    wixWindowFrontend.rendering.env === 'browser' &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  let theme = stored || (prefersLight ? 'light' : 'dark');
  applyTheme(theme);

  if ($w('#themeToggle')) {
    $w('#themeToggle').onClick(() => {
      theme = theme === 'dark' ? 'light' : 'dark';
      local.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });
  }
}

function applyTheme(theme) {
  const element = $w('#growthSystem');
  if (element) element.setAttribute('theme', theme);
  if (wixWindowFrontend.rendering.env === 'browser') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function initDensity() {
  const element = $w('#growthSystem');
  if (!element) return;
  const factor = wixWindowFrontend.formFactor;
  element.setAttribute('density', factor === 'Mobile' ? 'reduced' : 'full');
}

function initCtas() {
  ['#btnProposal', '#btnProposalNav'].forEach((id) => {
    if ($w(id)) $w(id).onClick(openCalendly);
  });

  if ($w('#btnAudit')) {
    $w('#btnAudit').onClick(() => wixLocationFrontend.to('/diagnosis'));
  }
}

function openCalendly() {
  wixWindowFrontend.openLightbox('CalendlyModal', { url: CALENDLY_URL });
}
