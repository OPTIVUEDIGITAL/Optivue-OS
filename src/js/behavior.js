import {trackEvent} from './analytics.js';
const initialized=new WeakSet();
export function scrollMilestones(scrollTop, viewport, documentHeight, sent) {
 if(scrollTop<=0||documentHeight<=viewport)return [];
 const depth=Math.min(100,(scrollTop+viewport)/documentHeight*100);
 return [25,50,75,90].filter(n=>depth>=n&&!sent.has(n));
}
export function initBehavior(root) {
 if(!root||initialized.has(root))return;initialized.add(root);
 const sent=new Set(); let pending=false;
 window.addEventListener('scroll',()=>{if(pending||document.hidden)return;pending=true;requestAnimationFrame(()=>{pending=false;for(const n of scrollMilestones(window.scrollY,window.innerHeight,document.documentElement.scrollHeight,sent)){sent.add(n);trackEvent('scroll_depth',{percent_scrolled:n});}});},{passive:true});
 const seen=new Set(), timers=new Map(), visible=new Set();
 function arm(el){if(seen.has(el)||timers.has(el)||document.hidden)return;timers.set(el,setTimeout(()=>{timers.delete(el);if(!visible.has(el)||document.hidden)return;seen.add(el);trackEvent('section_view',{section_id:el.closest('section').id});},1000));}
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&e.intersectionRatio>=.5){visible.add(e.target);arm(e.target);}else{visible.delete(e.target);clearTimeout(timers.get(e.target));timers.delete(e.target);}}},{threshold:[0,.5,1]});root.querySelectorAll('main > section[id]').forEach(section=>{const h=section.querySelector('h1,h2');if(h)observer.observe(h);});
 document.addEventListener('visibilitychange',()=>{for(const timer of timers.values())clearTimeout(timer);timers.clear();if(!document.hidden)visible.forEach(arm);});}
 const locationOf=el=>el.closest('.ovgo-mobile-menu')?'mobile':el.closest('header')?'header':el.closest('footer')?'footer':'content';
 root.addEventListener('click',e=>{const el=e.target.closest('a,button');if(!el)return;
  if(el.matches('a')){const href=el.getAttribute('href')||'';if(href.startsWith('#'))trackEvent('navigation_click',{section_id:href.slice(1),nav_location:locationOf(el)});else if(href==='/estimator')trackEvent('estimator_link_click',{section_id:el.closest('section')?.id||'overview',nav_location:locationOf(el)});}
  if(el.matches('[data-stage]'))trackEvent('system_stage_select',{stage:el.dataset.stage});
  if(el.matches('[data-ovgo-theme]'))trackEvent('theme_change',{theme:root.dataset.theme});
  if(el.matches('[data-ovgo-menu-toggle]'))trackEvent('mobile_menu_toggle',{action:el.getAttribute('aria-expanded')==='true'?'open':'close'});
 });
 const faqIds=['paid_audit','results','ad_spend','ownership','team_requirements','price_difference'];
 root.querySelectorAll('#faq details').forEach((el,i)=>el.addEventListener('toggle',()=>{if(el.open)trackEvent('faq_open',{faq_id:faqIds[i]});}));
 const compare=root.querySelector('#reporting optivue-compare');
 if(compare){let used=false;const record=method=>{if(!used){used=true;trackEvent('reporting_compare',{input_method:method});}};compare.addEventListener('pointerup',()=>record('pointer'));compare.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))record('keyboard');});}
 const map=root.querySelector('#growth-map-frame');
 window.addEventListener('message',e=>{if(map&&e.origin===location.origin&&e.source===map.contentWindow&&e.data?.type==='optivue-map-interaction')trackEvent('growth_map_interaction',{action:e.data.action});});
}
