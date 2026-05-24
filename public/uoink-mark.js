// Uoink — magnet-U web component, size-aware tip colour.
// At rendered width <=32px, tips are CREAM (high luminance contrast on dark Chrome).
// Above 32px, tips are ACID yellow (the brand kick).
(function () {
  if (customElements.get('uoink-mark')) return;
  const PATH = 'M 0 0 L 32 0 L 32 60 L 68 60 L 68 0 L 100 0 L 100 80 Q 100 100 80 100 L 20 100 Q 0 100 0 80 Z';
  class UoinkMark extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered) return;
      this.dataset.rendered = '1';
      this.innerHTML =
        '<svg viewBox="0 0 100 100" aria-label="Uoink" role="img">' +
          '<path class="u-body" d="' + PATH + '"></path>' +
          // large variant — slim acid tips (14% glyph height)
          '<rect class="u-tip-l" x="0"  y="0" width="32" height="14"></rect>' +
          '<rect class="u-tip-l" x="68" y="0" width="32" height="14"></rect>' +
          // small variant — thicker cream tips (20% glyph height) for favicon legibility
          '<rect class="u-tip-s" x="0"  y="0" width="32" height="20"></rect>' +
          '<rect class="u-tip-s" x="68" y="0" width="32" height="20"></rect>' +
        '</svg>';
      this._update();
      if ('ResizeObserver' in window) {
        this._ro = new ResizeObserver(() => this._update());
        this._ro.observe(this);
      } else {
        window.addEventListener('resize', () => this._update());
      }
    }
    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
    }
    _update() {
      const w = this.getBoundingClientRect().width;
      this.setAttribute('data-size', w <= 32 ? 'small' : 'large');
    }
  }
  customElements.define('uoink-mark', UoinkMark);
})();
