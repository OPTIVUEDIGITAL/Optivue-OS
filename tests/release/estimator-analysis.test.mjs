import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ESTIMATOR_ANALYSIS_STEPS,analysisMarkup} from '../../src/js/estimator-analysis.js';

test('estimator status log uses the four approved lines in order',()=>{
  assert.deepEqual(ESTIMATOR_ANALYSIS_STEPS,[
    'Analyzing clinic intake...',
    'Evaluating follow-up delays...',
    'Calculating growth priorities...',
    'Compiling Growth OS scope...'
  ]);
  const html=analysisMarkup();
  assert.equal((html.match(/data-analysis-step=/g)||[]).length,4);
  assert.match(html,/role="status"/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/aria-busy="true"/);
  assert.match(html,/data-analysis-skip/);
  assert.match(html,/No live clinic accounts or patient records/);
});

test('the spinner, typed cursor, checkmarks, mobile layout and reduced motion are CSS-only',async()=>{
  const css=await readFile('src/css/estimator-analysis.css','utf8');
  assert.match(css,/@keyframes check-analysis-spin/);
  assert.match(css,/@keyframes check-analysis-caret/);
  assert.match(css,/is-current/);
  assert.match(css,/is-complete/);
  assert.match(css,/@media\(max-width:450px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/var\(--ovgo-primary\)/);
});

test('both estimator result routes enter the analysis transition without changing model logic',async()=>{
  const code=await readFile('src/js/clinic-check.js','utf8');
  const build=await readFile('scripts/build.mjs','utf8');
  assert.match(code,/state.mode='result';once\('estimator_quick_complete'\);beginAnalysis\(\)/);
  assert.match(code,/state.mode='refined';once\('estimator_complete'\);beginAnalysis\(\)/);
  assert.match(code,/startEstimatorAnalysis/);
  assert.match(build,/estimator-analysis.css/);
});
