import {legal} from '../config/legal.ts';
import {allows,readConsent,saveConsent} from './consent-core.js';
import { setJourneyFlag, snapshot } from './context.js';
import { trackEvent } from './analytics.js';

const CALENDLY_URL = legal.bookingUrl;
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

export function bookingEventName(dataset = {}) {
  return dataset.offerKey === 'diagnostic' || ['Growth Systems Audit', 'The Systems Audit'].includes(dataset.offerName)
    ? 'request_audit_click' : 'book_fit_call_click';
}

export function isCalendlyMessage(event, frameWindow) { return event.origin === 'https://calendly.com' && event.source === frameWindow; }

export function initBooking(root) {
  const modal = root.querySelector('[data-ovgo-modal]');
  const frame = root.querySelector('[data-ovgo-calendly]');
  const closers = root.querySelectorAll('[data-ovgo-modal-close]');
  let previousFocus = null;

  if (!modal || !frame || initializedRoots.has(root)) return;
  initializedRoots.add(root);
  let redirecting = false;

  const focusables = () => [...modal.querySelectorAll('button,[href],iframe,[tabindex]:not([tabindex="-1"])')];

  function open(event) {
    previousFocus = document.activeElement;
    const source = event?.target?.closest?.('[data-ovgo-booking]') || event?.currentTarget;
    const cta_location = source?.dataset?.ctaLocation || (root.querySelector('[data-ovgo-estimator]') ? 'estimator' : 'unknown');
    trackEvent(bookingEventName(source?.dataset), { cta_location });
    const heading=modal.querySelector('#ovgo-booking-title');
    if(heading) heading.textContent=source?.dataset?.offerName || 'Find the next priority';
    const proposalIntent = source?.dataset?.ovgoIntent === 'proposal';
    if (proposalIntent) setJourneyFlag('proposalIntent', true);
    setJourneyFlag('bookingIntent', true);

    const context = snapshot();
    const url = new URL(buildCalendlyUrl(CALENDLY_URL));
    if (context.identity.name) url.searchParams.set('name', context.identity.name);
    if (context.identity.email) url.searchParams.set('email', context.identity.email);
    url.searchParams.set('embed_domain', location.hostname);
    url.searchParams.set('embed_type', 'PopupText');
    let notice=modal.querySelector('.booking-privacy');
    if(!notice){notice=document.createElement('div');notice.className='booking-privacy';notice.innerHTML=`<p>${legal.calendlyNotice} <a href="/privacy">Privacy Policy</a> · <a href="/cookies">Cookie Policy</a></p><p>Do not submit patient information or personal health data.</p><button type="button" data-booking-continue>Continue to booking</button>`;frame.before(notice);}
    const proceed=notice.querySelector('button');
    const loadBooking=()=>{frame.hidden=false;frame.src=url.toString();proceed.hidden=true;};
    frame.hidden=!allows('functional');proceed.hidden=allows('functional');
    proceed.onclick=()=>{saveConsent({...readConsent().choices,functional:true},true);loadBooking();frame.focus();};
    if(allows('functional'))loadBooking();
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.querySelector('[data-ovgo-modal-close]')?.focus());
  }

  function close(event) {
    if(modal.hidden)return;
    trackEvent('booking_modal_close',{action:event?.key==='Escape'?'escape':event?.currentTarget?.classList?.contains('ovgo-modal__backdrop')?'backdrop':'button'});
    modal.hidden = true;
    frame.removeAttribute('src');
    document.documentElement.style.overflow = '';
    previousFocus?.focus?.();
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-ovgo-booking]')) open(event);
  });
  closers.forEach((closer) => closer.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close(event);
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

  const bookingSteps=new Set();
  window.addEventListener('message', (event) => {
    if (!isCalendlyMessage(event, frame.contentWindow)) return;
    const step={'calendly.event_type_viewed':'event_type','calendly.date_and_time_selected':'date_time','calendly.event_scheduled':'scheduled'}[event.data?.event];
    if(!modal.hidden&&step&&!bookingSteps.has(step)){bookingSteps.add(step);trackEvent('calendly_step_view',{step});}
    if (event.data?.event !== 'calendly.event_scheduled' || redirecting || modal.hidden) return;
    redirecting = true;
    // Never read or forward the Calendly payload. The destination owns counting.
    window.location.assign('/thank-you?src=calendly');
  });
}
