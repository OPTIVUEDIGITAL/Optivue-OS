import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ESTIMATOR_CONFIG } from '../production/js/estimator-config.js';

const html = await readFile(new URL('../production/index.html', import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../production/sitemap.xml', import.meta.url), 'utf8');
const robots = await readFile(new URL('../production/robots.txt', import.meta.url), 'utf8');

test('uses the clinic positioning and required hero message', () => {
  assert.match(html, /FOR HEALTH, WELLNESS &amp; AESTHETICS/);
  assert.match(html, /Turn more leads into booked visits/);
  assert.match(html, /20 minutes · No pressure · Find out if a Diagnostic makes sense/);
  assert.match(html, /Your system, in your name\. · 8 years working with medical and wellness practices/);
});

test('removes legacy packages and free audit language', () => {
  assert.doesNotMatch(html, /Growth Starter|Growth Accelerator|Growth Lab|free audit/i);
});

test('publishes approved offers and binds shared estimator prices', () => {
  for (const copy of ['Growth Systems Diagnostic', '90-Day Growth Foundation Launch', 'Growth Operations', 'Systems Care', '$350/month']) {
    assert.ok(html.includes(copy), `missing ${copy}`);
  }
  for (const key of Object.keys(ESTIMATOR_CONFIG.prices)) assert.match(html, new RegExp(`data-price-key=["']${key}["']`));
  assert.match(html, /After the build/);
});

test('has the required sections and one H1', () => {
  for (const id of ['overview', 'how-it-works', 'who-i-work-with', 'pricing', 'fit', 'about', 'faq']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test('uses Growth OS canonical and social metadata', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/growth\.optivuedigital\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/growth\.optivuedigital\.com\/">/);
  assert.match(html, /<title>Optivue Growth OS \| Turn more leads into booked visits<\/title>/);
  assert.match(html, /ProfessionalService/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating/);
  assert.match(sitemap, /https:\/\/growth\.optivuedigital\.com\//);
  assert.match(robots, /https:\/\/growth\.optivuedigital\.com\/sitemap\.xml/);
});

test('keeps unresolved claims out of public HTML and records them for review', async () => {
  assert.doesNotMatch(html, /\[CONFIRM/);
  const pending = await readFile(new URL('../docs/confirm-items.md', import.meta.url), 'utf8');
  assert.match(pending, /Client naming permission/);
  assert.match(pending, /Call availability/);
});

test('uses clinic language and first-person delivery voice', () => {
  assert.doesNotMatch(html, /\benquir(?:y|ies)\b|\bconsultation\b|\bfree audit\b/i);
  assert.doesNotMatch(html, /\bwe build\b|\bour team\b/i);
});
