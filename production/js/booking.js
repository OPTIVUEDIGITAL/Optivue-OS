const CALENDLY_URL = 'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit';

export function initBooking(root) {
  const triggers = root.querySelectorAll('[data-ovgo-action="proposal"]');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      // Production implementation will use the accessible shared modal component.
      // Opening a new tab is a graceful fallback if modal embedding is unavailable.
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    });
  });
}
