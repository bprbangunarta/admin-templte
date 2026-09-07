// ApexCharts — helper tema. Data tetap di halaman; boilerplate tema di sini.
// Pakai: ApexTheme.onReady(function (v) { ...bangun chart pakai v.accent, v.dark, dll... });
window.ApexTheme = {
  vars: function () {
    var s = getComputedStyle(document.documentElement);
    return {
      dark:   document.documentElement.getAttribute('data-theme') === 'dark',
      text:   s.getPropertyValue('--text-muted').trim(),
      border: s.getPropertyValue('--border').trim(),
      accent: s.getPropertyValue('--accent').trim(),
      green:  s.getPropertyValue('--green').trim(),
      amber:  s.getPropertyValue('--amber').trim(),
      red:    s.getPropertyValue('--red').trim(),
      blue:   s.getPropertyValue('--blue').trim(),
      muted:  (document.documentElement.getAttribute('data-theme') === 'dark') ? '#4a4740' : '#cdc9bf'
    };
  },
  // jalankan build saat siap + bangun ulang ketika tema berganti
  onReady: function (build) {
    var run = function () { if (window.ApexCharts) build(window.ApexTheme.vars()); };
    document.addEventListener('ui:ready', run);
    new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
};
