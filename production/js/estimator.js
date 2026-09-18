import { updateSection } from './context.js';

const PLANS = {
  starter: { name:'Growth Starter', price:'$2,500 / month', note:'3-month minimum' },
  accelerator: { name:'Growth Accelerator', price:'$4,500 / month', note:'6-month minimum' },
  lab: { name:'Growth Lab', price:'From $6,500 / month', note:'Scope based' },
};

export function initEstimator(root) {
  const mount = root.querySelector('[data-ovgo-estimator]');
  if (!mount) return;

  mount.innerHTML = `<div class="ovgo-tool-grid"><form class="ovgo-tool-main" data-estimator-form>
    <div class="ovgo-form-row"><label for="est-need">Primary Need</label><select id="est-need" name="need"><option>Acquisition System</option><option>Landing Page / CRO</option><option>CRM & Automation</option><option>SEO / Local Search</option><option>Analytics & Tracking</option><option>Website / Digital Infrastructure</option><option>Complete Growth System</option></select></div>
    <div class="ovgo-form-row"><label for="est-complexity">Business Complexity</label><select id="est-complexity" name="complexity"><option value="small">Solo / Small Team</option><option value="growing">Growing SMB</option><option value="complex">Multi-location / Complex Operation</option></select></div>
    <div class="ovgo-form-row"><label>Channels</label>${choices('channels',['Google Ads','Meta Ads','SEO','Google Business Profile','Email','SMS','Content'])}</div>
    <div class="ovgo-form-row"><label>Infrastructure</label>${choices('infra',['Landing Pages','CRM Setup','Lead Routing','Pipeline','Automation','GA4','GTM','Dashboard','Integrations'])}</div>
    <div class="ovgo-form-row"><label for="est-urgency">Urgency</label><select id="est-urgency" name="urgency"><option>Standard</option><option>Priority</option><option>Accelerated</option></select></div>
    <div class="ovgo-form-row"><label for="est-support">Support Model</label><select id="est-support" name="support"><option>One-time implementation</option><option>Monthly optimization</option><option>Growth partnership</option></select></div>
  </form><aside class="ovgo-tool-summary" data-estimator-summary></aside></div>`;

  const form = mount.querySelector('[data-estimator-form]');
  const summary = mount.querySelector('[data-estimator-summary]');
  form.addEventListener('change', update);
  update();

  function update() {
    const data = new FormData(form);
    const channels = data.getAll('channels');
    const infra = data.getAll('infra');
    const complexity = data.get('complexity');
    const need = data.get('need');
    const urgency = data.get('urgency');
    const support = data.get('support');

    let plan = 'starter';
    const advancedInfra = infra.includes('Integrations') || infra.length >= 5;
    if (complexity === 'complex' || (need === 'Complete Growth System' && advancedInfra) || channels.length >= 5) plan = 'lab';
    else if (complexity === 'growing' || infra.length >= 3 || channels.length >= 3 || support === 'Growth partnership') plan = 'accelerator';

    const selected = PLANS[plan];
    const duration = plan === 'starter' ? 'Approximately 8–12 weeks for the initial build' : plan === 'accelerator' ? '6-month growth partnership' : 'Defined after technical scoping';
    const complexityLabel = plan === 'starter' ? 'Focused' : plan === 'accelerator' ? 'Multi-system' : 'Complex / custom';

    updateSection('estimator', {
      primaryNeed: need,
      complexity,
      channels,
      infrastructure: infra,
      urgency,
      supportModel: support,
      recommendedPlan: selected.name,
      startingInvestment: selected.price,
    });

    summary.innerHTML = `<p class="ovgo-kicker">ESTIMATED SCOPE</p><h3>${selected.name}</h3><div class="ovgo-result-status"><div><span>Complexity</span><b>${complexityLabel}</b></div><div><span>Likely duration</span><b>${duration}</b></div><div><span>Urgency</span><b>${urgency}</b></div><div><span>Support</span><b>${support}</b></div></div><p class="ovgo-kicker">STARTING INVESTMENT</p><div class="ovgo-price"><strong>${selected.price}</strong></div><p class="ovgo-commitment">${selected.note}</p><p>This is a planning recommendation, not a guaranteed quote. Final scope depends on the existing stack, integrations, data quality, and implementation requirements.</p><button class="ovgo-btn ovgo-btn--primary" type="button" data-est-booking>Book A Discovery Call</button>`;
    summary.querySelector('[data-est-booking]')?.addEventListener('click', () => root.querySelector('[data-ovgo-booking]')?.click());
  }
}

function choices(name, values) {
  return `<div class="ovgo-choice-grid">${values.map((value) => `<label class="ovgo-choice"><input type="checkbox" name="${name}" value="${value}"><span>${value}</span></label>`).join('')}</div>`;
}
