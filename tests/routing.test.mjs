import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const homepage = await readFile(new URL('../production/index.html', import.meta.url), 'utf8');
const estimator = await readFile(new URL('../production/estimator/index.html', import.meta.url), 'utf8').catch(() => '');
const headers = await readFile(new URL('../production/_headers', import.meta.url), 'utf8');
const redirects = await readFile(new URL('../production/_redirects', import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../production/sitemap.xml', import.meta.url), 'utf8');

test('diagnosis redirects permanently to estimator', () => {
  assert.match(redirects, /^\/diagnosis \/estimator 301$/m);
});

test('estimator is a standalone statically tagged page', () => {
  assert.match(estimator, /<title>Growth System Scope Estimator \| Optivue Growth OS<\/title>/);
  assert.match(estimator, /<meta name="description" content="See what stands between a lead and a booking\. Answer 9 questions for a system snapshot and estimated cost range\.">/);
  assert.match(estimator, /<meta name="robots" content="noindex">/);
  assert.match(estimator, /<link rel="canonical" href="https:\/\/growth\.optivuedigital\.com\/estimator">/);
  assert.match(estimator, /data-ovgo-estimator/);
});

test('estimator receives a noindex response header and stays out of sitemap', () => {
  assert.match(headers, /\/estimator\*?\n\s+X-Robots-Tag: noindex/);
  assert.doesNotMatch(sitemap, /\/estimator/);
});

test('homepage keeps its canonical and links to the standalone estimator', () => {
  assert.match(homepage, /<link rel="canonical" href="https:\/\/growth\.optivuedigital\.com\/">/);
  assert.match(homepage, /href="\/estimator"/);
  assert.doesNotMatch(homepage, /data-ovgo-estimator|data-ovgo-diagnosis|id="diagnosis"|id="estimator"/);
});

test('legacy diagnosis module is removed', async () => {
  await assert.rejects(access(new URL('../production/js/diagnosis.js', import.meta.url)));
});
