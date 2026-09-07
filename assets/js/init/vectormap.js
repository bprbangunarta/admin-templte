// jsVectorMap — auto-init: <div class="js-vectormap" data-markers='[["Kota",lat,lng], ...]'></div>
// Opsi: data-map="world" (default). Theme-aware (dibangun ulang saat tema berganti).
(function () {
  function build() {
    if (!window.jsVectorMap) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.js-vectormap').forEach(function (el) {
      if (el._vm) { try { el._vm.destroy(); } catch (e) {} el.innerHTML = ''; }
      var markers = [];
      try { markers = JSON.parse(el.getAttribute('data-markers') || '[]'); } catch (e) {}
      el._vm = new jsVectorMap({
        selector: el, map: el.getAttribute('data-map') || 'world',
        zoomButtons: true, backgroundColor: 'transparent',
        regionStyle: { initial: { fill: dark ? '#3a3832' : '#dcd9cf' }, hover: { fill: '#d97757' } },
        markerStyle: { initial: { fill: '#d97757', stroke: '#fff', 'stroke-width': 1.5, r: 5 } },
        markers: markers.map(function (m) { return { name: m[0], coords: [m[1], m[2]] }; })
      });
    });
  }
  document.addEventListener('ui:ready', build);
  new MutationObserver(build).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
