import {allows} from './consent-core.js';
const ESTIMATOR_FIELDS = new Set(['business_type', 'location_count', 'monthly_inquiries', 'primary_problem', 'decision_role', 'marketing_spend', 'question_id', 'question_number', 'cta', 'stage', 'scope_label', 'result', 'founding_active']);

export function sanitizeEventParameters(name, parameters = {}) {
  if (name === 'pricing_breakdown_open') return {
    ...(typeof parameters.founding_active==='boolean'?{founding_active:parameters.founding_active}:{}),
    ...( ['diagnostic','foundation','operations','care'].includes(parameters.tier) ? {tier:parameters.tier} : {}),
    ...( ['mobile','desktop'].includes(parameters.device) ? {device:parameters.device} : {}),
  };
  const primitive = Object.entries(parameters).filter(([, value]) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
  return Object.fromEntries(name.startsWith('estimator_') ? primitive.filter(([key]) => ESTIMATOR_FIELDS.has(key)) : primitive);
}

const SECTIONS = ['overview','who-its-for','growth-map','ownership','systems','how-it-works','who-i-work-with','work','reporting','pricing','fit','about','faq','final','estimator','footer'];
const STAGES = ['acquire','convert','automate','measure','optimize'];
const BEHAVIOR_SCHEMA = {
 scroll_depth: {percent_scrolled:[25,50,75,90]},
 section_view: {section_id:SECTIONS},
 navigation_click: {section_id:SECTIONS,nav_location:['header','mobile','footer','content']},
 estimator_link_click: {section_id:SECTIONS,nav_location:['header','mobile','footer','content']},
 pricing_breakdown_open: {tier:['diagnostic','foundation','operations','care'],device:['mobile','desktop']},
 faq_open: {faq_id:['paid_audit','results','ad_spend','ownership','team_requirements','price_difference']},
 growth_map_interaction: {action:['details','overview','pause','resume','replay']},
 theme_change: {theme:['light','dark']},
 mobile_menu_toggle: {action:['open','close']},
 system_stage_select: {stage:STAGES},
 reporting_compare: {input_method:['pointer','keyboard']},
 booking_modal_close: {action:['escape','button','backdrop']},
 calendly_step_view: {step:['event_type','date_time','scheduled']},
 estimator_view: {},estimator_resume: {},estimator_restart: {},
 estimator_back: {question_number:[1,2,3,4,5,6,7,8,9,10]},
 estimator_question_answered: {question_number:[1,2,3,4,5,6,7,8,9,10]},
 estimator_stage_expand: {stage:STAGES},
 estimator_cta_click: {cta:['copy_snapshot','not_now','fit_call']},
};
export function sanitizeBehaviorParameters(name, parameters = {}) {
 const schema=BEHAVIOR_SCHEMA[name]; if(!schema)return null;
 const safe={}; for(const [key,values] of Object.entries(schema)) {
   if(!values.includes(parameters[key]))return null;
   safe[key]=parameters[key];
 } return safe;
}
const GA4_EVENTS = new Set(['book_fit_call_click', 'request_audit_click', 'estimator_start', 'estimator_complete']);
const CTA_LOCATIONS = new Set(['nav', 'hero', 'pricing', 'final', 'footer', 'sticky', 'estimator', 'unknown']);

export function trackEvent(name, parameters = {}) {
  if(!allows('analytics'))return;
  // Retain existing local UI hooks. These objects are not Google gtag calls.
  const behavior = sanitizeBehaviorParameters(name, parameters);
  const safe = behavior ?? sanitizeEventParameters(name, /^(pricing_|estimator_)/.test(name) ? { ...parameters, founding_active: false } : parameters);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...safe });
  window.dispatchEvent(new CustomEvent('optivue:analytics', { detail: { name, parameters: safe } }));
  if (window.location.hostname !== 'growth.optivuedigital.com' || (!GA4_EVENTS.has(name) && !behavior) || typeof window.gtag !== 'function') return;
  if (behavior) { window.gtag('event', name, behavior); return; }
  // Only a controlled section enum leaves the site. Never spread form data.
  if (name === 'book_fit_call_click' || name === 'request_audit_click') {
    const cta_location = CTA_LOCATIONS.has(parameters.cta_location) ? parameters.cta_location : 'unknown';
    window.gtag('event', name, { cta_location });
  } else window.gtag('event', name);
}
