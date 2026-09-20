export function startApparatus(root) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const setups = [...root.querySelectorAll('[data-apparatus]')].map(section => {
    const field = section.querySelector('.apparatus-field');
    const buttons = [...section.querySelectorAll('[data-detail]')];
    const panels = [...section.querySelectorAll('[data-apparatus-panel]')];
    const reset = section.querySelector('.apparatus-reset');
    const status = section.querySelector('[role="status"]');
    let pinned = null;
    let current = 'overview';

    function show(id) {
      const selected = panels.find(panel => panel.dataset.apparatusPanel === id);
      if (!selected) return;
      if (id !== current) {
        for (const video of section.querySelectorAll('video')) video.pause();
      }
      current = id;
      const illuminated = (selected.dataset.nodes || '').split(' ');
      for (const panel of panels) panel.hidden = panel !== selected;
      for (const button of buttons) {
        button.classList.toggle('is-dim', id !== 'overview' && !illuminated.includes(button.dataset.node));
        button.classList.toggle('is-current', id !== 'overview' && button.dataset.detail === id);
        button.setAttribute('aria-pressed', String(button.dataset.detail === pinned));
      }
      reset.setAttribute('aria-pressed', String(id === 'overview'));
    }

    for (const button of buttons) {
      button.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'touch' && !pinned) show(button.dataset.detail);
      }, options);
      button.addEventListener('focus', () => { if (!pinned) show(button.dataset.detail); }, options);
      button.addEventListener('click', () => {
        pinned = button.dataset.detail;
        show(pinned);
        status.textContent = `${button.textContent.trim()} selected. Related material follows the apparatus.`;
      }, options);
    }
    field.addEventListener('pointerleave', () => {
      if (!pinned && !field.contains(document.activeElement)) show('overview');
    }, options);
    field.addEventListener('focusout', event => {
      if (!pinned && !section.contains(event.relatedTarget)) show('overview');
    }, options);
    function clear() {
      pinned = null;
      show('overview');
      status.textContent = 'Whole apparatus.';
    }
    reset.addEventListener('click', clear, options);
    section.addEventListener('keydown', event => {
      if (event.key === 'Escape') { clear(); reset.focus({ preventScroll: true }); }
    }, options);
    show('overview');
    return { section, keep: () => { if (current !== 'overview') { pinned = current; show(current); } } };
  });

  root.addEventListener('play', event => {
    if (!(event.target instanceof HTMLVideoElement)) return;
    for (const video of root.querySelectorAll('video')) if (video !== event.target) video.pause();
    for (const setup of setups) if (setup.section.contains(event.target)) setup.keep();
  }, { ...options, capture: true });

  return () => {
    controller.abort();
    for (const video of root.querySelectorAll('video')) {
      video.pause();
      video.removeAttribute('src');
      for (const source of video.querySelectorAll('source')) source.removeAttribute('src');
      video.load();
    }
  };
}
