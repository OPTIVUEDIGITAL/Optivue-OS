import { setJourneyFlag, snapshot } from './context.js';

const CALENDLY_URL = 'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit';

export function initBooking(root) {
  const modal = root.querySelector('[data-ovgo-modal]');
  const frame = root.querySelector('[data-ovgo-calendly]');
  const triggers = root.querySelectorAll('[data-ovgo-booking]');
  const closers = root.querySelectorAll('[data-ovgo-modal-close]');
  let previousFocus = null;

  if (!modal || !frame) return;

  const focusables = () => [...modal.querySelectorAll('button,[href],iframe,[tabindex]:not([tabindex="-1"])')];

  function open(event) {
    previousFocus = document.activeElement;
    const source = event?.currentTarget;
    const proposalIntent = source?.dataset?.ovgoIntent === 'proposal';
    if (proposalIntent) setJourneyFlag('proposalIntent', true);
    setJourneyFlag('bookingIntent', true);

    const context = snapshot();
    const url = new URL(CALENDLY_URL);
    if (context.identity.name) url.searchParams.set('name', context.identity.name);
    if (context.identity.email) url.searchParams.set('email', context.identity.email);
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

  triggers.forEach((trigger) => trigger.addEventListener('click', open));
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
}
