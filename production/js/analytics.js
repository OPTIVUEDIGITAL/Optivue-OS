import { foundingActive } from './founding-program.js';
const ESTIMATOR_FIELDS = new Set(['business_type', 'location_count', 'monthly_inquiries', 'primary_problem', 'decision_role', 'marketing_spend', 'question_id', 'question_number', 'cta', 'stage', 'scope_label', 'result', 'founding_active']);

export function sanitizeEventParameters(name, parameters = {}) {
  if (name.startsWith('founding_')) return {founding_active:foundingActive(), ...(name==='founding_terms_toggle' && ['open','closed'].includes(parameters.state)?{state:parameters.state}:{})};
  if (name === 'pricing_breakdown_open') return {
    ...(typeof parameters.founding_active==='boolean'?{founding_active:parameters.founding_active}:{}),
    ...( ['diagnostic','foundation','operations','care'].includes(parameters.tier) ? {tier:parameters.tier} : {}),
    ...( ['mobile','desktop'].includes(parameters.device) ? {device:parameters.device} : {}),
  };
  const primitive = Object.entries(parameters).filter(([, value]) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
  return Object.fromEntries(name.startsWith('estimator_') ? primitive.filter(([key]) => ESTIMATOR_FIELDS.has(key)) : primitive);
}

export function trackEvent(name, parameters = {}) {
  const safe = sanitizeEventParameters(name, /^(pricing_|estimator_|founding_)/.test(name)?{...parameters,founding_active:foundingActive()}:parameters);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...safe });
  window.dispatchEvent(new CustomEvent('optivue:analytics', { detail: { name, parameters: safe } }));
}
