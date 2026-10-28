import {analyticsEnvironment} from './analytics-config.js';
import {allows,clearAnalytics} from './consent-core.js';
import {initConsent} from './consent-ui.js';
(() => {
  const url = new URL(window.location.href);
  const isThankYou = /^\/thank-you\/?$/.test(url.pathname);
  const booked = isThankYou && url.searchParams.get('src') === 'calendly';
  // Clean the booking URL before Google's first pageview, even on previews.
  if (isThankYou) {
    try { history.replaceState(history.state, '', url.pathname); }
    catch { return; } // Fail closed if a private URL cannot be removed.
    // Calendly's own redirect may land inside our modal iframe. Promote it
    // to the parent without configuring a second Google tag in the frame.
    if (window.top && window.top !== window.self) {
      try { if(booked)window.top.location.replace(url.origin + '/thank-you?src=calendly'); }
      catch { /* No analytics from framed confirmation pages. */ }
      return;
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
  window.gtag('consent','default',denied);
  function sync(){
    const permitted=allows('analytics');
    window['ga-disable-G-9XBD3QZ5BQ']=!permitted;
    window.gtag('consent','update',{...denied,analytics_storage:permitted?'granted':'denied'});
    if(!permitted){clearAnalytics();if(window.__optivueGa4Loaded){document.querySelector('[data-ga4-loader]')?.remove();location.reload();}return;}
    const environment=analyticsEnvironment(url.hostname);
    if(!environment||window.__optivueGa4Loaded)return;
    window.__optivueGa4Loaded=true;
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch { /* Direct visit. */ }
  window.gtag('js', new Date());
  window.gtag('config', 'G-9XBD3QZ5BQ', {
    page_location: url.origin + url.pathname,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: true,
    cookie_expires: 15552000,
    cookie_update: false,
    site_environment: environment,
    ...(environment === 'private_preview' ? {debug_mode:true} : {}),
  });
  const script = document.createElement('script');
  script.async = true;
  script.dataset.ga4Loader='true';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9XBD3QZ5BQ';
  script.addEventListener('load',()=>document.documentElement.dataset.analyticsStatus='loaded');
  script.addEventListener('error',()=>document.documentElement.dataset.analyticsStatus='blocked');
  document.documentElement.dataset.analyticsStatus='loading';
  document.head.appendChild(script);
  // Single booking event source. The marker is not server-verified proof.
  // Blocked storage skips this conversion rather than risking repeats.
  if (booked) {
    try {
      if (sessionStorage.getItem('ov_fcb_sent')) return;
      sessionStorage.setItem('ov_fcb_storage_check', '1');
      sessionStorage.removeItem('ov_fcb_storage_check');
      window.gtag('event', 'fit_call_booked', { booking_source: 'calendly' });
      sessionStorage.setItem('ov_fcb_sent', '1');
    } catch { /* Page content and pageview remain available. */ }
  }
  }
  window.addEventListener('optivue:consentchange',sync);
  window.addEventListener('storage',e=>{if(e.key==='optivue-consent')sync();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
  sync();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initConsent,{once:true});else initConsent();
})();
