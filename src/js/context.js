const STORAGE_KEY = 'optivue-prospect-context-v1';

const DEFAULT_CONTEXT = {
  version: '1.0',
  source: 'optivue-growth-os',
  submittedAt: '',
  identity: {
    name: '',
    email: '',
    company: '',
    website: '',
  },
  business: {
    industry: '',
    primaryOffer: '',
    serviceArea: '',
    goal: '',
    challenge: '',
  },
  journey: {
    workItemsViewed: [],
    transformationsViewed: [],
    systemStagesViewed: [],
    pricingPlansViewed: [],
    proposalIntent: false,
    bookingIntent: false,
  },
  consent: {
    contactConsent: false,
    marketingContact: false,
    submitted: false,
    timestamp: '',
  },
};

let state = createInitialState();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(target, source) {
  if (!source || typeof source !== 'object') return target;
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target[key] = [...value];
    } else if (value && typeof value === 'object') {
      target[key] = mergeDeep(target[key] && typeof target[key] === 'object' ? target[key] : {}, value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

function createInitialState() {
  const next = clone(DEFAULT_CONTEXT);
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      mergeDeep(next, parsed);
    }
  } catch {}
  return next;
}

function persistAnonymous() {
  try {
    const safe = {
      version: state.version,
      source: state.source,
      business: state.business,
      journey: state.journey,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {}
}

function notify() {
  window.dispatchEvent(new CustomEvent('ovgo:contextchange', { detail: snapshot() }));
}

export function snapshot() {
  return clone(state);
}

export function updateSection(section, values, { persist = true } = {}) {
  state[section] = mergeDeep(state[section] || {}, values || {});
  if (persist && section !== 'identity' && section !== 'consent') persistAnonymous();
  notify();
  return snapshot();
}

export function setIdentity(values) {
  state.identity = mergeDeep(state.identity, values || {});
  notify();
  return snapshot();
}

export function setConsent(values) {
  state.consent = mergeDeep(state.consent, values || {});
  notify();
  return snapshot();
}

export function addJourneyValue(key, value) {
  if (!value) return snapshot();
  const current = Array.isArray(state.journey[key]) ? state.journey[key] : [];
  if (!current.includes(value)) current.push(value);
  state.journey[key] = current;
  persistAnonymous();
  notify();
  return snapshot();
}

export function setJourneyFlag(key, value = true) {
  state.journey[key] = Boolean(value);
  persistAnonymous();
  notify();
  return snapshot();
}

export function buildLeadPayload() {
  const payload = snapshot();
  payload.submittedAt = new Date().toISOString();
  payload.consent.submitted = true;
  payload.consent.timestamp = payload.consent.timestamp || payload.submittedAt;
  return payload;
}

export function clearIdentity() {
  state.identity = clone(DEFAULT_CONTEXT.identity);
  state.consent = clone(DEFAULT_CONTEXT.consent);
  notify();
}
