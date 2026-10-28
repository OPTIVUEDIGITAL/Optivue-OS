export const QUICK=[
 {key:'source',title:'Where do most of your new inquiries come from?',helper:'Choose the main source. You do not need exact channel numbers.',options:[['google','Google Ads'],['meta','Meta / Instagram'],['local','Local SEO / Google Maps'],['other','Referrals or other sources'],['unknown','Not sure']]},
 {key:'bottleneck',title:'Where do inquiries most often get stuck?',helper:'Choose the closest answer. This is an initial impression.',options:[['contact','Visitors do not contact us'],['booking','Leads do not become bookings'],['attendance','Booked patients miss appointments'],['unknown','We do not know']]},
 {key:'response',title:'How quickly does your team reply to new inquiries?',helper:'Think about a typical business day.',options:[['hour','Within an hour'],['day','Same day'],['late','Next day or later'],['unknown','Not sure']]},
 {key:'tracking',title:'Do you know which marketing sources lead to booked visits?',helper:'Reliable tracking connects the inquiry source with a confirmed appointment.',options:[['yes','Yes, with reliable tracking'],['partial','Partially'],['no','No'],['unknown','Not sure']]}
];
export const SCOPE=[
 {key:'locations',title:'How many clinic locations do you operate?',helper:'Select the closest answer.',options:[['one','One location'],['few','Two to five locations'],['many','Six or more locations'],['remote','Online / remote only']]},
 {key:'volume',title:'How many new inquiries reach your team each month?',helper:'Count calls, forms, messages, and bookings. A rough range is enough.',options:[['low','Fewer than 10'],['some','10 to 25'],['medium','26 to 50'],['high','51 to 100'],['highest','More than 100'],['unknown','Not sure']]},
 {key:'systems',title:'Which tools are in place today?',helper:'Select all that apply. You will be able to continue after choosing.',multiple:true,options:[['crm','CRM / lead pipeline'],['booking','Online scheduling'],['analytics','GA4 / conversion tracking'],['followup','Automated follow-up'],['calls','Call tracking'],['none','None of these'],['unknown','Not sure']]},
 {key:'spend',title:'What is your approximate monthly marketing spend?',helper:'Include ads and marketing services. You can skip this.',options:[['none','No current spend'],['under','Under $1,000'],['low','$1,000 to $2,499'],['medium','$2,500 to $4,999'],['high','$5,000 or more'],['skip','Prefer not to say']]},
 {key:'role',title:'What is your role in the decision?',helper:'This helps clarify how to present your next step.',options:[['owner','Owner / decision-maker'],['influence','I help decide'],['research','Researching for someone else']]}
];

export const QUESTIONS = [...QUICK,...SCOPE];
export function cleanAnswers(input={}) {
 const out={};
 for(const q of QUESTIONS){const valid=q.options.map(o=>o[0]);if(q.multiple&&Array.isArray(input[q.key])){let a=[...new Set(input[q.key].filter(v=>valid.includes(v)))];out[q.key]=a.includes('none')?['none']:a.includes('unknown')?['unknown']:a;}else if(valid.includes(input[q.key]))out[q.key]=input[q.key];}
 return out;
}
export function updateSystems(values,value,checked){if(!checked)return values.filter(v=>v!==value);if(['none','unknown'].includes(value))return [value];return [...new Set([...values.filter(v=>!['none','unknown'].includes(v)),value])];}
export function diagnose(a={}) {
 const records={
 contact:{stage:'activation',title:'Review the website-to-inquiry step.',body:'You report that visitors do not contact the clinic as often as expected. Review forms, call actions, and the next step before assuming a traffic-quality problem.',routes:['website'],focus:'website',node:1,checks:['Test mobile forms and call actions.','Compare campaign messages with the landing page.','Confirm submitted inquiries reach the CRM.']},
 booking:{stage:'activation',title:'Review your lead-to-booking handoff.',body:'Your answers suggest possible gaps between incoming inquiries, front-desk ownership, and confirmed bookings. Confirm where inquiries enter the CRM, who responds, and whether bookings link back to their marketing source.',routes:['website','frontdesk'],focus:'frontdesk',node:1,checks:['Confirm CRM lead assignment.','Compare response times with booking outcomes.','Check completed booking events against inquiry sources.']},
 attendance:{stage:'retention',title:'Review attendance and reminder handoffs.',body:'You report missed appointments. Review reminder timing, cancellations, and rescheduling. These answers do not establish why visits are missed.',routes:['frontdesk'],focus:'frontdesk',node:2,checks:['Compare booked and attended counts.','Review reminder timing with documented consent.','Test cancellation and rescheduling steps.']},
 unknown:{stage:'measurement',title:'Start by tracing a lead from source to booking.',body:'The point where inquiries stop progressing is unknown. Establish a reliable view of inquiries, replies, and bookings before choosing a corrective project.',routes:['measurement'],focus:'measurement',node:2,checks:['Trace one test inquiry from source to booking.','Confirm CRM status mapping.','Check booking events for missing or duplicate counts.']}
 };
 const base=records[a.bottleneck]||records.unknown;
 const r={...base,routes:[...base.routes],checks:[...base.checks],measurement:a.tracking!=='yes',slow:a.response==='late'};
 if(r.measurement&&!r.routes.includes('measurement'))r.routes.push('measurement');
 if(r.slow&&!r.routes.includes('frontdesk'))r.routes.push('frontdesk');
 r.signals=QUICK.slice(1).map(q=>q.options.find(o=>o[0]===a[q.key])?.[1]).filter(Boolean);
 return r;
}
export function scopeResult(a={}) {
 if(a.locations==='many'||(a.locations==='few'&&a.volume==='highest'))return {kind:'custom',title:'Custom scope required',body:'A location-by-location review is needed before estimating the full project. Agree the Audit scope first, then plan a phased implementation.',keys:[]};
 const ready=['crm','booking','analytics','followup'].every(v=>a.systems?.includes(v))&&a.tracking==='yes'&&['hour','day'].includes(a.response);
 if(ready&&['high','highest'].includes(a.volume))return {kind:'partnership',title:'Audit, then consider ongoing improvement',body:'Your self-reported systems and inquiry volume suggest a working base. Verify the data in an Audit before deciding whether a focused Fix or Growth OS Partnership fits.',keys:['diagnostic','operations']};
 if(ready&&['contact','booking','attendance'].includes(a.bottleneck))return {kind:'fix',title:'Audit, then a focused system Fix',body:'You report an existing system with a specific handoff to investigate. An Audit should validate the issue and define a bounded implementation.',keys:['diagnostic','foundation']};
 return {kind:'audit',title:'Audit to confirm scope',body:'Tracking, tool readiness, or inquiry volume needs validation. Start with an Audit before committing to a larger build. A Fix may follow if the evidence supports it.',keys:['diagnostic']};
}
