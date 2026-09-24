import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../production/js/estimator.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../production/css/optivue-v2.css', import.meta.url), 'utf8');
const tokens = JSON.parse(await readFile(new URL('../production/design-tokens.json', import.meta.url), 'utf8'));

test('approved estimator tokens are additive and use the final names', () => {
  assert.equal(tokens.shared['estimator-space-unit'], '8px');
  assert.equal(tokens.shared['type-question'], 'clamp(1.5rem, 1.25rem + 1vw, 1.75rem)');
  assert.equal(tokens.shared['tap-target-min'], '44px');
  assert.equal(tokens.shared['estimator-option-min-height'], '56px');
  assert.equal(tokens.shared['estimator-content-max'], '640px');
  assert.equal(tokens.shared['estimator-question-max'], '600px');
  assert.equal(tokens.shared['estimator-progress-height'], '3px');
  assert.equal(tokens.shared['motion-selection'], '250ms');
  assert.equal(tokens.shared['motion-feedback'], '200ms');
  assert.equal(tokens.shared['motion-loader'], '800ms');
  assert.equal(tokens.shared['control-height'], '48px');
  assert.equal(tokens.shared.ease, 'cubic-bezier(.16,1,.3,1)');
});

test('estimator exposes semantic fieldsets, progress, focus announcements, and accordions', () => {
  assert.match(source, /<fieldset/);
  assert.match(source, /<legend tabindex="-1">/);
  assert.match(source, /role="progressbar"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-expanded/);
});

test('answer cards use approved minimum height and never a fixed height', () => {
  assert.match(css, /\.ovgo-estimator-option[\s\S]*min-height:\s*var\(--ovgo-estimator-option-min-height\)/);
  assert.doesNotMatch(css, /\.ovgo-estimator-option[^}]*(?<!min-)height:\s*var\(--ovgo-estimator-option-min-height\)/s);
});

test('status colors and focus ring use existing theme tokens', () => {
  for (const [status, token] of [['green', 'green'], ['amber', 'amber'], ['danger', 'danger'], ['subtle', 'subtle']]) {
    assert.match(css, new RegExp(`data-status-token=["']${status}["'][^}]*var\\(--ovgo-${token}\\)`));
  }
  assert.match(css, /\.ovgo-estimator[^}]*:focus-visible[^}]*var\(--ovgo-text\)/s);
});

test('responsive layouts cover 390px, tablet, desktop, and safe areas', () => {
  assert.match(css, /@media \(min-width:\s*640px\)/);
  assert.match(css, /@media \(min-width:\s*1024px\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /max-width:\s*var\(--ovgo-estimator-content-max\)/);
});

test('reduced motion removes estimator movement and loader animation', () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.ovgo-estimator[^}]*transition:\s*none/s);
  assert.match(css, /\.ovgo-estimator-loader[^}]*animation:\s*none/s);
});
