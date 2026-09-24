import { trackEvent } from './analytics.js';
import { ESTIMATOR_CONFIG, RESULT_COPY } from './estimator-config.js';

const STORAGE_KEY = 'optivue-estimator-v2';
const STATE_VERSION = 2;

export function getEstimatorResult(answers = {}) {
  const flags = deriveFlags(answers);
  let id = 'A';
  let scopeLabel = flags.has_crm && flags.has_tracking ? 'Standard Growth Scope' : 'Foundation Scope';
  if (answers.business_type === 'ecommerce' || (['none', 'under_1000'].includes(answers.marketing_spend) && answers.monthly_inquiries === 'under_10' && answers.decision_role === 'researcher')) {
    id = 'E'; scopeLabel = 'Not Currently a Fit';
  } else if (answers.location_count === 'six_plus' || (answers.location_count === 'two_five' && answers.marketing_spend === '10000_plus') || (answers.location_count === 'two_five' && answers.primary_problem === 'launching')) {
    id = 'A'; scopeLabel = 'Custom Scope';
  } else if (flags.unsure_count >= 3) {
    id = 'A'; scopeLabel = 'Foundation Scope';
  } else if (answers.follow_up_process === 'depends' || answers.response_speed === 'next_day' || (answers.follow_up_process === 'not_sure' && answers.response_speed === 'not_sure')) {
    id = 'D'; scopeLabel = 'Readiness Review';
  } else {
    const foundationSignals = [!flags.has_crm, !flags.has_booking, !flags.has_tracking, !flags.has_auto_followup, answers.follow_up_process === 'manual', ['cant_tell', 'dont_connect', 'launching'].includes(answers.primary_problem)].filter(Boolean).length;
    if (foundationSignals >= 2) {
      id = 'B'; scopeLabel = 'Foundation Scope';
    } else if (flags.has_crm && (flags.has_booking || flags.has_tracking) && ['within_hour', 'same_day'].includes(answers.response_speed) && ['26_50', '51_100', 'over_100'].includes(answers.monthly_inquiries) && ['2500_4999', '5000_9999', '10000_plus'].includes(answers.marketing_spend) && ['more_inquiries', 'not_enough_book', 'no_show', 'ongoing'].includes(answers.primary_problem)) {
      id = 'C';
      scopeLabel = answers.location_count === 'two_five' || ['5000_9999', '10000_plus'].includes(answers.marketing_spend) ? 'Advanced Growth Scope' : 'Standard Growth Scope';
    }
  }
  const copy = RESULT_COPY[id];
  const body = scopeLabel === 'Custom Scope' ? `${copy.body} With multiple locations or a larger setup, a Diagnostic comes before any estimate.` : copy.body;
  return { id, scopeLabel, ...copy, body, flags, action: id === 'E' ? null : { type: 'calendly', label: 'Book a 20-Minute Fit Call' }, homeLink: id === 'E' ? { label: 'Back to Optivue Growth OS', href: '/' } : null, path: buildPath(copy.nextStage) };
}

export function getStageSnapshot(answers = {}, result = getEstimatorResult(answers)) {
  const flags = result.flags || deriveFlags(answers);
  const acquire = answers.primary_problem === 'more_inquiries' || answers.monthly_inquiries === 'under_10' ? 'Likely gap' : answers.monthly_inquiries === 'not_sure' ? 'Unknown' : answers.monthly_inquiries === '10_25' && !flags.runs_ads ? 'Worth reviewing' : 'Looks solid';
  const convert = ['not_enough_book', 'no_show'].includes(answers.primary_problem) ? 'Likely gap' : !flags.has_booking ? 'Worth reviewing' : 'Looks solid';
  let automate = 'Worth reviewing';
  if (answers.follow_up_process === 'depends' || answers.response_speed === 'next_day') automate = 'Likely gap';
  else if (answers.follow_up_process === 'not_sure' && answers.response_speed === 'not_sure') automate = 'Unknown';
  else if (flags.has_crm && flags.has_auto_followup && answers.response_speed === 'within_hour') automate = 'Looks solid';
  let measure = 'Looks solid';
  if (answers.current_systems?.includes('not_sure') && !flags.has_tracking) measure = 'Unknown';
  else if (!flags.has_tracking || answers.primary_problem === 'cant_tell') measure = 'Likely gap';
  else if (!flags.has_call_tracking) measure = 'Worth reviewing';
  const optimize = ['Likely gap', 'Unknown'].includes(measure) ? 'Comes after Measure' : result.id === 'C' ? 'Ready' : 'Worth reviewing';
  return Object.fromEntries([['acquire', acquire], ['convert', convert], ['automate', automate], ['measure', measure], ['optimize', optimize]].map(([key, status]) => [key, presentStage(key, status)]));
}

export function getQuickWins(snapshot = {}) {
  return ['automate', 'measure', 'convert', 'acquire', 'optimize'].filter((stage) => snapshot[stage]?.status === 'Likely gap').slice(0, 2).map((stage) => ({ stage, text: ESTIMATOR_CONFIG.quickWins[stage] }));
}

export function getNotedInsight(answers = {}, previousAnswers = {}, insightCount = 0) {
  if (insightCount >= ESTIMATOR_CONFIG.maximumNotedInsights) return null;
  const candidates = [
    [countUnsure(answers) >= 3 && countUnsure(previousAnswers) < 3, "Unsure answers help show what to review. Check those gaps before spending more."],
    [answers.follow_up_process === 'depends' && previousAnswers.follow_up_process !== 'depends', "Some leads wait longer when no one owns follow-up. I'll include this in your snapshot."],
    [answers.response_speed === 'next_day' && previousAnswers.response_speed !== 'next_day', "Reply times give you a clear place to start."],
    [answers.primary_problem === 'cant_tell' && previousAnswers.primary_problem !== 'cant_tell', "Your answers suggest a tracking gap. Check this before changing your marketing."],
    [answers.current_systems?.includes('none') && !previousAnswers.current_systems?.includes?.('none'), "No tools yet? Your next step starts with the basics."],
  ];
  const match = candidates.find(([condition]) => condition);
  return match ? { text: match[1], duration: ESTIMATOR_CONFIG.notedInsightDuration } : null;
}

export function toggleSystem(selected = [], value) {
  if (value === 'none') return selected.includes('none') ? [] : ['none'];
  const clean = selected.filter((item) => item !== 'none');
  return clean.includes(value) ? clean.filter((item) => item !== value) : [...clean, value];
}

export function createEstimatorState(saved) {
  const fresh = { version: STATE_VERSION, screen: 'intro', step: 0, answers: {}, insightCount: 0 };
  if (!saved || saved.version !== STATE_VERSION) return fresh;
  return { ...fresh, ...saved, answers: { ...(saved.answers || {}) }, step: Math.max(0, Math.min(8, Number(saved.step) || 0)) };
}

export function getAutoAdvanceDelay(reducedMotion) { return reducedMotion ? 0 : 250; }

export function buildResultViewModel(answers = {}) {
  const result = getEstimatorResult(answers);
  const snapshot = getStageSnapshot(answers, result);
  const quickWins = getQuickWins(snapshot);
  if (result.id === 'E' && quickWins.length === 0) quickWins.push({ stage: 'optimize', text: ESTIMATOR_CONFIG.quickWins.optimize });
  const actions = result.id === 'E' ? [result.homeLink && { type: 'link', ...result.homeLink }].filter(Boolean) : [
    result.action,
    { type: 'copy', label: answers.decision_role === 'researcher' ? 'Copy snapshot to share' : 'Copy my snapshot' },
    { type: 'dismiss', label: 'Not right now' },
  ];
  return { result, snapshot, quickWins, actions };
}

export function buildSnapshotText(answers = {}) {
  const model = buildResultViewModel(answers);
  const stages = Object.values(model.snapshot).map((stage) => `${title(stage.label)}: ${stage.status}`).join('\n');
  const path = model.result.path.map((step) => [step.label, step.display].filter(Boolean).join(' ')).join(' → ');
  return `Optivue Growth System Snapshot\n\n${stages}\n\nRecommendation: ${model.result.heading}\nPath: ${path || 'Review the Growth OS guidance'}\n\nBased on your answers. A starting point, not an assessment.`;
}

export function initEstimator(root) {
  const mount = root.querySelector('[data-ovgo-estimator]');
  if (!mount) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stored = readStoredState();
  let state = createEstimatorState(stored);
  let activeInsight = null;
  let insightTimer = null;
  if (stored?.screen && stored.screen !== 'intro') renderResume(); else renderIntro();
  trackEvent('estimator_view');

  function persist() { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function reset() { sessionStorage.removeItem(STORAGE_KEY); state = createEstimatorState(); }
  function clearInsight() { activeInsight = null; const current = mount.querySelector('[data-estimator-insight]'); if (current) current.hidden = true; }

  function renderIntro() {
    mount.innerHTML = `<div class="ovgo-estimator-intro"><p class="ovgo-kicker">Growth System Scope Estimator</p><h2>See what stands between a lead and a booking.</h2><p>Answer 9 questions about your leads and follow-up. Get a snapshot of your growth system, a next step and an estimated cost range.</p><button class="ovgo-btn ovgo-btn--primary" type="button" data-estimator-start>Start the Estimate</button><ul class="ovgo-estimator-facts"><li>About 90 seconds</li><li>No email needed to see results</li><li>Not a fixed quote</li></ul><p class="ovgo-form-note">Please don't enter patient information or passwords anywhere in this tool.</p></div>`;
    mount.querySelector('[data-estimator-start]').addEventListener('click', () => { state.screen = 'question'; state.step = 0; persist(); trackEvent('estimator_start'); renderQuestion(); });
  }

  function renderResume() {
    mount.innerHTML = `<div class="ovgo-estimator-intro"><p class="ovgo-kicker">Welcome back</p><h2>Pick up where you left off?</h2><div class="ovgo-actions"><button class="ovgo-btn ovgo-btn--primary" type="button" data-estimator-resume>Continue</button><button class="ovgo-btn ovgo-btn--secondary" type="button" data-estimator-fresh>Start fresh</button></div></div>`;
    mount.querySelector('[data-estimator-resume]').addEventListener('click', () => { trackEvent('estimator_resume'); state.screen === 'result' ? renderResult() : renderQuestion(); });
    mount.querySelector('[data-estimator-fresh]').addEventListener('click', () => { reset(); renderIntro(); });
  }

  function renderQuestion() {
    const question = ESTIMATOR_CONFIG.questions[state.step];
    state.screen = 'question'; persist();
    const selected = question.multiple ? state.answers[question.id] || [] : [state.answers[question.id]];
    mount.innerHTML = `<div class="ovgo-estimator-progress"><button type="button" class="ovgo-icon-btn" data-estimator-back aria-label="Go to previous question">←</button><span>${state.step + 1} of 9</span><div role="progressbar" aria-label="Estimator progress" aria-valuemin="1" aria-valuemax="9" aria-valuenow="${state.step + 1}"><i style="--progress:${((state.step + 1) / 9) * 100}%"></i></div></div><div class="ovgo-estimator-layout"><form class="ovgo-estimator-question" data-estimator-form><fieldset><legend tabindex="-1">${question.label}</legend>${question.helper ? `<p class="ovgo-estimator-helper">${question.helper}</p>` : ''}<div class="ovgo-estimator-options">${question.options.map(([value, label]) => optionMarkup(question, value, label, selected.includes(value))).join('')}</div>${question.multiple ? '<div class="ovgo-estimator-continue"><button class="ovgo-btn ovgo-btn--primary" type="submit">Continue</button></div>' : ''}</fieldset></form><aside class="ovgo-estimator-live" aria-label="Live growth system snapshot">${renderLiveSnapshot()}</aside></div><div class="ovgo-sr-only" aria-live="polite">Question ${state.step + 1} of 9.</div><div class="ovgo-estimator-insight" data-estimator-insight role="status" ${activeInsight ? '' : 'hidden'}>${activeInsight?.text || ''}</div>`;
    mount.querySelector('legend')?.focus();
    mount.querySelector('[data-estimator-insight]:not([hidden])')?.addEventListener('click', clearInsight, { once: true });
    mount.querySelector('[data-estimator-back]').addEventListener('click', () => { trackEvent('estimator_back', { question_number: state.step + 1 }); if (state.step === 0) renderIntro(); else { state.step -= 1; renderQuestion(); } });
    const form = mount.querySelector('[data-estimator-form]');
    form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.matches('input')) { event.preventDefault(); event.target.click(); }
    });
    if (question.multiple) {
      form.addEventListener('change', (event) => { const before = { ...state.answers, [question.id]: [...(state.answers[question.id] || [])] }; state.answers[question.id] = toggleSystem(state.answers[question.id] || [], event.target.value); persist(); renderQuestion(); showInsight(before); });
      form.addEventListener('submit', (event) => { event.preventDefault(); completeAnswer(question); });
    } else {
      form.addEventListener('change', (event) => { const before = { ...state.answers }; state.answers[question.id] = event.target.value; persist(); showInsight(before); trackEvent('estimator_question_answered', answerEvent(question)); setTimeout(() => advance(), getAutoAdvanceDelay(reducedMotion)); });
    }
  }

  function completeAnswer(question) { trackEvent('estimator_question_answered', answerEvent(question)); advance(); }
  function answerEvent(question) { return { question_id: question.id, question_number: state.step + 1, [question.id]: Array.isArray(state.answers[question.id]) ? undefined : state.answers[question.id] }; }
  function advance() { if (state.step < 8) { state.step += 1; renderQuestion(); } else renderLoader(); }
  function showInsight(before) {
    const insight = getNotedInsight(state.answers, before, state.insightCount);
    if (!insight) return;
    state.insightCount += 1; persist();
    activeInsight = insight;
    clearTimeout(insightTimer);
    const element = mount.querySelector('[data-estimator-insight]');
    if (!element) return;
    element.textContent = insight.text; element.hidden = false;
    element.addEventListener('click', clearInsight, { once: true });
    insightTimer = setTimeout(clearInsight, insight.duration);
  }

  function renderLoader() {
    state.screen = 'loading'; persist();
    mount.innerHTML = '<div class="ovgo-estimator-loader" role="status"><span aria-hidden="true"></span><p>Building your snapshot…</p></div>';
    setTimeout(renderResult, reducedMotion ? 0 : 800);
  }

  function renderResult() {
    state.screen = 'result'; persist();
    const model = buildResultViewModel(state.answers);
    trackEvent('estimator_result_view', { result: model.result.id, scope_label: model.result.scopeLabel });
    mount.innerHTML = `<article class="ovgo-estimator-result"><header><p class="ovgo-kicker">Your Growth System Snapshot</p><h2>${model.result.summary}</h2></header><section aria-labelledby="snapshot-heading"><h3 id="snapshot-heading">Five-stage snapshot</h3><div class="ovgo-estimator-stages">${Object.values(model.snapshot).map(stageMarkup).join('')}</div><p class="ovgo-form-note">Based on your answers. A starting point, not an assessment.</p></section><section class="ovgo-estimator-recommendation"><p class="ovgo-status">${model.result.scopeLabel}</p><h3>${model.result.heading}</h3><p>${model.result.body}</p>${model.result.id === 'E' ? '' : `<h4>Why this fits your answers</h4><ul>${reasonBullets(state.answers, model).map((item) => `<li>${item}</li>`).join('')}</ul><div class="ovgo-estimator-path">${model.result.path.map((step) => `<span><b>${step.label}</b>${step.display ? `<small>${step.display}</small>` : ''}</span>`).join('<i aria-hidden="true">→</i>')}</div><details><summary>Is a Diagnostic right for me?</summary><p>A Diagnostic helps when you need to find the main gap. Use the plan before spending more on ads.</p><p>Already know the fix? Explain the scope on your call.</p></details>`}</section>${model.quickWins.length ? `<section><h3>Try these steps this week</h3><div class="ovgo-estimator-wins">${model.quickWins.map((win) => `<article><b>${title(win.stage)}</b><p>${win.text}</p></article>`).join('')}</div></section>` : ''}<section class="ovgo-estimator-actions" data-estimator-actions>${actionsMarkup(model.actions)}</section>${model.result.id === 'E' ? '' : `<details class="ovgo-estimator-fine"><summary>Details & fine print</summary><p>Investment guidance is preliminary and covers Optivue service fees only. Ad spend, software, CRM, SMS/email usage, call tracking, and booking tools are separate.</p><p>This isn't a proposal, fixed quote, performance guarantee, or legal, medical, privacy, or compliance advice. Final scope is confirmed after a Fit Call and, where appropriate, a Diagnostic.</p></details><button class="ovgo-text-link" type="button" data-estimator-restart>Start over</button>`}<p class="ovgo-form-note" data-estimator-copy-status role="status"></p></article>`;
    mount.querySelectorAll('[data-stage-expand]').forEach((button) => button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); button.nextElementSibling.hidden = !open; trackEvent('estimator_stage_expand', { stage: button.dataset.stageExpand }); }));
    mount.querySelector('[data-estimator-copy]')?.addEventListener('click', async () => { const status = mount.querySelector('[data-estimator-copy-status]'); try { await navigator.clipboard.writeText(buildSnapshotText(state.answers)); status.textContent = 'Snapshot copied.'; trackEvent('estimator_cta_click', { cta: 'copy_snapshot' }); } catch { status.textContent = 'Copy failed. Select the snapshot text and copy it manually.'; } });
    mount.querySelector('[data-estimator-dismiss]')?.addEventListener('click', () => { mount.querySelector('[data-estimator-actions]').innerHTML = '<p>Thanks for taking the estimator. <a href="/">Back to Optivue Growth OS</a></p>'; trackEvent('estimator_cta_click', { cta: 'not_now' }); });
    mount.querySelector('[data-ovgo-booking]')?.addEventListener('click', () => trackEvent('estimator_cta_click', { cta: 'fit_call' }));
    mount.querySelector('[data-estimator-restart]')?.addEventListener('click', () => { reset(); trackEvent('estimator_restart'); renderIntro(); });
  }

  function renderLiveSnapshot() { const snapshot = getStageSnapshot(state.answers); return `<p class="ovgo-kicker">Your picture so far</p>${Object.values(snapshot).map((stage) => `<div class="ovgo-estimator-live-row" data-status-token="${stage.colorToken}"><span aria-hidden="true">${icon(stage.icon)}</span><b>${title(stage.label)}</b><small>${stage.status}</small></div>`).join('')}`; }
}

function optionMarkup(question, value, label, checked) { const type = question.multiple ? 'checkbox' : 'radio'; const lighter = value === 'not_sure' ? ' is-lighter' : ''; return `<label class="ovgo-estimator-option${lighter}"><input type="${type}" name="${question.id}" value="${value}" ${checked ? 'checked' : ''}><span><i aria-hidden="true">✓</i>${label}</span></label>`; }
function stageMarkup(stage) { return `<article class="ovgo-estimator-stage" data-status-token="${stage.colorToken}"><button type="button" data-stage-expand="${stage.label}" aria-expanded="false"><span aria-hidden="true">${icon(stage.icon)}</span><b>${title(stage.label)}</b><small>${stage.status}</small></button><p hidden>${stageExplanation(stage)}</p></article>`; }
function actionsMarkup(actions) { return actions.map((action) => action.type === 'link' ? `<a class="ovgo-text-link" href="${action.href}">${action.label}</a>` : action.type === 'calendly' ? `<button class="ovgo-btn ovgo-btn--primary" type="button" data-ovgo-booking data-cta-location="estimator">${action.label}</button>` : action.type === 'copy' ? `<button class="ovgo-btn ovgo-btn--secondary" type="button" data-estimator-copy>${action.label}</button>` : `<button class="ovgo-text-link" type="button" data-estimator-dismiss>${action.label}</button>`).join(''); }
function reasonBullets(answers, model) { const points = []; if (model.snapshot.automate.status === 'Likely gap') points.push('Your follow-up timing or ownership needs attention before more traffic.'); if (model.snapshot.measure.status === 'Likely gap') points.push('Your answers show a tracking gap between marketing and bookings.'); if (model.snapshot.convert.status === 'Likely gap') points.push('Your inquiry-to-booking path needs a clearer conversion step.'); if (answers.location_count === 'six_plus') points.push('Six or more locations require a custom scope after the Diagnostic.'); return points.length ? points.slice(0, 3) : ['Your answers support reviewing the full inquiry-to-booking path before choosing a build.']; }
function stageExplanation(stage) { return ({ acquire: 'This reflects your inquiry volume and current acquisition focus.', convert: 'This reflects your reported path from inquiry to booking.', automate: 'This reflects reply speed, ownership, CRM, and follow-up.', measure: 'This reflects conversion and call-tracking visibility.', optimize: 'Optimization follows reliable measurement and a working foundation.' })[stage.label]; }
function deriveFlags(answers) { const systems = new Set(answers.current_systems || []); const flags = Object.fromEntries(Object.values(ESTIMATOR_CONFIG.systemFlags).map((flag) => [flag, false])); for (const [option, flag] of Object.entries(ESTIMATOR_CONFIG.systemFlags)) flags[flag] = systems.has(option); flags.unsure_count = countUnsure(answers); return flags; }
function countUnsure(answers) { return Object.values(answers).filter((value) => value === 'not_sure' || Array.isArray(value) && value.includes('not_sure')).length; }
function presentStage(label, status) { const presentation = ESTIMATOR_CONFIG.statusPresentation[status]; return { label, status, icon: presentation.icon, colorToken: presentation.colorToken }; }
function buildPath(nextStage) { const diagnostic = ESTIMATOR_CONFIG.prices.diagnostic; if (!nextStage) return []; if (nextStage === 'foundation' || nextStage === 'operations') return [diagnostic, ESTIMATOR_CONFIG.prices[nextStage]]; return [diagnostic, { label: nextStage, display: '' }]; }
function readStoredState() { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch { return null; } }
function title(value) { return String(value).charAt(0).toUpperCase() + String(value).slice(1); }
function icon(name) { return ({ check: '✓', review: '◐', alert: '!', question: '?', next: '→' })[name] || '•'; }
