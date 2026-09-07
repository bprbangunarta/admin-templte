// Leaflet + OpenStreetMap — auto-init:
// <div class="js-leaflet" data-center="-2.5,118" data-zoom="4" data-markers='[["Kota",lat,lng], ...]'></div>
document.addEventListener('ui:ready', function () {
  if (!window.L) return;
  document.querySelectorAll('.js-leaflet').forEach(function (el) {
    if (el._lm) return;
    var c = (el.getAttribute('data-center') || '-2.5,118').split(',').map(Number);
    var z = parseInt(el.getAttribute('data-zoom') || '4', 10);
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    var map = L.map(el).setView([c[0], c[1]], z);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    var markers = [];
    try { markers = JSON.parse(el.getAttribute('data-markers') || '[]'); } catch (e) {}
    markers.forEach(function (m) {
      L.circleMarker([m[1], m[2]], { radius: 7, color: '#fff', weight: 2, fillColor: accent, fillOpacity: 1 }).addTo(map).bindPopup('<b>' + m[0] + '</b>');
    });
    el._lm = map;
    setTimeout(function () { map.invalidateSize(); }, 200);
  });
});
