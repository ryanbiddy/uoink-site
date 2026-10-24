// WEB-4 interactions using native scrolling and Web Animations.
(() => {
  const root = document.querySelector('.hero-story');
  if (!root) return;
  const all = (selector, parent = root) => [...parent.querySelectorAll(selector)];
  const one = (selector, parent = root) => parent.querySelector(selector);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let receipt = 'job', opener = null;
  const animations = new Set();
  const animate = (element, frames, options = {}) => {
    if (preference.matches || !element) return;
    const animation = element.animate(frames, { duration: 340, easing: 'cubic-bezier(.2,.7,.3,1)', ...options });
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  };
  const highlight = element => animate(element, [{ backgroundColor: '#FFF4EC' }, { backgroundColor: '#FFD23F' }]);
  const tabs = all('.tab-widget').map(widget => {
    const buttons = all('[role="tab"]', widget), panels = all('[role="tabpanel"]', widget);
    let selected = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
    const select = (index, focus = false) => {
      selected = index;
      buttons.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
      panels.forEach((panel, i) => { panel.hidden = !preference.matches && i !== index; });
      if (focus) buttons[index].focus();
      highlight(one('mark', panels[index]));
    };
    buttons.forEach((button, i) => {
      button.addEventListener('click', () => select(i));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        select(event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length, true);
      });
    });
    return () => select(selected);
  });
  function showReceipt(key, focus = false) {
    receipt = key;
    all('[data-receipt-card]').forEach(card => { card.hidden = !preference.matches && card.dataset.receiptCard !== key; });
    all('[data-receipt-select]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.receiptSelect === key)));
    const card = one(`[data-receipt-card="${key}"]`);
    highlight(one('mark', card));
    if (focus) { card.tabIndex = -1; card.focus({ preventScroll: true }); }
  }
  all('[data-receipt]').forEach(chip => chip.addEventListener('click', () => {
    opener = chip;
    showReceipt(chip.dataset.receipt, true);
    const back = one('.back-to-draft');
    back.href = chip.closest('.library-answer') ? '#u-scene-6' : chip.closest('.writing-studio') ? '#u-scene-7' : '#u-opening';
    // Both labels are exported in the content HTML.
    all('[data-return-label]', back).forEach(label => { label.hidden = (label.dataset.returnLabel === 'answer') !== !!chip.closest('.library-answer'); });
  }));
  all('[data-receipt-select]').forEach(button => button.addEventListener('click', () => showReceipt(button.dataset.receiptSelect)));
  all('[data-jump]').forEach(button => button.addEventListener('click', () => {
    const line = one(`#receipt-line-${button.dataset.jump}`);
    line.focus({ preventScroll: true }); highlight(one('mark', line));
  }));
  one('.back-to-draft').addEventListener('click', () => requestAnimationFrame(() => opener?.focus({ preventScroll: true })));
  const answer = () => animate(one('.library-answer'), [{ opacity: .25, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }]);
  one('#ask-library').addEventListener('click', answer);
  function enter(scene) {
    const calendar = one('.relative-calendar', scene);
    if (calendar) {
      const back = calendar.dataset.direction === 'back';
      animate(one('.time-reel-strip', calendar), [{ transform: `translateY(${back ? -96 : 0}px)` }, { transform: `translateY(${back ? 0 : -96}px)` }], { duration: 380 });
    }
    all('.source-entry', scene).forEach((card, i) => animate(card, [{ opacity: .2, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { delay: i * 100 }));
    if (scene.classList.contains('magnet-scene')) {
      all('.pull-source', scene).forEach((card, i) => {
        animate(card, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-112 - i * 48}px) scale(.025)` }], { delay: i * 460, fill: 'backwards' });
        animate(one('.story-magnet', scene), [{ transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 320, delay: i * 460 + 300 });
      });
      all('.source-receipt', scene).forEach((row, i) => animate(row, [{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'none' }], { delay: i * 460 + 340, duration: 240, fill: 'backwards' }));
    }
    if (scene.classList.contains('ask-scene')) answer();
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= .2) enter(entry.target);
    else for (const animation of animations) if (entry.target.contains(animation.effect?.target)) animation.cancel();
  }), { threshold: [.0, .2] });
  function refresh() {
    animations.forEach(animation => animation.cancel());
    root.classList.toggle('no-motion', preference.matches);
    tabs.forEach(refreshTab => refreshTab()); showReceipt(receipt);
    observer.disconnect();
    if (!preference.matches) all('.scene-sticky').forEach(scene => observer.observe(scene));
  }
  root.classList.add('enhanced');
  refresh(); preference.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', () => { if (document.hidden) animations.forEach(animation => animation.cancel()); });
})();
