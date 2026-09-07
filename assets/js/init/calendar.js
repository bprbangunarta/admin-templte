// Kalender bulanan — auto-init: <div class="js-calendar"
//   data-month="2026-09" data-today="2026-09-07"
//   data-events='{"2026-09-07":[{"t":"Rapat","c":"blue"}]}'>
// Di dalamnya: [data-cal-title], [data-cal-grid], [data-cal-prev], [data-cal-next]
document.addEventListener('ui:ready', function () {
  var dow = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var pad = function (n) { return String(n).padStart(2, '0'); };

  document.querySelectorAll('.js-calendar').forEach(function (root) {
    var events = {};
    try { events = JSON.parse(root.getAttribute('data-events') || '{}'); } catch (e) {}
    var today = root.getAttribute('data-today') || '';
    var titleEl = root.querySelector('[data-cal-title]');
    var gridEl = root.querySelector('[data-cal-grid]');
    if (!gridEl) return;

    var cur;
    var m0 = root.getAttribute('data-month');
    if (m0) { var p = m0.split('-'); cur = new Date(+p[0], +p[1] - 1, 1); }
    else { var n = new Date(); cur = new Date(n.getFullYear(), n.getMonth(), 1); }

    function render() {
      var y = cur.getFullYear(), m = cur.getMonth();
      if (titleEl) titleEl.textContent = months[m] + ' ' + y;
      var start = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      var prev = new Date(y, m, 0).getDate();
      var html = '';
      dow.forEach(function (d) { html += '<div class="cal-dow">' + d + '</div>'; });
      for (var i = 0; i < 42; i++) {
        var num, cls = 'cal-cell', date = '', other = false;
        if (i < start) { num = prev - start + 1 + i; other = true; }
        else if (i >= start + days) { num = i - (start + days) + 1; other = true; }
        else { num = i - start + 1; date = y + '-' + pad(m + 1) + '-' + pad(num); }
        if (other) cls += ' other';
        var evs = (!other && events[date]) || [];
        if (!other && date === today) cls += ' today';
        if (evs.length) cls += ' has-ev';
        html += '<div class="' + cls + '"><div class="num">' + num + '</div>';
        evs.forEach(function (e) { html += '<div class="cal-ev ' + (e.c || '') + '">' + e.t + '</div>'; });
        html += '</div>';
      }
      gridEl.innerHTML = html;
    }

    var prevBtn = root.querySelector('[data-cal-prev]'), nextBtn = root.querySelector('[data-cal-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { cur.setMonth(cur.getMonth() - 1); render(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { cur.setMonth(cur.getMonth() + 1); render(); });
    render();
  });
});
