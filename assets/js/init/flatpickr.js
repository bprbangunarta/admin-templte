// flatpickr — auto-init: <input data-flatpickr> (opsi: data-mode="range", data-format="d/m/Y")
document.addEventListener('ui:ready', function () {
  if (!window.flatpickr) return;
  document.querySelectorAll('[data-flatpickr]').forEach(function (el) {
    flatpickr(el, { mode: el.getAttribute('data-mode') || 'single', dateFormat: el.getAttribute('data-format') || 'd/m/Y' });
  });
});
