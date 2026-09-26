import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = [
  '../production/index.html', '../production/estimator/index.html', '../production/js/estimator.js',
  '../production/js/estimator-config.js', '../production/js/optivue.js', '../production/_redirects', '../production/_headers',
  '../production/js/context.js', '../production/js/lead-capture.js', '../production/css/optivue-v2.css',
];
const productionSource = (await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');
const portable = await readFile(new URL('../portable/optivue-growth-os.html', import.meta.url), 'utf8').catch(() => '');
const admin = await readFile(new URL('../docs/estimator-admin.md', import.meta.url), 'utf8').catch(() => '');

test('Phase 1 contains no email capture or Result E note form', () => {
  assert.doesNotMatch(productionSource, /data-send-note-form|data-email-snapshot-form|Email me this snapshot|Send this to the decision-maker/);
  assert.match(productionSource, /Send a Note restored on Result E/);
});

test('production removes legacy estimator tiers and tool mounts', () => {
  assert.doesNotMatch(productionSource, /Growth Starter|Growth Accelerator|Growth Lab|\$88|data-ovgo-diagnosis|Lead Leak Check/);
  assert.match(productionSource, /Growth OS Scope Estimator/);
});

test('portable artifact points visitors to the current standalone estimator', () => {
  assert.match(portable, /href="\/estimator"/);
  assert.doesNotMatch(portable, /data-ovgo-diagnosis|Lead Leak Check|calculateEstimate/);
});

test('admin guide documents every owner-editable estimator control', () => {
  for (const item of ['questions', 'thresholds', 'prices', 'result copy', 'quick wins', 'Calendly URL', 'disable the estimator', 'Send a Note restored on Result E']) {
    assert.match(admin, new RegExp(item, 'i'), item);
  }
});

test('admin guide preserves free-plan hosting boundaries', () => {
  for (const item of ['Cloudflare Workers Free plan', 'Turnstile', 'honeypot', 'CRM stores submissions', 'no KV', 'no D1', 'no Durable Objects', 'no R2', 'no Queues']) {
    assert.match(admin, new RegExp(item, 'i'), item);
  }
});
