// Leaflet — auto-init peta interaktif.
// <div class="js-leaflet" data-center="-2.5,118" data-zoom="4" data-markers='[["Kota",lat,lng], ...]'></div>
//
// Basemap: Esri "Gray Canvas" — GRATIS & TANPA API KEY, boleh di-embed (cukup atribusi).
// Server tile resmi OSM (tile.openstreetmap.org) memblokir embed pihak ketiga
// ("Access blocked / 403"), dan CARTO kini butuh API key ("API KEY REQUIRED"),
// sehingga keduanya dihindari. Basemap otomatis mengikuti tema: terang / gelap.
document.addEventListener('ui:ready', function () {
  if (!window.L) return;

  var ATTR = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>';
  function tileUrl() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/' +
      (dark ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base') +
      '/MapServer/tile/{z}/{y}/{x}';
  }

  document.querySelectorAll('.js-leaflet').forEach(function (el) {
    if (el._lm) return;
    var c = (el.getAttribute('data-center') || '-2.5,118').split(',').map(Number);
    var z = parseInt(el.getAttribute('data-zoom') || '4', 10);
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    var map = L.map(el).setView([c[0], c[1]], z);
    var tiles = L.tileLayer(tileUrl(), { maxZoom: 16, attribution: ATTR }).addTo(map);

    var markers = [];
    try { markers = JSON.parse(el.getAttribute('data-markers') || '[]'); } catch (e) {}
    markers.forEach(function (m) {
      L.circleMarker([m[1], m[2]], { radius: 7, color: '#fff', weight: 2, fillColor: accent, fillOpacity: 1 }).addTo(map).bindPopup('<b>' + m[0] + '</b>');
    });

    // ganti basemap saat tema berubah (light <-> dark)
    new MutationObserver(function () { tiles.setUrl(tileUrl()); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    el._lm = map;
    setTimeout(function () { map.invalidateSize(); }, 200);
  });
});
