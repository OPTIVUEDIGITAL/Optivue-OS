const ESTIMATOR_FIELDS = new Set(['business_type', 'location_count', 'monthly_inquiries', 'primary_problem', 'decision_role', 'marketing_spend', 'question_id', 'question_number', 'cta', 'stage', 'scope_label', 'result']);

export function sanitizeEventParameters(name, parameters = {}) {
  const primitive = Object.entries(parameters).filter(([, value]) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
  return Object.fromEntries(name.startsWith('estimator_') ? primitive.filter(([key]) => ESTIMATOR_FIELDS.has(key)) : primitive);
}

export function trackEvent(name, parameters = {}) {
  const safe = sanitizeEventParameters(name, parameters);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...safe });
  window.dispatchEvent(new CustomEvent('optivue:analytics', { detail: { name, parameters: safe } }));
}
