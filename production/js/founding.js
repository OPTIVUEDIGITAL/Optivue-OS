import { ESTIMATOR_CONFIG } from './estimator-config.js';
import { foundingActive, foundingMarkup, displayPrice } from './founding-program.js';
import { trackEvent } from './analytics.js';
export function initFounding(root) {
 let lastActive, bannerTracked=false, timer;
 function bind() {
  root.querySelector('[data-founding-hero]')?.addEventListener('click',()=>trackEvent('founding_hero_click'));
  root.querySelector('[data-founding-terms]')?.addEventListener('toggle',event=>trackEvent('founding_terms_toggle',{state:event.target.open?'open':'closed'}));
  const banner=root.querySelector('.ovgo-founding-banner');
  if(banner && !bannerTracked && typeof IntersectionObserver==='function') {
   const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){bannerTracked=true;trackEvent('founding_banner_view');observer.disconnect();}});
   observer.observe(banner);
  }
 }
 function refresh() {
  const active=foundingActive();
  if(lastActive===active)return;
  root.querySelectorAll('[data-founding-region]').forEach(element=>{
   element.innerHTML=foundingMarkup(element.dataset.foundingRegion);element.hidden=!element.innerHTML;
  });
  root.querySelectorAll('[data-price-key]').forEach(element=>{element.textContent=displayPrice(element.dataset.priceKey,element.dataset);});
  lastActive=active;bind();
  window.dispatchEvent(new CustomEvent('optivue:pricing-state'));
 }
 function schedule() {
  clearTimeout(timer);refresh();
  if(!foundingActive())return;
  const remaining=Date.parse(ESTIMATOR_CONFIG.founding.endDate+'T23:59:59.999Z')-Date.now()+1;
  timer=setTimeout(schedule,Math.min(remaining,2147483647));
 }
 schedule();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
 window.addEventListener('focus',schedule);
}
