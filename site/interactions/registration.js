export function startRegistration(threshold) {
  const field = threshold.querySelector('.visitor-targets');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const marks = new Map();
  const occupied = 'a, button, input, select, textarea, label, [role="button"], .index-notations, .sheet-audio';
  let origin = null;

  function remove(mark) {
    clearTimeout(marks.get(mark));
    marks.delete(mark);
    mark.remove();
  }

  threshold.addEventListener('pointerdown', (event) => {
    origin = event.isPrimary && event.button === 0 && !event.target.closest(occupied)
      ? { x: event.clientX, y: event.clientY } : null;
  }, options);
  threshold.addEventListener('pointercancel', () => { origin = null; }, options);
  threshold.addEventListener('click', (event) => {
    const start = origin;
    origin = null;
    if (!start || event.detail === 0 || event.button !== 0 || event.target.closest(occupied)) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return;
    if (window.getSelection()?.isCollapsed === false) return;

    const bounds = threshold.getBoundingClientRect();
    const mark = document.createElement('span');
    mark.className = 'visitor-target';
    mark.textContent = '+';
    mark.style.left = `${(event.clientX - bounds.left) / bounds.width * 100}%`;
    mark.style.top = `${(event.clientY - bounds.top) / bounds.height * 100}%`;
    mark.style.setProperty('--target-gray', String(Math.round(185 + Math.random() * 55)));
    if (marks.size >= 6) remove(marks.keys().next().value);
    field.append(mark);
    marks.set(mark, setTimeout(() => remove(mark), 18000));
  }, options);

  return () => {
    controller.abort();
    for (const mark of marks.keys()) remove(mark);
    origin = null;
  };
}
