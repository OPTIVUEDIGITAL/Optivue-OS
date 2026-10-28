export type Vendor = {name:string;purpose:string;category:string;privacyUrl:string;dataLocation:string|null;cookieNames:string[]};
export const legal = {
 legalBusinessName:'Optivue Digital Marketing Services',businessNameNumber:'7136794',psic:'82212 — Digital Marketing Services',operatorName:'Rahmel Dela Cruz',jurisdictionBase:'Philippines',operatorCity:'Baguio City',
 contactEmail:'rahmel@optivuedigital.com',contactPhone:'+63 997 108 9661',postalAddress:'Baguio City, Philippines',privacyContactEmail:'rahmel@optivuedigital.com',
 governingLaw:'Laws of the Republic of the Philippines, subject to mandatory protections that apply to you',disputeVenue:'Courts or dispute-resolution bodies with jurisdiction under applicable law',responseTimeframe:'Within the period required by applicable law, after any proportionate identity verification. We will explain any permitted extension or refusal',
 effectiveDate:'2026-10-27',lastUpdated:'2026-10-27',consentVersion:'1.1',consentMonths:6,
 dataRetention:{booking:'For arranging and following up on the requested call, and for any resulting engagement or applicable recordkeeping obligation',correspondence:'For handling the request and related business relationship, resolving disputes, and meeting applicable recordkeeping obligations',analytics:'Browser identifiers expire after 180 days without automatic renewal. Data already collected is retained separately under the GA4 property settings and Google policies; clearing cookies does not delete those records',hostingLogs:'Provider-managed delivery and security records follow the hosting providers’ retention rules, including any security or legal exceptions'},
 bookingUrl:'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit',
 calendlyNotice:'Booking is handled by Calendly, which has its own privacy practices and may set cookies.',
 canonicalBase:'https://growth.optivuedigital.com',
 vendors:[
 {name:'OpenAI / ChatGPT Sites',purpose:'Private preview hosting, authentication and access control',category:'strictly necessary',privacyUrl:'https://openai.com/policies/privacy-policy/',dataLocation:'International processing; see provider privacy notice',cookieNames:[]},
 {name:'Google Analytics 4',purpose:'Optional website measurement',category:'analytics',privacyUrl:'https://policies.google.com/privacy',dataLocation:'International processing; see provider privacy notice',cookieNames:['_ga','_ga_9XBD3QZ5BQ']},
 {name:'Calendly',purpose:'Visitor-requested scheduling',category:'functional',privacyUrl:'https://calendly.com/legal/privacy-notice',dataLocation:'International processing; see provider privacy notice',cookieNames:[]},
 {name:'Cloudflare',purpose:'Website delivery and hosting security',category:'strictly necessary',privacyUrl:'https://www.cloudflare.com/privacypolicy/',dataLocation:'International processing; see provider privacy notice',cookieNames:[]},
 ] as Vendor[],
 inventory:[
 {name:'optivue-consent',provider:'Optivue Digital',purpose:'Remember privacy choices',category:'strictly necessary',type:'cookie / localStorage fallback',party:'First-party',duration:'Six calendar months'},
 {name:'optivue-estimator-v2',provider:'Optivue Digital',purpose:'Resume a visitor-started estimate',category:'strictly necessary',type:'sessionStorage',party:'First-party',duration:'Tab session'},
 {name:'optivue-theme',provider:'Optivue Digital',purpose:'Remember a selected theme',category:'functional',type:'localStorage',party:'First-party',duration:'Until cleared or functional consent withdrawn'},
 {name:'optivue-prospect-context-v1',provider:'Optivue Digital',purpose:'Remember viewed stages and booking intent',category:'analytics',type:'sessionStorage',party:'First-party',duration:'Tab session or consent withdrawal'},
 {name:'ov_fcb_sent / temporary ov_fcb_storage_check',provider:'Optivue Digital',purpose:'Prevent duplicate booking measurements',category:'analytics',type:'sessionStorage',party:'First-party',duration:'Tab session or consent withdrawal'},
 {name:'_ga / _ga_9XBD3QZ5BQ and gtag.js',provider:'Google Analytics 4',purpose:'Website and conversion measurement after opt-in',category:'analytics',type:'cookie / script / network requests',party:'First-party cookies; third-party service',duration:'180 days from creation on this site, without automatic renewal; earlier removal on withdrawal'},
 {name:'Calendly booking embed',provider:'Calendly',purpose:'Schedule a requested call',category:'functional',type:'iframe / third-party cookies and scripts',party:'Third-party',duration:'Names and duration vary; see Calendly policy'},
 {name:'Hosting and sign-in metadata',provider:'ChatGPT Sites / Cloudflare',purpose:'Deliver and secure the website',category:'strictly necessary',type:'server request processing',party:'Third-party processor',duration:'Provider-managed retention for delivery, security and legal needs'},
 ]
};
