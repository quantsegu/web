/* UI helpers: animations, toast, count-up */

function showToast(message, duration = 2800) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), duration);
}

function animateCount(el, target, duration = 700, decimals = 0, suffix = '') {
  if (!el) return;
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = from + (target - from) * eased;
    el.textContent = val.toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(frame);
}

function formatChf(n) {
  return `CHF ${Math.round(n).toLocaleString('de-CH')}`;
}

function setSearchStatus(state) {
  const el = document.getElementById('search-status');
  if (!el) return;
  el.className = 'search-status';
  el.textContent = '';
  if (state === 'loading') el.classList.add('loading');
  else if (state === 'ok') { el.classList.add('ok'); el.textContent = '✓'; }
  else if (state === 'err') { el.classList.add('err'); el.textContent = '✗'; }
}

window.SwissTaxUI = {
  showToast,
  animateCount,
  formatChf,
  setSearchStatus,
};
