import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('the five-stage system renders as static, responsive bento content', async () => {
  const page = await readFile('dist/index.html', 'utf8');
  const mirror = await readFile('dist/site.html', 'utf8');
  for (const html of [page, mirror]) {
    assert.match(html, /id="systems"[^>]*ovgo-bento/);
    assert.match(html, /YOUR CONNECTED GROWTH SYSTEM/);
    assert.equal((html.match(/class="bento-card bento-card--/g) || []).length, 5);
    assert(!html.includes('class="ovgo-stage-grid"'));
    for (const stage of ['acquire','convert','automate','measure','optimize']) {
      assert(html.includes('data-bento-card="'+stage+'"'));
      assert(html.includes('data-bento-stage="'+stage+'"'));
    }
    assert(html.includes('class="ovgo-map-skeleton"'));
    assert(html.includes('id="growth-map-frame"'));
    assert(html.includes('Illustrative appointment times'));
    assert(html.includes('href="/estimator"'));
    assert(html.includes('data-ovgo-booking data-cta-location="systems"'));
  }
});

test('bento supports reduced motion and mobile stacking without loading heavy libraries', async () => {
  const css = await readFile('src/css/bento.css', 'utf8');
  const js = await readFile('src/js/bento.js', 'utf8');
  assert.match(css, /max-width:740px/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /aria-pressed/);
  assert(!/from ['"](three|gsap|lottie|react)['"]/.test(js));
});
