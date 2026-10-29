import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {HERO_CONFIG} from '../../src/js/hero-config.js';

const phrases=['BOOKED APPOINTMENTS','BOOKED CONSULTATION','SCHEDULED VISIT'];

test('hero uses exactly the requested clinic-facing phrases and retains animation timings',()=>{
 assert.deepEqual([...HERO_CONFIG.phrases],phrases);
 assert.equal(HERO_CONFIG.typeMs,70);
 assert.equal(HERO_CONFIG.holdMs,1800);
 assert.equal(HERO_CONFIG.deleteMs,40);
 assert.equal(HERO_CONFIG.gapMs,400);
});

test('HTML hero is immediately readable without JavaScript and width reserve matches longest phrase',async()=>{
 for(const path of ['dist/index.html','dist/site.html']){
  const html=await readFile(path,'utf8');
  assert(html.includes('<span data-hero-phrase>BOOKED APPOINTMENTS</span>'));
  assert(html.includes('<span class="ovgo-hero-phrase-reserve">BOOKED APPOINTMENTS'));
  assert(html.includes('Turn more leads into booked appointments, booked consultation, and scheduled visit.'));
  assert(html.includes('with systems your business owns.'));
  assert(html.includes('class="office-floor-copy"'));
  assert(html.includes('data-hero-typewriter'));
  assert(!html.includes('LONG-TERM CLIENTS'));
  assert(!html.includes('CLOSED DEALS'));
  assert(!html.includes('BOOKED CALLS'));
 }
});

test('typewriter retains highlight, caret, visibility and reduced-motion behavior',async()=>{
 const script=await readFile('src/js/hero-typewriter.js','utf8');
 const css=await readFile('src/css/office-hero.css','utf8');
 assert.match(script,/function positionCaret\(\)/);
 assert.match(script,/phase === 'delete'/);
 assert.match(script,/phase = 'type'/);
 assert.match(script,/visibilitychange/);
 assert.match(script,/prefers-reduced-motion: reduce/);
 assert.match(css,/data-hero-phrase\]\{background:var\(--ovgo-lime\)/);
 assert.match(css,/box-decoration-break:clone/);
 assert.match(css,/min-width:768px\)\{#optivue-growth-os \.office-hero \.ovgo-hero-phrase-line\{font-size:\.94em\}/);
 assert.match(css,/perspective\(1400px\) rotateZ\(-12deg\)/);
});
