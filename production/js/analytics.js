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

const GA4_EVENTS = new Set(['book_fit_call_click', 'request_audit_click', 'estimator_start', 'estimator_complete']);
const CTA_LOCATIONS = new Set(['nav', 'hero', 'pricing', 'final', 'footer', 'sticky', 'estimator', 'unknown']);

export function trackEvent(name, parameters = {}) {
  // Retain existing local UI hooks. These objects are not Google gtag calls.
  const safe = sanitizeEventParameters(name, /^(pricing_|estimator_)/.test(name) ? { ...parameters, founding_active: false } : parameters);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...safe });
  window.dispatchEvent(new CustomEvent('optivue:analytics', { detail: { name, parameters: safe } }));
  if (window.location.hostname !== 'growth.optivuedigital.com' || !GA4_EVENTS.has(name) || typeof window.gtag !== 'function') return;
  // Only a controlled section enum leaves the site. Never spread form data.
  if (name === 'book_fit_call_click' || name === 'request_audit_click') {
    const cta_location = CTA_LOCATIONS.has(parameters.cta_location) ? parameters.cta_location : 'unknown';
    window.gtag('event', name, { cta_location });
  } else window.gtag('event', name);
}
