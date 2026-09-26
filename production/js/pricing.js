import { trackEvent } from './analytics.js';
export function initPricingBreakdowns(root) {
 const grid=root.querySelector('.ovgo-pricing-grid');
 if(!grid)return;
 const keys=['diagnostic','foundation','operations'];
 const media=window.matchMedia('(min-width: 1024px)');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const panels=Object.fromEntries([...keys,'care'].map(k=>[k,root.querySelector(`[data-breakdown="${k}"]`)]));
 const tabs=keys.map(k=>root.querySelector(`[data-pricing-trigger="${k}"]`));
 const shared=root.querySelector('[data-pricing-desktop-panel]');
 const tablist=root.querySelector('[data-pricing-tablist]');
 let selected=null,careOpen=false;
 let animation=null,scrollFrame=0;
 const controls=k=>[root.querySelector(`[data-pricing-trigger="${k}"]`),root.querySelector(`[data-pricing-toggle="${k}"]`)].filter(Boolean);
 function render() {
  for(const k of [...keys,'care']) {
   const open=k==='care'?careOpen:selected===k;
   panels[k].hidden=!open;
   for(const c of controls(k)) {
    c.setAttribute('aria-expanded',String(open));
    if(c.hasAttribute('data-pricing-toggle'))c.textContent=open?'Hide details ▴':'See what you get ▾';
   }
   if(k!=='care') {
    const tab=tabs[keys.indexOf(k)];
    tab.querySelector('.ovgo-pricing-selected').hidden=!open;
    tab.closest('[data-price-card]').classList.toggle('is-selected',open);
    if(media.matches){tab.setAttribute('aria-selected',String(open));tab.tabIndex=(selected?open:k==='diagnostic')?0:-1;}
    else {tab.removeAttribute('aria-selected');tab.tabIndex=0;}
   }
  }
  shared.hidden=!media.matches||!selected;
 }
 function open(k, toggle=false) {
  const was=k==='care'?careOpen:selected===k;
  if(k==='care')careOpen=toggle?!careOpen:true;
  else selected=toggle&&was?null:k;
  animation?.cancel();cancelAnimationFrame(scrollFrame);
  render();
  const showing=k==='care'?careOpen:selected===k;
  if(!showing||was)return;
  trackEvent('pricing_breakdown_open',{tier:k,device:media.matches?'desktop':'mobile'});
  const panel=panels[k];
  if(!reduce.matches && panel.animate)animation=panel.animate([{height:'0px',opacity:0,overflow:'hidden'},{height:`${panel.offsetHeight}px`,opacity:1,overflow:'hidden'}],{duration:200,easing:'ease-out'});
  if(!media.matches) {
   scrollFrame=requestAnimationFrame(()=>{
    const header=root.querySelector('[data-ovgo-header]');
    const top=panel.getBoundingClientRect().top+window.scrollY-(header?.getBoundingClientRect().height||0)-16;
    window.scrollTo({top,behavior:reduce.matches?'instant':'smooth'});
   });
  }
 }
 function layout() {
  animation?.cancel();cancelAnimationFrame(scrollFrame);
  selected=media.matches?'diagnostic':null;
  tablist.hidden=!media.matches;
  if(media.matches){tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label','Pricing tiers');tablist.setAttribute('aria-owns',tabs.map(t=>t.id).join(' '));}
  else {tablist.removeAttribute('role');tablist.removeAttribute('aria-owns');}
  keys.forEach((k,i)=>{
   const panel=panels[k],tab=tabs[i];
   (media.matches?shared:root.querySelector(`[data-breakdown-slot="${k}"]`)).append(panel);
   if(media.matches){tab.setAttribute('role','tab');panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;}
   else {tab.removeAttribute('role');panel.removeAttribute('role');panel.setAttribute('aria-labelledby',`pricing-panel-title-${k}`);panel.removeAttribute('tabindex');}
  });
  render();
 }
 root.querySelectorAll('[data-pricing-summary]').forEach(e=>e.hidden=true);
 root.querySelectorAll('[data-pricing-trigger],[data-pricing-toggle]').forEach(c=>{
  c.hidden=false;
  c.addEventListener('click',()=>open(c.dataset.pricingTrigger||c.dataset.pricingToggle,c.hasAttribute('data-pricing-toggle')||!media.matches));
 });
 tabs.forEach((tab,i)=>tab.addEventListener('keydown',event=>{
  if(!media.matches)return;
  let next;
  if(event.key==='ArrowRight')next=(i+1)%tabs.length;
  if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=tabs.length-1;
  if(next===undefined)return;
  event.preventDefault();open(keys[next]);tabs[next].focus();
 }));
 media.addEventListener('change',layout);
 layout();
}
