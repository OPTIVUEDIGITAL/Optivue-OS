import {legal} from '../config/legal.ts';
export const CONSENT_KEY='optivue-consent';
const denied=()=>({analytics:false,functional:false,marketing:false});
export function makeConsent(choices={},now=Date.now(),explicitGpcOverride=false){return {version:legal.consentVersion,timestamp:now,choices:{analytics:choices.analytics===true,functional:choices.functional===true,marketing:false},explicitGpcOverride:explicitGpcOverride===true};}
export function resolveConsent(record,now=Date.now(),gpc=false){
 const expiry=new Date(record?.timestamp);expiry.setUTCMonth(expiry.getUTCMonth()+legal.consentMonths);
 const valid=record?.version===legal.consentVersion&&Number.isFinite(record?.timestamp)&&record.timestamp<=now&&expiry.getTime()>now&&['analytics','functional','marketing'].every(k=>typeof record.choices?.[k]==='boolean');
 if(!valid)return {known:gpc,choices:denied(),gpc};
 return {known:true,choices:gpc&&!record.explicitGpcOverride?denied():{...record.choices,marketing:false},gpc};
}
export function readConsent(){let record=null;try{const value=document.cookie.split('; ').find(s=>s.startsWith(CONSENT_KEY+'='));record=JSON.parse(value?decodeURIComponent(value.slice(CONSENT_KEY.length+1)):localStorage.getItem(CONSENT_KEY));}catch{}return resolveConsent(record,Date.now(),globalThis.navigator?.globalPrivacyControl===true);}
export function allows(category){return typeof document!=='undefined'&&readConsent().choices[category]===true;}
export function clearAnalytics(){try{for(const key of ['optivue-prospect-context-v1','ov_fcb_sent','ov_fcb_storage_check'])sessionStorage.removeItem(key);}catch{}
 const host=location.hostname.split('.');const domains=[''];for(let i=0;i<host.length-1;i++)domains.push(host.slice(i).join('.'),'.'+host.slice(i).join('.'));
 const paths=new Set(['/']);let path='';for(const part of location.pathname.split('/').filter(Boolean)){path+='/'+part;paths.add(path);paths.add(path+'/');}
 for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of domains)for(const path of paths)document.cookie=`${name}=; Max-Age=0; Path=${path}; SameSite=Lax; Secure${domain?'; Domain='+domain:''}`;}
}
export function saveConsent(choices,override=false){const record=makeConsent(choices,Date.now(),override);const expires=new Date(record.timestamp);expires.setUTCMonth(expires.getUTCMonth()+legal.consentMonths);const raw=JSON.stringify(record);
 try{document.cookie=`${CONSENT_KEY}=${encodeURIComponent(raw)}; Expires=${expires.toUTCString()}; Path=/; SameSite=Lax; Secure`;if(!document.cookie.split('; ').some(s=>s.startsWith(CONSENT_KEY+'=')))localStorage.setItem(CONSENT_KEY,raw);else localStorage.removeItem(CONSENT_KEY);}catch{try{localStorage.setItem(CONSENT_KEY,raw);}catch{}}
 if(!record.choices.analytics)clearAnalytics();if(!record.choices.functional){try{localStorage.removeItem('optivue-theme');}catch{}document.querySelectorAll('[data-ovgo-calendly]').forEach(frame=>frame.removeAttribute('src'));}
 window.dispatchEvent(new CustomEvent('optivue:consentchange',{detail:record}));return readConsent();
}
