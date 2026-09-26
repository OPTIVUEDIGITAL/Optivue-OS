import { ESTIMATOR_CONFIG } from './estimator-config.js';
export const money = value => '$' + Number(value).toLocaleString('en-US');
export function foundingActive(config = ESTIMATOR_CONFIG, now = new Date()) {
 const f=config.founding;
 return !!(f?.enabled && Number.isInteger(f.spotsRemaining) && f.spotsRemaining>0 && f.spotsRemaining<=f.spotsTotal && Number.isFinite(Date.parse(f.endDate+'T23:59:59.999Z')) && now.getTime()<=Date.parse(f.endDate+'T23:59:59.999Z'));
}
export function programLine(config=ESTIMATOR_CONFIG) { const f=config.founding; return `Founding Clinic pricing: ${f.spotsRemaining} of ${f.spotsTotal} spots open.`; }
export function priceFor(key, config=ESTIMATOR_CONFIG, now=new Date()) {
 const base=config.prices[key], f=config.founding, active=foundingActive(config,now)&&key!=='care';
 if(!active)return {...base,founding:false,standard:base.display};
 return {...base,founding:true,standard:base.display,display:(key==='foundation'?'from ':'')+money(f.prices[key])+(key==='operations'?'/month':''),note:key==='operations'?`For ${f.operationsFoundingMonths} months, then ${money(f.standardAmounts.operations)}/month.`:`Standard ${base.display.replace(/^From /,'from ')} once founding spots fill.`};
}
export function first90Days(config=ESTIMATOR_CONFIG,now=new Date()) {
 const active=foundingActive(config,now),p=active?config.founding.prices:config.founding.standardAmounts;
 return `Typical first 90 days: from ${money(p.diagnostic+p.foundation)} (Diagnostic + Foundation Launch${active?', founding prices':''})`;
}
export function displayPrice(key, dataset={}, config=ESTIMATOR_CONFIG, now=new Date()) {
 let value=priceFor(key,config,now).display;
 if('priceAmount' in dataset)value=value.replace('/month','');
 if('priceLowercase' in dataset)value=value.replace(/^From /,'from ');
 if('priceExact' in dataset)value=value.replace(/^From /,'');
 return value;
}
export function foundingMarkup(region,config=ESTIMATOR_CONFIG,now=new Date()) {
 if(!foundingActive(config,now))return '';
 const f=config.founding,p=f.prices,s=f.standardAmounts;
 const date=new Date(f.endDate+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'});
 const eligibility=`For single-location health, wellness, or aesthetics clinics in the ${f.countries.join(', ').replace(', Australia', ', or Australia')}. Multi-location setups receive a standard custom proposal.`;
 if(region==='hero')return f.heroEnabled?`<a href="#pricing" data-founding-hero>Founding Clinic pricing: ${f.spotsRemaining} of ${f.spotsTotal} spots open →</a>`:'';
 if(region==='banner')return `<aside class="ovgo-founding-banner" aria-label="Founding Clinic pricing"><strong>Founding Clinic pricing</strong><p>${f.spotsRemaining} of ${f.spotsTotal} spots open · until ${date}</p><p>My first ${f.spotsTotal===3?'three':f.spotsTotal} clinics get founding prices. In return, I publish your results, with your approval.</p><p>${eligibility}</p><details data-founding-terms><summary>What founding clinics agree to ▾</summary><ul><li>Permission to publish your results, named or anonymized. You approve the wording.</li><li>Share your starting numbers at the Diagnostic, and the same numbers at day 90.</li><li>A 20-minute feedback call at day 90.</li><li>You don't have to write a positive review. I publish honest results.</li><li>Patient information is never published.</li></ul></details></aside>`;
 if(region.startsWith('card-')) {
  const key=region.slice(5);
  const note=key==='diagnostic'?`Standard ${money(s.diagnostic)} once founding spots fill`:key==='foundation'?`Standard from ${money(s.foundation)}`:`per month for ${f.operationsFoundingMonths} months, then ${money(s.operations)}`;
  return `<small class="ovgo-founding-label">founding price</small><small>${note}</small>`;
 }
 if(region.startsWith('panel-')) {
  const key=region.slice(6);
  const text=key==='diagnostic'?`Founding price: ${money(p.diagnostic)} (standard ${money(s.diagnostic)}). Price covers one location.`:key==='foundation'?`Founding price: from ${money(p.foundation)} (standard from ${money(s.foundation)}). Three installments: 50% to start, 25% on day 30, 25% on day 60.`:`Founding price: ${money(p.operations)}/month for your first ${f.operationsFoundingMonths} months, then ${money(s.operations)}/month. Billed monthly in advance. 3-month minimum.`;
  return `<p class="ovgo-founding-panel">${text}</p>`;
 }
 if(region==='faq')return `<details><summary>What is Founding Clinic pricing?</summary><p>My first ${f.spotsTotal===3?'three':f.spotsTotal} clinics get lower prices. In return, I publish your results, with your approval. It ends on ${date}, or when ${f.spotsTotal===3?'three':f.spotsTotal} clinics join.</p></details><details><summary>What happens after the founding period?</summary><p>Your Diagnostic and Foundation prices stay as agreed. Growth Operations moves to ${money(s.operations)}/month after your first ${f.operationsFoundingMonths} months. I confirm this in writing before you start.</p></details><details><summary>Do I have to give you a good review?</summary><p>No. You agree to let me publish your results, whatever they are. You approve the wording. Patient information is never published.</p></details>`;
 return '';
}
export function regionHTML(region,config=ESTIMATOR_CONFIG,now=new Date()) {
 const content=foundingMarkup(region,config,now);
 const tag=region.startsWith('card-')?'span':'div';
 return `<${tag} data-founding-region="${region}"${content?'':' hidden'}>${content}</${tag}>`;
}
export function renderFoundingHTML(html,config=ESTIMATOR_CONFIG,now=new Date()) {
 let output=html.replace(/<!-- founding:([\w-]+):start -->[\s\S]*?<!-- founding:\1:end -->/g,(_,region)=>`<!-- founding:${region}:start -->${regionHTML(region,config,now)}<!-- founding:${region}:end -->`);
 output=output.replace(/(<(?:strong|span)[^>]*data-price-key="(\w+)"([^>]*)>)[^<]*(<\/(?:strong|span)>)/g,(_,open,key,attrs,close)=>open+displayPrice(key,{...(/data-price-amount/.test(attrs)?{priceAmount:''}:{}),...(/data-price-lowercase/.test(attrs)?{priceLowercase:''}:{}),...(/data-price-exact/.test(attrs)?{priceExact:''}:{})},config,now)+close);
 return output;
}
