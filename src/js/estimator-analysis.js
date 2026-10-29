/**
 * Progressive visual transition. All computations happen locally.
 * This component does not perform searches or inspect any clinic accounts.
 */
export const ESTIMATOR_ANALYSIS_STEPS = Object.freeze([
  'Analyzing clinic intake...',
  'Evaluating follow-up delays...',
  'Calculating growth priorities...',
  'Compiling Growth OS scope...'
]);

export function analysisMarkup() {
  return '<section class="check-analysis" aria-labelledby="check-analysis-title" aria-busy="true">' +
    '<p class="ovgo-kicker">OPTIVUE GROWTH OS / SYSTEM ANALYSIS</p>' +
    '<div class="check-analysis__spinner" aria-hidden="true"></div>' +
    '<h2 id="check-analysis-title" tabindex="-1">Preparing your growth assessment.</h2>' +
    '<p class="check-analysis__description">Reviewing the answers you provided to identify a starting point.</p>' +
    '<ol class="check-analysis__log" aria-hidden="true">' +
    ESTIMATOR_ANALYSIS_STEPS.map((_, i) => '<li data-analysis-step="'+i+'"><span class="check-analysis__indicator"></span><span class="check-analysis__line"></span></li>').join('') +
    '</ol>' +
    '<p class="check-analysis__announcement ovgo-sr-only" role="status" aria-live="polite" aria-atomic="true"></p>' +
    '<p class="check-analysis__privacy">Based on your answers. No live clinic accounts or patient records are being accessed.</p>' +
    '<button class="check-analysis__skip" type="button" data-analysis-skip>See my result now</button>' +
    '</section>';
}

export function startEstimatorAnalysis({screen, onComplete, operations = [], reducedMotion = false}) {
  screen.innerHTML = analysisMarkup();
  let closed = false;
  const pending = new Set();
  const delay = ms => new Promise(resolve => {
    const task = {id:0, resolve};
    task.id = setTimeout(() => {pending.delete(task); resolve();}, ms);
    pending.add(task);
  });
  const finish = () => {
    if (closed) return;
    closed = true;
    for (const task of pending) {clearTimeout(task.id);task.resolve();}
    pending.clear();
    onComplete();
  };
  const skip = screen.querySelector('[data-analysis-skip]');
  skip.addEventListener('click', finish, {once:true});
  const announce = screen.querySelector('.check-analysis__announcement');
  screen.querySelector('#check-analysis-title')?.focus({preventScroll:true});
  const run = async () => {
    for (let i = 0; i < ESTIMATOR_ANALYSIS_STEPS.length; i++) {
      if (closed) return;
      try { operations[i]?.(); } catch { /* The result renderer retains its normal validation. */ }
      const row = screen.querySelector('[data-analysis-step="'+i+'"]');
      const line = row?.querySelector('.check-analysis__line');
      if (!row || !line) {finish();return;}
      row.classList.add('is-current');
      announce.textContent = ESTIMATOR_ANALYSIS_STEPS[i];
      if (reducedMotion) {
        line.textContent = ESTIMATOR_ANALYSIS_STEPS[i];
      } else {
        for (const character of ESTIMATOR_ANALYSIS_STEPS[i]) {
          if (closed) return;
          line.textContent += character;
          await delay(23);
        }
      }
      if (closed) return;
      await delay(reducedMotion ? 0 : 220);
      if (closed) return;
      row.classList.remove('is-current');
      row.classList.add('is-complete');
    }
    finish();
  };
  void run();
  return {cancel:() => {
    if (closed) return;
    closed = true;
    for (const task of pending) {clearTimeout(task.id);task.resolve();}
    pending.clear();
  }};
}
