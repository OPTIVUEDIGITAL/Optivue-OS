import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResultViewModel,
  buildSnapshotText,
  createEstimatorState,
  getAutoAdvanceDelay,
  toggleSystem,
} from '../production/js/estimator.js';
import { sanitizeEventParameters } from '../production/js/analytics.js';
import { buildCalendlyUrl } from '../production/js/booking.js';

const ready = {
  business_type: 'medical_wellness', location_count: 'one', monthly_inquiries: '26_50',
  primary_problem: 'ongoing', follow_up_process: 'crm_automatic', response_speed: 'within_hour',
  current_systems: ['crm', 'booking', 'tracking', 'auto_followup', 'ads'], marketing_spend: '2500_4999', decision_role: 'owner',
};

test('None of these clears every other selected system', () => {
  assert.deepEqual(toggleSystem(['crm', 'tracking'], 'none'), ['none']);
  assert.deepEqual(toggleSystem(['none'], 'crm'), ['crm']);
});

test('Not sure combines with other system selections', () => {
  assert.deepEqual(toggleSystem(['crm'], 'not_sure'), ['crm', 'not_sure']);
});

test('Result E exposes only the homepage link', () => {
  const model = buildResultViewModel({ ...ready, business_type: 'ecommerce' });
  assert.deepEqual(model.actions, [{ type: 'link', label: 'Back to Optivue Growth OS', href: '/' }]);
});

test('Results A through D expose Calendly, clipboard, and not-now actions', () => {
  const model = buildResultViewModel(ready);
  assert.deepEqual(model.actions.map(({ type, label }) => ({ type, label })), [
    { type: 'calendly', label: 'Book a 20-Minute Fit Call' },
    { type: 'copy', label: 'Copy my snapshot' },
    { type: 'dismiss', label: 'Not right now' },
  ]);
});

test('research role receives a share-oriented clipboard label', () => {
  const model = buildResultViewModel({ ...ready, decision_role: 'researcher' });
  assert.equal(model.actions[1].label, 'Copy snapshot to share');
});

test('snapshot text contains stages, recommendation, and path without personal data', () => {
  const text = buildSnapshotText({ ...ready, name: 'Private Name', email: 'private@example.com' });
  assert.match(text, /Acquire:/);
  assert.match(text, /Recommendation:/);
  assert.match(text, /Path:/);
  assert.doesNotMatch(text, /Private Name|private@example\.com/);
});

test('session recovery accepts only the current version and restart resets state', () => {
  const resumed = createEstimatorState({ version: 2, screen: 'question', step: 4, answers: { business_type: 'consulting' }, insightCount: 2 });
  assert.equal(resumed.step, 4);
  assert.equal(resumed.answers.business_type, 'consulting');
  assert.equal(createEstimatorState({ version: 1, step: 8 }).step, 0);
  assert.equal(createEstimatorState().screen, 'intro');
});

test('reduced motion skips the 250ms auto-advance delay', () => {
  assert.equal(getAutoAdvanceDelay(false), 250);
  assert.equal(getAutoAdvanceDelay(true), 0);
});

test('estimator analytics keeps approved fields and removes PII and free text', () => {
  assert.deepEqual(sanitizeEventParameters('estimator_question_answered', {
    question_id: 'business_type', question_number: 1, business_type: 'consulting',
    name: 'Private Name', email: 'private@example.com', website: 'https://example.com', message: 'free text',
  }), { question_id: 'business_type', question_number: 1, business_type: 'consulting' });
});

test('Calendly URL carries only approved UTM parameters from the page URL', () => {
  const url = new URL(buildCalendlyUrl('https://calendly.com/optivue/test', 'https://growth.optivuedigital.com/estimator?utm_source=linkedin&utm_campaign=fall&email=private@example.com'));
  assert.equal(url.searchParams.get('utm_source'), 'linkedin');
  assert.equal(url.searchParams.get('utm_campaign'), 'fall');
  assert.equal(url.searchParams.has('email'), false);
});
