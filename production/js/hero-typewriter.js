import { HERO_CONFIG } from './hero-config.js';

export function phraseCycle(phrases, random = Math.random) {
  const rest = [...new Set(phrases)].slice(1);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [phrases[0], ...rest];
}

export function initHeroTypewriter(root, config = HERO_CONFIG) {
  const hero = root.querySelector('[data-hero-typewriter]');
  if (!hero) return;
  const text = hero.querySelector('[data-hero-phrase]');
  const caret = hero.querySelector('.ovgo-hero-phrase-live .ovgo-hero-caret');
  const doc = hero.ownerDocument;
  const win = doc.defaultView;
  const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
  let cycle = phraseCycle(config.phrases), index = 0, phase = 'hold';
  let timer, due = 0, remaining = config.holdMs;
  text.textContent = config.phrases[0];
  function positionCaret() {
    if (!caret?.style) return;
    if (!text.firstChild) { caret.style.transform = 'translate(0px, 0px)'; return; }
    const box = text.parentElement.getBoundingClientRect();
    const range = doc.createRange();
    const length = text.textContent.length;
    range.setStart(text.firstChild, Math.max(0, length - 1));
    range.setEnd(text.firstChild, length);
    const end = range.getBoundingClientRect();
    const x = length ? end.right - box.left : 0;
    const y = length ? end.bottom - box.top - caret.offsetHeight : 0;
    caret.style.transform = `translate(${x}px, ${y}px)`;
  }
  function paint(value) { text.textContent = value; positionCaret(); }
  const visual = hero.querySelector('.ovgo-hero-headline-visual');
  const fixed = hero.querySelector('[data-hero-fixed]');
  if (fixed) fixed.textContent = 'Turn more leads into ';
  if (visual) visual.hidden = false;
  positionCaret();
  hero.dataset.enhanced = 'true';
  win.addEventListener?.('resize', positionCaret);
  doc.fonts?.addEventListener('loadingdone', positionCaret);

  function schedule(delay) {
    remaining = delay;
    if (doc.hidden || motion.matches) return;
    due = win.performance.now() + delay;
    timer = win.setTimeout(tick, delay);
  }
  function tick() {
    timer = undefined;
    if (phase === 'hold') phase = 'delete';
    if (phase === 'delete') {
      paint(text.textContent.slice(0, -1));
      if (text.textContent) schedule(config.deleteMs);
      else { phase = 'gap'; schedule(config.gapMs); }
      return;
    }
    if (phase === 'gap') {
      index++;
      if (index === cycle.length) { cycle = phraseCycle(config.phrases); index = 0; }
      phase = 'type';
    }
    paint(cycle[index].slice(0, text.textContent.length + 1));
    if (text.textContent === cycle[index]) { phase = 'hold'; schedule(config.holdMs); }
    else schedule(config.typeMs);
  }
  function visibility() {
    hero.dataset.paused = String(doc.hidden);
    if (doc.hidden) {
      if (timer !== undefined) remaining = Math.max(0, due - win.performance.now());
      win.clearTimeout(timer); timer = undefined;
    } else if (timer === undefined) schedule(remaining);
  }
  function preference() {
    win.clearTimeout(timer); timer = undefined;
    cycle = phraseCycle(config.phrases); index = 0; phase = 'hold';
    paint(config.phrases[0]);
    schedule(config.holdMs);
  }
  doc.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', preference);
  visibility();
  return () => {
    win.clearTimeout(timer);
    doc.removeEventListener('visibilitychange', visibility);
    win.removeEventListener?.('resize', positionCaret);
    doc.fonts?.removeEventListener('loadingdone', positionCaret);
    motion.removeEventListener('change', preference);
  };
}
