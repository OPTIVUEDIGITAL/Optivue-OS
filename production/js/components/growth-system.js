/**
 * Optivue Growth System
 * Framework-independent Web Component adapted from the supplied Wix custom element.
 * Works in hosted production builds and can also be registered inside Wix.
 */
const TOKENS = {
  dark: {
    bg: '#090A0C',
    nodeFill: 'rgba(23, 26, 32, 0.72)',
    nodeBorder: 'rgba(255,255,255,0.10)',
    line: 'rgba(255,255,255,0.10)',
    blue: '#4C8DFF',
    green: '#34D399',
    violet: '#8B83FF',
    label: '#9CA3AF',
    labelStrong: '#F5F7FA',
  },
  light: {
    bg: '#F7F8FA',
    nodeFill: 'rgba(255,255,255,0.86)',
    nodeBorder: 'rgba(16,17,20,0.08)',
    line: 'rgba(16,17,20,0.12)',
    blue: '#176BFF',
    green: '#10A66A',
    violet: '#625BF6',
    label: '#60646C',
    labelStrong: '#101114',
  },
};

const NODES = [
  { id: 'traffic',   x: 130, y: 210, w: 186, label: 'Traffic / Ads',     meta: 'SEARCH + PAID',   tier: 1 },
  { id: 'landing',   x: 170, y: 640, w: 196, label: 'Website / Landing', meta: 'CONVERSION',      tier: 1 },
  { id: 'capture',   x: 420, y: 420, w: 176, label: 'Lead Capture',      meta: 'FORMS + BOOKING', tier: 1 },
  { id: 'qualify',   x: 600, y: 206, w: 190, label: 'Qualification',     meta: 'SCORING',         tier: 2 },
  { id: 'crm',       x: 660, y: 606, w: 166, label: 'CRM',               meta: 'PIPELINE',        tier: 1 },
  { id: 'automate',  x: 840, y: 400, w: 196, label: 'Automation',        meta: 'EMAIL + SMS',     tier: 2 },
  { id: 'pipeline',  x: 900, y: 172, w: 180, label: 'Sales Pipeline',    meta: 'STAGES',          tier: 2 },
  { id: 'customer',  x: 930, y: 620, w: 156, label: 'Customer',          meta: 'WON',             tier: 1 },
  { id: 'analytics', x: 520, y: 790, w: 176, label: 'Analytics',         meta: 'GA4 + GTM',       tier: 1 },
];

const EDGES = [
  ['traffic', 'capture'],
  ['landing', 'capture'],
  ['capture', 'qualify'],
  ['qualify', 'crm'],
  ['crm', 'automate'],
  ['automate', 'pipeline'],
  ['automate', 'customer'],
  ['pipeline', 'customer'],
  ['customer', 'analytics'],
  ['analytics', 'traffic'],
];

const NODE_H = 62;
const EASE = (t) => 1 - Math.pow(1 - t, 3);

class OptivueGrowthSystem extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._progress = 0;
    this._target = 0;
    this._raf = null;
    this._visible = false;
    this._pointer = { x: 0, y: 0 };
    this._reduced = false;
    this._onScroll = this._onScroll.bind(this);
    this._onPointer = this._onPointer.bind(this);
    this._tick = this._tick.bind(this);
  }

  static get observedAttributes() { return ['theme', 'density']; }

  connectedCallback() {
    this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._render();
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries[0].isIntersecting;
      if (this._visible) this._start(); else this._stop();
    }, { threshold: 0 });
    this._io.observe(this);
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onScroll, { passive: true });
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch && !this._reduced) {
      window.addEventListener('pointermove', this._onPointer, { passive: true });
    }
    this._onScroll();
    if (this._reduced) {
      this._progress = 1;
      this._target = 1;
      this._paint();
    }
  }

  disconnectedCallback() {
    this._stop();
    this._io?.disconnect();
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onScroll);
    window.removeEventListener('pointermove', this._onPointer);
  }

  attributeChangedCallback(name) {
    if (!this._root.firstChild) return;
    if (name === 'theme') this._applyTheme();
  }

  get _theme() { return this.getAttribute('theme') === 'light' ? 'light' : 'dark'; }

  _onScroll() {
    const rect = this.getBoundingClientRect();
    const travel = rect.height || window.innerHeight;
    const raw = travel > 0 ? -rect.top / travel : 0;
    this._target = 0.18 + Math.min(1, Math.max(0, raw)) * 0.82;
    if (this._reduced) this._target = 1;
  }

  _onPointer(event) {
    this._pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    this._pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  _start() {
    if (!this._raf && !this._reduced) this._raf = requestAnimationFrame(this._tick);
  }

  _stop() {
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }

  _tick() {
    this._progress += (this._target - this._progress) * 0.12;
    this._paint();
    this._raf = requestAnimationFrame(this._tick);
  }

  _render() {
    const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node]));
    const center = (node) => ({ x: node.x + node.w / 2, y: node.y + NODE_H / 2 });

    const edges = EDGES.map(([a, b], index) => {
      const A = center(nodeMap[a]);
      const B = center(nodeMap[b]);
      const mx = (A.x + B.x) / 2;
      const loop = a === 'analytics' ? ' edge--loop' : '';
      return `<path class="edge${loop}" data-i="${index}" d="M ${A.x} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${B.x} ${B.y}" />`;
    }).join('');

    const nodes = NODES.map((node) => `
      <g class="node" data-id="${node.id}" data-tier="${node.tier}" transform="translate(${node.x} ${node.y})">
        <rect class="node__bg" width="${node.w}" height="${NODE_H}" rx="10" />
        <circle class="node__dot" cx="16" cy="22" r="3.5" />
        <text class="node__label" x="30" y="26">${node.label}</text>
        <text class="node__meta" x="16" y="46">${node.meta}</text>
      </g>`).join('');

    this._root.innerHTML = `
      <style>
        :host {
          display:block; position:relative; width:100%; height:100%; min-height:420px;
          overflow:hidden; background:var(--o-bg);
          --o-bg:#090A0C; --o-node-fill:rgba(23,26,32,.72);
          --o-node-border:rgba(255,255,255,.10); --o-line:rgba(255,255,255,.10);
          --o-blue:#4C8DFF; --o-green:#34D399; --o-violet:#8B83FF;
          --o-label:#9CA3AF; --o-label-strong:#F5F7FA;
        }
        .wrap{position:absolute;inset:0}.grid line{stroke:var(--o-line);stroke-width:1;opacity:.35}
        svg{width:100%;height:100%;display:block}.edge{fill:none;stroke:var(--o-line);stroke-width:1.5;stroke-linecap:round}
        .edge--active{stroke:var(--o-blue);stroke-width:1.75}.edge--loop.edge--active{stroke:var(--o-violet)}
        .node__bg{fill:var(--o-node-fill);stroke:var(--o-node-border);stroke-width:1}
        .node__dot{fill:var(--o-label)}.node--connected .node__dot{fill:var(--o-green)}
        .node__label{fill:var(--o-label-strong);font:500 var(--ovgo-type-lede,18px) Inter,system-ui,sans-serif}
        .node__meta{fill:var(--o-label);font:500 var(--ovgo-type-xs,12px) Inter,system-ui,sans-serif;letter-spacing:.02em}
        .node{opacity:.55}.node--connected{opacity:1}
        :host([density="reduced"]) .node[data-tier="2"]{display:none}
        .scrim{position:absolute;inset:0;pointer-events:none;background:
          linear-gradient(to right,transparent 0%,transparent 44%,color-mix(in srgb,var(--o-bg) 55%,transparent) 70%,color-mix(in srgb,var(--o-bg) 88%,transparent) 100%),
          linear-gradient(to bottom,color-mix(in srgb,var(--o-bg) 45%,transparent) 0%,transparent 24%,transparent 76%,color-mix(in srgb,var(--o-bg) 60%,transparent) 100%)}
        @media(max-width:720px){.scrim{background:linear-gradient(to bottom,color-mix(in srgb,var(--o-bg) 50%,transparent) 0%,color-mix(in srgb,var(--o-bg) 20%,transparent) 28%,color-mix(in srgb,var(--o-bg) 82%,transparent) 100%)}}
      </style>
      <div class="wrap">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g class="grid">
            ${Array.from({length:9},(_,i)=>`<line x1="0" y1="${i*112}" x2="1600" y2="${i*112}" />`).join('')}
            ${Array.from({length:11},(_,i)=>`<line x1="${i*160}" y1="0" x2="${i*160}" y2="900" />`).join('')}
          </g>
          <g class="layer-edges">${edges}</g>
          <g class="layer-nodes">${nodes}</g>
        </svg>
        <div class="scrim"></div>
      </div>`;

    this._edges = [...this._root.querySelectorAll('.edge')];
    this._nodeEls = [...this._root.querySelectorAll('.node')];
    this._edgeLayer = this._root.querySelector('.layer-edges');
    this._nodeLayer = this._root.querySelector('.layer-nodes');

    this._edges.forEach((path) => {
      const len = path.getTotalLength();
      path.dataset.len = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    this._applyTheme();
    this._paint();
  }

  _applyTheme() {
    const token = TOKENS[this._theme];
    Object.entries({
      '--o-bg': token.bg,
      '--o-node-fill': token.nodeFill,
      '--o-node-border': token.nodeBorder,
      '--o-line': token.line,
      '--o-blue': token.blue,
      '--o-green': token.green,
      '--o-violet': token.violet,
      '--o-label': token.label,
      '--o-label-strong': token.labelStrong,
    }).forEach(([name, value]) => this.style.setProperty(name, value));
  }

  _paint() {
    if (!this._edges) return;
    const progress = EASE(Math.min(1, Math.max(0, this._progress)));
    const connected = new Set();
    this._edges.forEach((path, index) => {
      const start = index / this._edges.length * 0.92;
      const end = start + (1 / this._edges.length) * 1.25;
      const local = Math.min(1, Math.max(0, (progress - start) / (end - start)));
      const len = Number(path.dataset.len);
      path.style.strokeDashoffset = len * (1 - local);
      path.classList.toggle('edge--active', local > 0.02);
      if (local > 0.75) {
        const [a, b] = EDGES[index];
        connected.add(a); connected.add(b);
      }
    });

    this._nodeEls.forEach((element) => {
      element.classList.toggle('node--connected', connected.has(element.dataset.id));
    });

    if (this._edgeLayer) {
      this._edgeLayer.setAttribute('transform', `translate(${this._pointer.x * 9} ${this._pointer.y * 7})`);
      this._nodeLayer.setAttribute('transform', `translate(${this._pointer.x * 14} ${this._pointer.y * 11})`);
    }
  }
}

if (!customElements.get('optivue-growth-system')) {
  customElements.define('optivue-growth-system', OptivueGrowthSystem);
}
