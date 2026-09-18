/**
 * Optivue Spotlight Card
 * Framework-independent Web Component adapted from the supplied Wix custom element.
 */
const RING_SIZE = { normal: 460, featured: 500 };
const INTENSITY = { normal: 0.35, featured: 0.5 };
const LIGHT_BORDER = 'rgba(16,17,20,0.08)';
const DARK_BORDER = 'rgba(255,255,255,0.10)';
const LIGHT_RING = '23,23,23';
const DARK_RING = '255,255,255';

class OptivueSpotlightCard extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._onMove = this._onMove.bind(this);
    this._onLeave = this._onLeave.bind(this);
  }

  static get observedAttributes() { return ['bg', 'featured', 'theme']; }

  connectedCallback() {
    this._render();
    this.addEventListener('pointermove', this._onMove);
    this.addEventListener('pointerleave', this._onLeave);
  }

  disconnectedCallback() {
    this.removeEventListener('pointermove', this._onMove);
    this.removeEventListener('pointerleave', this._onLeave);
  }

  attributeChangedCallback() {
    if (this._root.firstChild) this._render();
  }

  _onMove(event) {
    const rect = this.getBoundingClientRect();
    this.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    this.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }

  _onLeave() {
    this.style.setProperty('--spot-x', '-9999px');
    this.style.setProperty('--spot-y', '-9999px');
  }

  _render() {
    const featured = this.getAttribute('featured') === 'true';
    const theme = this.getAttribute('theme') === 'light' ? 'light' : 'dark';
    const bg = this.getAttribute('bg') || (theme === 'light' ? '#FFFFFF' : '#121417');
    const size = featured ? RING_SIZE.featured : RING_SIZE.normal;
    const intensity = featured ? INTENSITY.featured : INTENSITY.normal;
    const border = theme === 'light' ? LIGHT_BORDER : DARK_BORDER;
    const ringRGB = theme === 'light' ? LIGHT_RING : DARK_RING;
    const accentBorder = featured ? (theme === 'light' ? '#176BFF' : '#4C8DFF') : border;

    this._root.innerHTML = `
      <style>
        :host{--spot-x:-9999px;--spot-y:-9999px;display:block;position:absolute;inset:0;border-radius:18px;background:${bg};border:1px solid ${accentBorder};overflow:hidden;pointer-events:none}
        .ring{position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle ${size}px at var(--spot-x) var(--spot-y),rgba(${ringRGB},${intensity}),transparent 60%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px}
      </style>
      <div class="ring"></div>`;
  }
}

if (!customElements.get('optivue-spotlight-card')) {
  customElements.define('optivue-spotlight-card', OptivueSpotlightCard);
}
