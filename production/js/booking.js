import { setJourneyFlag, snapshot } from './context.js';
import { trackEvent } from './analytics.js';

const CALENDLY_URL = 'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit';
const initializedRoots = new WeakSet();
const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export function buildCalendlyUrl(baseUrl = CALENDLY_URL, pageUrl = globalThis.location?.href || '') {
  const url = new URL(baseUrl);
  if (!pageUrl) return url.toString();
  const page = new URL(pageUrl);
  for (const field of UTM_FIELDS) {
    const value = page.searchParams.get(field);
    if (value) url.searchParams.set(field, value);
  }
  return url.toString();
}

export function initBooking(root) {
  const modal = root.querySelector('[data-ovgo-modal]');
  const frame = root.querySelector('[data-ovgo-calendly]');
  const closers = root.querySelectorAll('[data-ovgo-modal-close]');
  let previousFocus = null;

  if (!modal || !frame || initializedRoots.has(root)) return;
  initializedRoots.add(root);
  let bookingTracked = false;
  const completedBookings = new Set();

  const focusables = () => [...modal.querySelectorAll('button,[href],iframe,[tabindex]:not([tabindex="-1"])')];

  function open(event) {
    previousFocus = document.activeElement;
    const source = event?.target?.closest?.('[data-ovgo-booking]') || event?.currentTarget;
    const offerName = source?.dataset?.offerName || '';
    trackEvent(offerName === 'Growth Systems Audit' ? 'request_audit_click' : 'book_fit_call_click');
    const proposalIntent = source?.dataset?.ovgoIntent === 'proposal';
    if (proposalIntent) setJourneyFlag('proposalIntent', true);
    setJourneyFlag('bookingIntent', true);

    const context = snapshot();
    const url = new URL(buildCalendlyUrl(CALENDLY_URL));
    if (context.identity.name) url.searchParams.set('name', context.identity.name);
    if (context.identity.email) url.searchParams.set('email', context.identity.email);
    url.searchParams.set('embed_domain', 'growth.optivuedigital.com');
    url.searchParams.set('embed_type', 'PopupText');
    bookingTracked = false;
    frame.src = url.toString();
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.querySelector('[data-ovgo-modal-close]')?.focus());
  }

  function close() {
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    previousFocus?.focus?.();
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-ovgo-booking]')) open(event);
  });
  closers.forEach((closer) => closer.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://calendly.com' || event.source !== frame.contentWindow) return;
    if (event.data?.event !== 'calendly.event_scheduled' || bookingTracked) return;
    const bookingId = event.data?.payload?.invitee?.uri || event.data?.payload?.event?.uri;
    if (bookingId && completedBookings.has(bookingId)) return;
    bookingTracked = true;
    if (bookingId) completedBookings.add(bookingId);
    trackEvent('fit_call_booked');
  });
}
