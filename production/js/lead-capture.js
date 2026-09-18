import { RUNTIME_CONFIG } from './runtime-config.js';
import { buildLeadPayload, setConsent, setIdentity, snapshot } from './context.js';

export function initLeadCapture(root) {
  const mount = root.querySelector('[data-ovgo-lead-capture]');
  if (!mount) return;

  render();

  window.addEventListener('ovgo:contextchange', () => updateContextSummary());

  function render() {
    const context = snapshot();
    mount.innerHTML = `
      <div class="ovgo-lead-grid">
        <div class="ovgo-lead-copy">
          <p class="ovgo-kicker">Save your growth context</p>
          <h3>Turn your diagnosis and estimate into a conversation.</h3>
          <p>Your Growth OS activity can be packaged into one prospect brief, so you do not need to repeat the same information on a discovery call.</p>
          <div class="ovgo-context-summary" data-lead-context-summary></div>
        </div>
        <form class="ovgo-lead-form" data-lead-form>
          <div class="ovgo-form-row">
            <label for="lead-name">Your name</label>
            <input id="lead-name" name="name" autocomplete="name" required value="${escapeLeadAttr(context.identity.name)}">
          </div>
          <div class="ovgo-form-row">
            <label for="lead-email">Email</label>
            <input id="lead-email" name="email" type="email" autocomplete="email" required value="${escapeLeadAttr(context.identity.email)}">
          </div>
          <div class="ovgo-form-row">
            <label for="lead-company">Company</label>
            <input id="lead-company" name="company" autocomplete="organization" value="${escapeLeadAttr(context.identity.company || context.business.company || '')}">
          </div>
          <div class="ovgo-form-row">
            <label for="lead-website">Website</label>
            <input id="lead-website" name="website" type="url" autocomplete="url" placeholder="https://" value="${escapeLeadAttr(context.identity.website || context.business.website || '')}">
          </div>
          <label class="ovgo-consent">
            <input type="checkbox" name="contactConsent" required>
            <span>I agree to send this Growth OS context to Optivue Digital so I can be contacted about this request.</span>
          </label>
          <label class="ovgo-consent ovgo-consent--optional">
            <input type="checkbox" name="marketingContact">
            <span>Optivue may also send me relevant growth insights or follow-up information.</span>
          </label>
          <div class="ovgo-lead-actions">
            <button class="ovgo-btn ovgo-btn--primary" type="submit" data-lead-submit>
              ${RUNTIME_CONFIG.leadSubmissionEnabled ? 'Save My Growth Brief' : 'Continue With My Context'}
            </button>
            <button class="ovgo-btn ovgo-btn--secondary" type="button" data-lead-book>
              Book A Discovery Call
            </button>
          </div>
          <p class="ovgo-form-note" data-lead-status>
            ${RUNTIME_CONFIG.leadSubmissionEnabled
              ? 'Your submitted context will be sent securely to Optivue Digital.'
              : 'The live intake connection is being prepared. Your contact details remain in this browser session unless you continue to Calendly.'}
          </p>
        </form>
      </div>
    `;

    mount.querySelector('[data-lead-form]')?.addEventListener('submit', submit);
    mount.querySelector('[data-lead-book]')?.addEventListener('click', () => {
      captureForm();
      root.querySelector('[data-ovgo-booking]')?.click();
    });
    updateContextSummary();
  }

  function captureForm() {
    const form = mount.querySelector('[data-lead-form]');
    if (!form) return null;
    const data = new FormData(form);
    setIdentity({
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      website: String(data.get('website') || '').trim(),
    });
    setConsent({
      contactConsent: data.get('contactConsent') === 'on',
      marketingContact: data.get('marketingContact') === 'on',
      timestamp: new Date().toISOString(),
    });
    return form;
  }

  async function submit(event) {
    event.preventDefault();
    const form = captureForm();
    if (!form || !form.reportValidity()) return;

    const status = mount.querySelector('[data-lead-status]');
    const button = mount.querySelector('[data-lead-submit]');
    const payload = buildLeadPayload();

    if (!RUNTIME_CONFIG.leadSubmissionEnabled || !RUNTIME_CONFIG.leadEndpoint) {
      status.textContent = 'Your Growth OS context is ready for the discovery call. The direct intake connection is not active yet, so no data was sent from this form.';
      root.querySelector('[data-ovgo-booking]')?.focus();
      return;
    }

    button.disabled = true;
    status.textContent = 'Saving your Growth OS brief…';

    try {
      const response = await fetch(RUNTIME_CONFIG.leadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Submission failed (${response.status})`);
      setConsent({ submitted: true, timestamp: new Date().toISOString() });
      status.textContent = 'Your Growth OS brief was saved. You can continue to a discovery call without starting over.';
    } catch (error) {
      status.textContent = 'We could not save the brief right now. Your answers are still available in this browser session; you can continue to Calendly or try again.';
    } finally {
      button.disabled = false;
    }
  }

  function updateContextSummary() {
    const target = mount.querySelector('[data-lead-context-summary]');
    if (!target) return;
    const context = snapshot();
    const items = [
      context.diagnosis.primaryBottleneck ? ['Diagnosis', context.diagnosis.primaryBottleneck] : null,
      context.estimator.recommendedPlan ? ['Likely engagement', context.estimator.recommendedPlan] : null,
      context.estimator.startingInvestment ? ['Starting investment', context.estimator.startingInvestment] : null,
      context.journey.transformationsViewed.length ? ['Transformations viewed', context.journey.transformationsViewed.join(', ')] : null,
    ].filter(Boolean);

    target.innerHTML = items.length
      ? items.map(([label, value]) => `<div><span>${label}</span><strong>${escapeLeadHtml(value)}</strong></div>`).join('')
      : '<p>Complete the diagnosis or estimator and your context will appear here.</p>';
  }
}

function escapeLeadAttr(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeLeadHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
