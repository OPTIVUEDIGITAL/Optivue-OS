import test from 'node:test';
import assert from 'node:assert/strict';
import { buildResultViewModel, getEstimatorResult, getNotedInsight, getQuickWins, getStageSnapshot } from '../production/js/estimator.js';
import { ESTIMATOR_CONFIG } from '../production/js/estimator-config.js';

const base = {
  business_type: 'medical_wellness', location_count: 'one', monthly_inquiries: '26_50',
  primary_problem: 'more_inquiries', follow_up_process: 'crm_automatic', response_speed: 'within_hour',
  current_systems: ['crm', 'booking', 'tracking', 'auto_followup', 'ads'], marketing_spend: '2500_4999', decision_role: 'owner',
};

const personas = {
  medSpaReadiness: { ...base, primary_problem: 'not_enough_book', follow_up_process: 'depends', response_speed: 'next_day', current_systems: ['crm', 'ads'] },
  chiropracticFoundation: { ...base, business_type: 'allied_health', monthly_inquiries: '10_25', primary_problem: 'cant_tell', follow_up_process: 'manual', response_speed: 'same_day', current_systems: ['booking'], marketing_spend: '1000_2499' },
  wellnessAdvanced: { ...base, location_count: 'two_five', monthly_inquiries: '51_100', primary_problem: 'ongoing', marketing_spend: '5000_9999' },
  alliedHealthCustom: { ...base, business_type: 'allied_health', location_count: 'six_plus' },
  ecommerce: { ...base, business_type: 'ecommerce' },
  consultingUnsure: { ...base, business_type: 'consulting', location_count: 'not_sure', monthly_inquiries: 'not_sure', primary_problem: 'not_sure', follow_up_process: 'not_sure', response_speed: 'not_sure', current_systems: ['not_sure'], marketing_spend: 'prefer_not' },
  researcher: { ...base, decision_role: 'researcher' },
};

test('shared config owns approved public prices and the Phase 2 Result E item', () => {
  assert.deepEqual(ESTIMATOR_CONFIG.prices, {
    diagnostic: { label: 'Growth Systems Diagnostic', display: 'From $1,500' },
    foundation: { label: '90-Day Growth Foundation Launch', display: 'From $7,500' },
    operations: { label: 'Growth Operations', display: 'From $3,500/month' },
  });
  assert.ok(ESTIMATOR_CONFIG.phase2Acceptance.includes('Send a Note restored on Result E'));
  assert.equal(ESTIMATOR_CONFIG.notedInsightDuration, 2000);
});

test('seven acceptance personas receive the specified result and scope', () => {
  const cases = [
    ['med spa readiness', personas.medSpaReadiness, 'D', 'Readiness Review'],
    ['chiropractic foundation', personas.chiropracticFoundation, 'B', 'Foundation Scope'],
    ['wellness advanced', personas.wellnessAdvanced, 'C', 'Advanced Growth Scope'],
    ['allied health custom', personas.alliedHealthCustom, 'A', 'Custom Scope'],
    ['online store', personas.ecommerce, 'E', 'Not Currently a Fit'],
    ['consulting unsure', personas.consultingUnsure, 'A', 'Foundation Scope'],
    ['researcher normal result', personas.researcher, 'C', 'Standard Growth Scope'],
  ];
  for (const [name, answers, id, scopeLabel] of cases) {
    const result = getEstimatorResult(answers);
    assert.equal(result.id, id, name);
    assert.equal(result.scopeLabel, scopeLabel, name);
  }
});

test('first matching rule wins when answers match several branches', () => {
  assert.equal(getEstimatorResult({ ...personas.alliedHealthCustom, business_type: 'ecommerce' }).id, 'E');
  assert.equal(getEstimatorResult({ ...personas.medSpaReadiness, location_count: 'six_plus' }).scopeLabel, 'Custom Scope');
  assert.equal(getEstimatorResult(personas.medSpaReadiness).id, 'D');
});

test('Result E has approved copy and no action', () => {
  const result = getEstimatorResult(personas.ecommerce);
  assert.equal(result.action, null);
  assert.match(result.body, /If your needs change, I'd be glad to hear from you\.$/);
  assert.deepEqual(result.homeLink, { label: 'Back to Optivue Growth OS', href: '/' });
  assert.ok(buildResultViewModel(personas.ecommerce).quickWins.length > 0);
});

test('stage snapshot returns all five text statuses with existing color tokens and icons', () => {
  const result = getEstimatorResult(personas.medSpaReadiness);
  const snapshot = getStageSnapshot(personas.medSpaReadiness, result);
  assert.deepEqual(Object.keys(snapshot), ['acquire', 'convert', 'automate', 'measure', 'optimize']);
  const allowed = new Set(['Looks solid', 'Worth reviewing', 'Likely gap', 'Unknown', 'Comes after Measure', 'Ready']);
  const tokens = { 'Looks solid': 'green', 'Worth reviewing': 'amber', 'Likely gap': 'danger', Unknown: 'subtle' };
  for (const stage of Object.values(snapshot)) {
    assert.ok(allowed.has(stage.status));
    assert.ok(stage.icon);
    assert.ok(stage.label);
    if (tokens[stage.status]) assert.equal(stage.colorToken, tokens[stage.status]);
  }
});

test('quick wins follow Automate, Measure, Convert, Acquire priority and stop at two', () => {
  const snapshot = getStageSnapshot(personas.medSpaReadiness, getEstimatorResult(personas.medSpaReadiness));
  const wins = getQuickWins(snapshot);
  assert.equal(wins.length, 2);
  assert.equal(wins[0].stage, 'automate');
  assert.equal(wins[1].stage, 'measure');
});

test('noted insights stop after three and detect three unsure answers', () => {
  assert.match(getNotedInsight(personas.medSpaReadiness, {}, 0)?.text ?? '', /follow-up depends/);
  assert.equal(getNotedInsight(personas.medSpaReadiness, {}, 3), null);
  assert.match(getNotedInsight(personas.consultingUnsure, {}, 0)?.text ?? '', /Not knowing is useful information/);
  assert.match(getNotedInsight({ current_systems: ['none'] }, { current_systems: [] }, 0)?.text ?? '', /Many strong businesses start here/);
});

test('default result becomes Standard Growth Scope only with CRM and tracking', () => {
  const standard = { ...base, monthly_inquiries: '10_25', primary_problem: 'not_sure', current_systems: ['crm', 'booking', 'tracking', 'auto_followup'], marketing_spend: '1000_2499' };
  assert.equal(getEstimatorResult(standard).scopeLabel, 'Standard Growth Scope');
  assert.equal(getEstimatorResult({ ...standard, current_systems: ['crm', 'booking', 'auto_followup'] }).scopeLabel, 'Foundation Scope');
});
