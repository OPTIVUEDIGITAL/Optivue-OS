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

const GA4_EVENTS = new Set(['book_fit_call_click', 'request_audit_click', 'estimator_start', 'estimator_complete', 'fit_call_booked']);

export function trackEvent(name) {
  if (window.location.hostname !== 'growth.optivuedigital.com' || !GA4_EVENTS.has(name) || typeof window.gtag !== 'function') return;
  // Send event names only. Never forward form values or Calendly payloads.
  window.gtag('event', name);
}
