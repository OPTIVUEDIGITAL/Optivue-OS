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
      try { window.top.location.replace(url.origin + '/thank-you' + (booked ? '?src=calendly' : '')); }
      catch { /* No analytics from framed confirmation pages. */ }
      return;
    }
  }
  if (url.hostname !== 'growth.optivuedigital.com' || window.__optivueGa4Loaded) return;
  window.__optivueGa4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch { /* Direct visit. */ }
  window.gtag('js', new Date());
  window.gtag('config', 'G-9XBD3QZ5BQ', {
    page_location: url.origin + url.pathname,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9XBD3QZ5BQ';
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
})();
