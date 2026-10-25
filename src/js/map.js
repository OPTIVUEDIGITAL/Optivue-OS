const poster = document.querySelector('.poster');
const motion = matchMedia('(prefers-reduced-motion:reduce)');
let visible = true, parentVisible = true, lastHeight = 0, sizePending = false;
function syncMotion() {
  poster.classList.toggle('running', visible && parentVisible && !document.hidden && !motion.matches && !navigator.connection?.saveData);
}
if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  syncMotion();
}).observe(poster);
document.addEventListener('visibilitychange', syncMotion);
motion.addEventListener('change', syncMotion);
navigator.connection?.addEventListener?.('change', syncMotion);
function reportSize() {
  if (sizePending) return;
  sizePending = true;
  requestAnimationFrame(() => {
    sizePending = false;
    const height = Math.ceil(document.body.getBoundingClientRect().height);
    if (height !== lastHeight) {
      lastHeight = height;
      parent.postMessage({type:'optivue-map-size',height}, location.origin);
    }
  });
}
if ('ResizeObserver' in window) new ResizeObserver(reportSize).observe(document.body);
addEventListener('load', reportSize);
addEventListener('resize', reportSize, {passive:true});
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent) return;
  if (event.data?.type === 'optivue-map-theme') {
    document.documentElement.dataset.theme = event.data.theme === 'dark' ? 'dark' : 'light';
    reportSize();
  }
  if (event.data?.type === 'optivue-map-visibility') {
    parentVisible = event.data.visible === true;
    syncMotion();
  }
});
document.documentElement.classList.add('js');
const toggle = document.querySelector('#view-toggle');
const map = document.querySelector('.map');
const status = document.querySelector('#view-status');
toggle.addEventListener('click', () => {
  const expanded = map.classList.toggle('details');
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.textContent = expanded ? 'Back to Overview' : 'View Details';
  status.textContent = expanded ? 'Details · 24 stops' : 'Overview';
  parent.postMessage({type:'optivue-map-interaction',action:expanded?'details':'overview'}, location.origin);
  reportSize();
});
const image = document.querySelector('.avatar img');
if (!image.complete) image.parentElement.classList.add('loading');
image.addEventListener('load', () => image.parentElement.classList.remove('loading'));
image.addEventListener('error', () => {image.parentElement.classList.remove('loading');image.hidden=true;});
syncMotion();
reportSize();
