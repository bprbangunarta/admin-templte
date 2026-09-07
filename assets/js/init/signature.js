// signature_pad — auto-init: <canvas class="js-signature"></canvas>
// Tombol bersihkan opsional: .sig-clear di dalam .sig-pad induk
document.addEventListener('ui:ready', function () {
  if (!window.SignaturePad) return;
  document.querySelectorAll('.js-signature').forEach(function (cv) {
    function fit() {
      var r = window.devicePixelRatio || 1;
      cv.width = cv.offsetWidth * r;
      cv.height = (cv.offsetHeight || 180) * r;
      cv.getContext('2d').scale(r, r);
    }
    fit();
    var sp = new SignaturePad(cv, { penColor: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() });
    cv._sp = sp;
    window.addEventListener('resize', function () { fit(); sp.clear(); });
    var pad = cv.closest('.sig-pad');
    var clr = pad && pad.querySelector('.sig-clear');
    if (clr) clr.addEventListener('click', function () { sp.clear(); });
  });
});
