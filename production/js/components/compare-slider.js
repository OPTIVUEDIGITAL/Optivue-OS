class OptivueCompare extends HTMLElement {
  static get observedAttributes() {
    return ['start', 'label-before', 'label-after'];
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.render();
    this.bind();
    this.setPosition(this.initialPosition());
  }

  attributeChangedCallback() {
    if (!this.isConnected || !this.shadowRoot) return;
    this.render();
    this.bind();
    this.setPosition(this.initialPosition());
  }

  initialPosition() {
    const raw = Number(this.getAttribute('start'));
    return Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 50;
  }

  render() {
    const before = this.getAttribute('label-before') || 'Before';
    const after = this.getAttribute('label-after') || 'After';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --position: 50%;
          font-family: Inter, Arial, sans-serif;
        }
        .frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 8 / 5;
          background: #101316;
          touch-action: none;
          user-select: none;
        }
        :host([ratio="portrait"]) .frame {
          aspect-ratio: 4 / 3;
        }
        .before,
        .after {
          position: absolute;
          inset: 0;
        }
        .after {
          clip-path: inset(0 0 0 var(--position));
        }
        ::slotted(img) {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .divider {
          position: absolute;
          z-index: 5;
          top: 0;
          bottom: 0;
          left: var(--position);
          width: 2px;
          background: rgba(245,247,250,.9);
          transform: translateX(-1px);
          pointer-events: none;
        }
        .handle {
          position: absolute;
          z-index: 6;
          top: 50%;
          left: var(--position);
          width: 46px;
          height: 46px;
          border: 2px solid #f5f7fa;
          border-radius: 50%;
          background: #101316;
          color: #f5f7fa;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 3px rgba(76,141,255,.8);
          cursor: ew-resize;
        }
        .handle:focus-visible {
          outline: 3px solid #4c8dff;
          outline-offset: 4px;
        }
        .handle span {
          font-size: 22px;
          line-height: 1;
          transform: translateY(-1px);
        }
        .label {
          position: absolute;
          z-index: 4;
          top: 16px;
          padding: 8px 10px;
          border-radius: 3px;
          background: rgba(9,10,12,.82);
          color: #f5f7fa;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .02em;
        }
        .label.before-label { left: 16px; }
        .label.after-label { right: 16px; }
        @media (max-width: 760px) {
          .frame { aspect-ratio: 4 / 3; }
          .label { top: 10px; }
          .label.before-label { left: 10px; }
          .label.after-label { right: 10px; }
          .handle { width: 44px; height: 44px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .after, .divider, .handle { transition: none; }
        }
      </style>
      <div class="frame">
        <div class="before"><slot name="before"></slot></div>
        <div class="after"><slot name="after"></slot></div>
        <span class="label before-label">${before}</span>
        <span class="label after-label">${after}</span>
        <div class="divider" aria-hidden="true"></div>
        <div class="handle" role="slider" tabindex="0"
             aria-label="Compare ${before} and ${after}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
          <span aria-hidden="true">‹›</span>
        </div>
      </div>
    `;
  }

  bind() {
    const frame = this.shadowRoot.querySelector('.frame');
    const handle = this.shadowRoot.querySelector('.handle');
    if (!frame || !handle) return;

    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      const rect = frame.getBoundingClientRect();
      this.setPosition(((point.clientX - rect.left) / rect.width) * 100);
    };

    let dragging = false;
    frame.addEventListener('pointerdown', (event) => {
      dragging = true;
      if (frame.setPointerCapture) frame.setPointerCapture(event.pointerId);
      move(event);
    });
    frame.addEventListener('pointermove', (event) => {
      if (dragging) move(event);
    });
    frame.addEventListener('pointerup', () => { dragging = false; });
    frame.addEventListener('pointercancel', () => { dragging = false; });

    handle.addEventListener('keydown', (event) => {
      const current = Number(handle.getAttribute('aria-valuenow')) || 0;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.setPosition(current - 5);
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.setPosition(current + 5);
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.setPosition(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        this.setPosition(100);
      }
    });
  }

  setPosition(value) {
    const position = Math.min(100, Math.max(0, Number(value) || 0));
    this.style.setProperty('--position', position + '%');
    const handle = this.shadowRoot?.querySelector('.handle');
    if (handle) handle.setAttribute('aria-valuenow', String(Math.round(position)));
  }
}

if (!customElements.get('optivue-compare')) {
  customElements.define('optivue-compare', OptivueCompare);
}
