/**
 * Wix Studio adapter for Optivue Growth OS pricing page.
 * Pricing copy should stay in native Wix text elements for indexability.
 */
import { local } from 'wix-storage-frontend';
import wixWindowFrontend from 'wix-window-frontend';

const CALENDLY_URL = 'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit';

$w.onReady(function () {
  wireSpotlightTheme();
  wireCtas();
  wireEntranceMotion();
});

function wireSpotlightTheme() {
  const theme = local.getItem('optivue-theme') || 'dark';
  ['#spotlight1', '#spotlight2', '#spotlight3'].forEach((id) => {
    if ($w(id)) $w(id).setAttribute('theme', theme);
  });
}

function wireCtas() {
  ['#cta1', '#cta2', '#cta3'].forEach((id) => {
    if ($w(id)) {
      $w(id).onClick(() => wixWindowFrontend.openLightbox('CalendlyModal', { url: CALENDLY_URL }));
    }
  });
}

function wireEntranceMotion() {
  [
    { id: '#cardWrap1', delay: 0 },
    { id: '#cardWrap2', delay: 90 },
    { id: '#cardWrap3', delay: 180 },
  ].forEach(({ id, delay }) => {
    const element = $w(id);
    if (!element) return;
    element.style.opacity = '0';
    element.onViewportEnter(() => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.removeClass?.('card-hidden');
      }, delay);
    });
  });
}
