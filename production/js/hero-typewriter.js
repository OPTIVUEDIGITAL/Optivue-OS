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
  const doc = hero.ownerDocument;
  const win = doc.defaultView;
  const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
  let cycle = phraseCycle(config.phrases), index = 0, phase = 'hold';
  let timer, due = 0, remaining = config.holdMs;
  text.textContent = config.phrases[0];
  hero.dataset.enhanced = 'true';

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
      text.textContent = text.textContent.slice(0, -1);
      if (text.textContent) schedule(config.deleteMs);
      else { phase = 'gap'; schedule(config.gapMs); }
      return;
    }
    if (phase === 'gap') {
      index++;
      if (index === cycle.length) { cycle = phraseCycle(config.phrases); index = 0; }
      phase = 'type';
    }
    text.textContent = cycle[index].slice(0, text.textContent.length + 1);
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
    text.textContent = config.phrases[0];
    schedule(config.holdMs);
  }
  doc.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', preference);
  visibility();
  return () => {
    win.clearTimeout(timer);
    doc.removeEventListener('visibilitychange', visibility);
    motion.removeEventListener('change', preference);
  };
}
