import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ESTIMATOR_CONFIG } from '../production/js/estimator-config.js';

const html = await readFile(new URL('../production/index.html', import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../production/sitemap.xml', import.meta.url), 'utf8');
const robots = await readFile(new URL('../production/robots.txt', import.meta.url), 'utf8');

test('uses the clinic positioning and required hero message', () => {
  assert.match(html, /FOR CHIROPRACTIC CLINICS/);
  assert.match(html, /Turn More Leads Into New Patients/);
  assert.match(html, /20 minutes · No pressure · Find out if a Diagnostic makes sense/);
  assert.match(html, /8 years working with medical and wellness practices/);
});

test('removes legacy packages and free audit language', () => {
  assert.doesNotMatch(html, /Growth Starter|Growth Accelerator|Growth Lab|\$2,500|free audit/i);
});

test('publishes approved offers and binds shared estimator prices', () => {
  for (const copy of ['Growth Systems Diagnostic', '90-Day Growth Foundation Launch', 'Growth Operations', 'Systems Care', 'From $350/month']) {
    assert.ok(html.includes(copy), `missing ${copy}`);
  }
  for (const key of Object.keys(ESTIMATOR_CONFIG.prices)) assert.match(html, new RegExp(`data-price-key=["']${key}["']`));
  assert.match(html, /Most clinics continue here/);
});

test('has the required sections and one H1', () => {
  for (const id of ['overview', 'how-it-works', 'transformations', 'pricing', 'fit', 'about', 'faq']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test('uses Growth OS canonical and social metadata', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/growth\.optivuedigital\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/growth\.optivuedigital\.com\/">/);
  assert.match(html, /<title>Optivue Growth OS \| Turn More Leads Into New Patients<\/title>/);
  assert.match(html, /ProfessionalService/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating/);
  assert.match(sitemap, /https:\/\/growth\.optivuedigital\.com\//);
  assert.match(robots, /https:\/\/growth\.optivuedigital\.com\/sitemap\.xml/);
});

test('keeps unresolved claims visibly marked', () => {
  assert.match(html, /\[CONFIRM permission for each\]/);
  assert.match(html, /\[CONFIRM: Based in the Philippines/);
});

test('uses clinic language and first-person delivery voice', () => {
  assert.doesNotMatch(html, /\benquir(?:y|ies)\b|\bconsultation\b|\bfree audit\b/i);
  assert.doesNotMatch(html, /\bwe build\b|\bour team\b/i);
});
