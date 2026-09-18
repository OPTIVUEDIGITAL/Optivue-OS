const STEPS = [
  { id: 'business', label: 'Business' },
  { id: 'goals', label: 'Goals' },
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'systems', label: 'Systems' },
];

const CHANNELS = ['Google Ads','Meta Ads','SEO','Google Business Profile','Organic Social','Email','Referrals'];
const SYSTEMS = ['CRM','Email Automation','SMS Automation','GA4 / Analytics','GTM / Conversion Tracking','Reporting Dashboard'];

export function initDiagnosis(root) {
  const mount = root.querySelector('[data-ovgo-diagnosis]');
  const progress = root.querySelector('[data-diagnosis-progress]');
  if (!mount) return;

  const state = { step: 0, answers: { channels: [], systems: [] } };

  function field(name, label, type = 'text', placeholder = '') {
    return `<div class="ovgo-form-row"><label for="diag-${name}">${label}</label><input id="diag-${name}" name="${name}" type="${type}" placeholder="${placeholder}" value="${escapeAttr(state.answers[name] || '')}"></div>`;
  }

  function checks(name, values, selected = []) {
    return `<div class="ovgo-choice-grid">${values.map((value) => `
      <label class="ovgo-choice"><input type="checkbox" name="${name}" value="${value}" ${selected.includes(value) ? 'checked' : ''}><span>${value}</span></label>`).join('')}</div>`;
  }

  function radios(name, values, selected) {
    return `<div class="ovgo-choice-grid">${values.map(([value,label]) => `
      <label class="ovgo-choice"><input type="radio" name="${name}" value="${value}" ${selected === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div>`;
  }

  function render() {
    if (state.step >= STEPS.length) return renderResults();
    const step = STEPS[state.step];
    progress && (progress.textContent = `STEP ${state.step + 1} OF ${STEPS.length}`);

    let body = '';
    if (step.id === 'business') {
      body = field('businessName','Business Name') + field('website','Website','url','https://') + field('industry','Industry') + field('offer','Primary Offer');
    }
    if (step.id === 'goals') {
      body = `<div class="ovgo-form-row"><label for="diag-goal">Main Goal</label><select id="diag-goal" name="goal">
        <option value="">Select one</option>${['Generate more qualified leads','Improve conversion','Improve follow-up','Improve visibility and SEO','Improve reporting and attribution'].map((value) => `<option ${state.answers.goal === value ? 'selected' : ''}>${value}</option>`).join('')}
      </select></div>` + field('challenge','Biggest Growth Challenge');
    }
    if (step.id === 'acquisition') {
      body = `<div class="ovgo-form-row"><label>Channels currently in use</label>${checks('channels', CHANNELS, state.answers.channels)}</div>`;
    }
    if (step.id === 'conversion') {
      body = `<div class="ovgo-form-row"><label>Do you have a dedicated landing or conversion path?</label>${radios('landing',[['yes','Yes'],['partial','Partially'],['no','No']],state.answers.landing)}</div>
      <div class="ovgo-form-row"><label>Is lead qualification defined?</label>${radios('qualification',[['yes','Yes'],['partial','Partially'],['no','No']],state.answers.qualification)}</div>
      <div class="ovgo-form-row"><label>How consistent is sales follow-up?</label>${radios('followup',[['strong','Consistent and structured'],['manual','Mostly manual'],['weak','Inconsistent']],state.answers.followup)}</div>`;
    }
    if (step.id === 'systems') {
      body = `<div class="ovgo-form-row"><label>Systems currently in place</label>${checks('systems', SYSTEMS, state.answers.systems)}</div>`;
    }

    mount.innerHTML = `<div class="ovgo-tool-grid"><div class="ovgo-tool-main"><p class="ovgo-kicker">[ ${step.label.toUpperCase()} ]</p><h3>${stepTitle(step.id)}</h3><form data-diag-form>${body}<div class="ovgo-tool-nav">${state.step ? '<button class="ovgo-btn ovgo-btn--secondary" type="button" data-diag-back>Back</button>' : '<span></span>'}<button class="ovgo-btn ovgo-btn--primary" type="submit">${state.step === STEPS.length - 1 ? 'See My Diagnosis' : 'Continue'}</button></div></form></div><aside class="ovgo-tool-summary"><p class="ovgo-kicker">WHY THIS MATTERS</p><p>${stepHelp(step.id)}</p></aside></div>`;

    mount.querySelector('[data-diag-back]')?.addEventListener('click', () => { capture(); state.step--; render(); });
    mount.querySelector('[data-diag-form]')?.addEventListener('submit', (event) => { event.preventDefault(); capture(); state.step++; render(); });
  }

  function capture() {
    const form = mount.querySelector('form');
    if (!form) return;
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (key === 'channels' || key === 'systems') continue;
      state.answers[key] = value;
    }
    if (form.querySelector('input[name="channels"]')) {
      state.answers.channels = [...form.querySelectorAll('input[name="channels"]:checked')].map((el) => el.value);
    }
    if (form.querySelector('input[name="systems"]')) {
      state.answers.systems = [...form.querySelectorAll('input[name="systems"]:checked')].map((el) => el.value);
    }
  }

  function renderResults() {
    progress && (progress.textContent = 'DIAGNOSIS COMPLETE');
    const statuses = score(state.answers);
    const bottleneck = primaryBottleneck(statuses, state.answers);
    mount.innerHTML = `<div class="ovgo-tool-grid"><div class="ovgo-tool-main"><p class="ovgo-kicker">[ DIAGNOSIS RESULT ]</p><h3>${bottleneck.title}</h3><p>${bottleneck.why}</p><div class="ovgo-result-status">${Object.entries(statuses).map(([key,value]) => `<div><span>${key}</span><b>${value}</b></div>`).join('')}</div><h4>Recommended next action</h4><p>${bottleneck.action}</p><div class="ovgo-actions ovgo-actions--inline"><button class="ovgo-btn ovgo-btn--primary" type="button" data-ovgo-booking-result>Book A Discovery Call</button><button class="ovgo-btn ovgo-btn--secondary" type="button" data-diag-restart>Run Again</button></div></div><aside class="ovgo-tool-summary"><p class="ovgo-kicker">INTERPRETATION</p><p>This is a directional diagnosis based on the systems you reported. It is not a financial forecast or automated audit of your accounts.</p></aside></div>`;
    mount.querySelector('[data-diag-restart]')?.addEventListener('click', () => { state.step = 0; render(); });
    mount.querySelector('[data-ovgo-booking-result]')?.addEventListener('click', () => root.querySelector('[data-ovgo-booking]')?.click());
  }

  render();
}

function score(a) {
  const has = (name) => a.systems?.includes(name);
  return {
    Acquisition: a.channels?.length >= 2 ? 'Strong' : a.channels?.length ? 'Needs Attention' : 'High Priority',
    Conversion: a.landing === 'yes' && a.qualification === 'yes' ? 'Strong' : a.landing || a.qualification ? 'Needs Attention' : 'High Priority',
    Automation: has('CRM') && (has('Email Automation') || has('SMS Automation')) ? 'Strong' : has('CRM') ? 'Needs Attention' : 'High Priority',
    Tracking: has('GA4 / Analytics') && has('GTM / Conversion Tracking') ? 'Strong' : has('GA4 / Analytics') || has('GTM / Conversion Tracking') ? 'Needs Attention' : 'High Priority',
    SEO: a.channels?.includes('SEO') || a.channels?.includes('Google Business Profile') ? 'Strong' : 'Needs Attention',
    'Digital Infrastructure': a.systems?.length >= 4 ? 'Strong' : a.systems?.length >= 2 ? 'Needs Attention' : 'High Priority',
  };
}

function primaryBottleneck(statuses, a) {
  if (a.followup === 'weak' || statuses.Automation === 'High Priority') return {title:'Lead follow-up and CRM infrastructure need attention first.',why:'Traffic creates opportunity only when leads enter a consistent qualification, routing, and follow-up process.',action:'Connect lead capture, CRM routing, follow-up automation, and pipeline stages before increasing acquisition complexity.'};
  if (statuses.Tracking === 'High Priority') return {title:'Measurement is limiting your ability to optimize.',why:'Without reliable conversion tracking, it is difficult to know which channels and actions create qualified opportunities.',action:'Define the key conversion events and connect analytics, tag management, and CRM outcomes before scaling spend.'};
  if (statuses.Conversion === 'High Priority') return {title:'The conversion path is the primary bottleneck.',why:'Acquisition cannot perform efficiently when visitors do not have a clear path to become qualified leads.',action:'Build or simplify the landing, qualification, booking, and follow-up journey before adding more traffic.'};
  if (statuses.Acquisition === 'High Priority') return {title:'Your acquisition engine needs a clearer demand strategy.',why:'The current channel mix does not yet provide a consistent path for bringing qualified prospects into the system.',action:'Choose the highest-intent acquisition channels and connect them to a measurable conversion path.'};
  return {title:'Your foundation is in place. The next opportunity is optimization.',why:'The reported systems cover the core journey, so improvement should focus on friction, attribution, and performance across the connected funnel.',action:'Review conversion data, pipeline quality, and channel efficiency to identify the next highest-leverage improvement.'};
}

function stepTitle(id) {
  return ({business:'Start with the business.',goals:'Define what success needs to look like.',acquisition:'Where does demand come from today?',conversion:'What happens after someone clicks?',systems:'What infrastructure supports the journey?'})[id];
}
function stepHelp(id) {
  return ({business:'The diagnosis needs the offer and business context before judging the marketing system.',goals:'A system should be evaluated against the business outcome it is meant to create.',acquisition:'Channel count matters less than whether the right demand is entering a measurable journey.',conversion:'Landing, qualification, and follow-up determine whether traffic becomes a real opportunity.',systems:'CRM, automation, and tracking determine whether the journey can be managed and improved consistently.'})[id];
}
function escapeAttr(value) { return String(value).replace(/"/g,'&quot;'); }
