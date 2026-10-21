const root=document.getElementById('optivue-growth-os');
let storedTheme;try{storedTheme=localStorage.getItem('optivue-theme')}catch{}
const requestedTheme=new URLSearchParams(location.search).get('theme');
const theme=[requestedTheme,storedTheme].find(value=>['light','dark'].includes(value)) || (matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
root.dataset.theme=theme;document.documentElement.style.colorScheme=theme;
const diagram=root.querySelector('.gm-diagram');
const svg=diagram.querySelector('.gm-tracks');
const ns='http://www.w3.org/2000/svg';
const colors=[...diagram.querySelectorAll('[data-source-color]')].map(port=>port.dataset.sourceColor);
function drawTracks(){
 const bounds=diagram.getBoundingClientRect();
 const point=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2-bounds.left,y:r.top+r.height/2-bounds.top}};
 const sources=[...diagram.querySelectorAll('[data-source-port]')].map(point);
 const stations=[...diagram.querySelectorAll('[data-station-port]')].map(point);
 const start=point(diagram.querySelector('[data-start-port]'));
 const mobile=matchMedia('(max-width: 1023px)').matches;
 const unit=parseFloat(getComputedStyle(root).getPropertyValue('--ovgo-estimator-space-unit'));
 const radius=parseFloat(getComputedStyle(root).getPropertyValue('--ovgo-radius-chip'));
 svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
 svg.replaceChildren();
 const path=(d,className,color)=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class',className);if(color)p.style.stroke=`var(--ovgo-${color})`;svg.append(p);return p};
 const dot=d=>{const c=document.createElementNS(ns,'circle');c.setAttribute('r',radius);c.setAttribute('class','gm-dot');c.style.offsetPath=`path('${d}')`;svg.append(c)};
 const merge=mobile?{x:stations[0].x,y:sources.at(-1).y+unit*4}:{x:stations[0].x-unit*4,y:stations[0].y};
 sources.forEach((s,i)=>{let d;if(mobile){d=`M${s.x} ${s.y} V${merge.y}`}else{const delta=Math.abs(merge.y-s.y);const bend=Math.min(s.x+unit,merge.x-delta);d=`M${s.x} ${s.y} H${bend} L${bend+delta} ${merge.y} H${merge.x}`}path(d,'gm-source-track',colors[i]);dot(d)});
 const trunk=mobile?`M${merge.x} ${merge.y} V${stations.at(-1).y}`:`M${merge.x} ${merge.y} H${stations.at(-1).x}`;
 path(trunk,'gm-trunk');dot(trunk);
 const interchange=document.createElementNS(ns,'circle');interchange.setAttribute('cx',merge.x);interchange.setAttribute('cy',merge.y);interchange.setAttribute('r',unit);interchange.setAttribute('class','gm-interchange');svg.append(interchange);
 const audit=mobile?`M${start.x} ${start.y} V${merge.y-unit*2} H${merge.x}`:`M${start.x} ${start.y} H${merge.x} V${merge.y}`;
 path(audit,'gm-audit-link');
 if(mobile){const x=stations[0].x-unit*2;path(`M${x} ${stations[0].y} V${stations.at(-1).y}`,'gm-tracking');stations.forEach(s=>path(`M${x} ${s.y} H${s.x}`,'gm-tracking'))}
 else{const y=stations[0].y+unit*3;path(`M${stations[0].x} ${y} H${stations.at(-1).x}`,'gm-tracking');stations.forEach(s=>path(`M${s.x} ${s.y} V${y}`,'gm-tracking'))}
}
root.addEventListener('keydown',event=>{if(event.key==='Escape'&&matchMedia('(min-width: 1024px)').matches){const active=event.target.closest('.gm-details');if(active?.open){active.open=false;active.querySelector('summary').focus()}}});
new IntersectionObserver(entries=>root.classList.toggle('gm-in-view',entries.some(entry=>entry.isIntersecting)),{threshold:0}).observe(diagram);
document.addEventListener('visibilitychange',()=>{if(document.hidden)root.classList.remove('gm-in-view');else root.classList.toggle('gm-in-view',diagram.getBoundingClientRect().bottom>0&&diagram.getBoundingClientRect().top<innerHeight)});
const resize=new ResizeObserver(drawTracks);resize.observe(diagram);
document.fonts.ready.then(drawTracks);drawTracks();
