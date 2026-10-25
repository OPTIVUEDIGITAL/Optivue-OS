export type Vendor = {name:string;purpose:string;category:string;privacyUrl:string;dataLocation:string|null;cookieNames:string[]};
export const legal = {
 legalBusinessName:'Optivue Digital',operatorName:'Rahmel Dela Cruz',jurisdictionBase:'Philippines',operatorCity:'Baguio City',
 contactEmail:null as string|null,postalAddress:null as string|null,privacyContactEmail:null as string|null,
 governingLaw:null as string|null,disputeVenue:null as string|null,responseTimeframe:null as string|null,
 effectiveDate:'2026-10-25',lastUpdated:'2026-10-25',consentVersion:'1.0',consentMonths:6,
 dataRetention:{booking:null as string|null,correspondence:null as string|null,analytics:null as string|null,hostingLogs:null as string|null},
 ownerConfirmations:{vendors:null as boolean|null,calendlyNotice:null as boolean|null,noSaleOrSharing:null as boolean|null,childrenPolicy:null as boolean|null},
 bookingUrl:'https://calendly.com/optivue-digital-strategy-call/clicks-to-clients-audit',
 calendlyNotice:'Booking is handled by Calendly, which has its own privacy practices and may set cookies.',
 canonicalBase:'https://growth.optivuedigital.com',
 vendors:[
 {name:'Google Analytics 4',purpose:'Optional website measurement',category:'analytics',privacyUrl:'https://policies.google.com/privacy',dataLocation:null,cookieNames:['_ga','_ga_9XBD3QZ5BQ']},
 {name:'Calendly',purpose:'Visitor-requested scheduling',category:'functional',privacyUrl:'https://calendly.com/legal/privacy-notice',dataLocation:null,cookieNames:[]},
 {name:'Cloudflare',purpose:'Website delivery and hosting security',category:'strictly necessary',privacyUrl:'https://www.cloudflare.com/privacypolicy/',dataLocation:null,cookieNames:[]},
 ] as Vendor[],
 inventory:[
 {name:'optivue-consent',provider:'Optivue Digital',purpose:'Remember privacy choices',category:'strictly necessary',type:'cookie / localStorage fallback',party:'First-party',duration:'Six calendar months'},
 {name:'optivue-estimator-v2',provider:'Optivue Digital',purpose:'Resume a visitor-started estimate',category:'strictly necessary',type:'sessionStorage',party:'First-party',duration:'Tab session'},
 {name:'optivue-theme',provider:'Optivue Digital',purpose:'Remember a selected theme',category:'functional',type:'localStorage',party:'First-party',duration:'Until cleared or functional consent withdrawn'},
 {name:'optivue-prospect-context-v1',provider:'Optivue Digital',purpose:'Remember viewed stages and booking intent',category:'analytics',type:'sessionStorage',party:'First-party',duration:'Tab session or consent withdrawal'},
 {name:'ov_fcb_sent / temporary ov_fcb_storage_check',provider:'Optivue Digital',purpose:'Prevent duplicate booking measurements',category:'analytics',type:'sessionStorage',party:'First-party',duration:'Tab session or consent withdrawal'},
 {name:'_ga / _ga_9XBD3QZ5BQ and gtag.js',provider:'Google Analytics 4',purpose:'Website and conversion measurement after opt-in',category:'analytics',type:'cookie / script / network requests',party:'First-party cookies; third-party service',duration:'Provider/configuration dependent; owner to verify'},
 {name:'Calendly booking embed',provider:'Calendly',purpose:'Schedule a requested call',category:'functional',type:'iframe / third-party cookies and scripts',party:'Third-party',duration:'Names and duration vary; see Calendly policy'},
 {name:'Hosting request metadata',provider:'Cloudflare',purpose:'Deliver and secure the website',category:'strictly necessary',type:'server request processing',party:'Third-party processor',duration:'Unknown; owner to confirm hosting settings'},
 ]
};
