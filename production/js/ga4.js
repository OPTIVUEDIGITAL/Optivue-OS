(() => {
  if (window.location.hostname !== 'growth.optivuedigital.com' || window.__optivueGa4Loaded) return;
  window.__optivueGa4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-9XBD3QZ5BQ');
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9XBD3QZ5BQ';
  document.head.appendChild(script);
})();
