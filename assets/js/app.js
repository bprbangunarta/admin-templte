// ============================================================
// Admin Template — interaksi bersama (HTML statis, tanpa build)
// ============================================================
// Struktur (sidebar/topbar/submenu) ditulis langsung di tiap halaman — pola
// AdminLTE. Menu aktif & grup terbuka ditandai dgn class `active`/`open` di
// markup halaman itu sendiri (bukan JS). Di Laravel: jadikan partial Blade &
// render class-nya dgn @class(['active' => request()->routeIs('...')]).
(function () {

  /* Toast global: toast('pesan', { type:'success', title:'Judul', timeout:3500 }) */
  function toast(msg, opts) {
    opts = opts || {};
    const type = opts.type || 'info';
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const icons = { success: 'check-circle', danger: 'x-circle', warning: 'alert-triangle', info: 'info' };
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML =
      '<span class="t-ic"><i data-lucide="' + (icons[type] || 'info') + '"></i></span>' +
      '<div class="t-body">' + (opts.title ? '<div class="t-title">' + opts.title + '</div>' : '') +
      '<div class="t-msg">' + msg + '</div></div>' +
      '<button class="t-close" aria-label="Tutup">&times;</button>';
    wrap.appendChild(el);
    if (window.lucide) lucide.createIcons();
    const remove = () => { el.style.opacity = '0'; el.style.transform = 'translateX(12px)'; setTimeout(() => el.remove(), 180); };
    el.querySelector('.t-close').addEventListener('click', remove);
    if (opts.timeout !== 0) setTimeout(remove, opts.timeout || 3500);
    return el;
  }
  window.toast = toast;

  /* Pasang seluruh interaksi (setelah partial ter-inject) */
  function initUI() {
    const app      = document.querySelector('.app');
    const menuBtn  = document.getElementById('menuBtn');
    const backdrop = document.getElementById('backdrop');
    const trigger  = document.getElementById('profileTrigger');
    const profMenu = document.getElementById('profileMenu');
    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    // state awal: mobile = drawer tertutup; desktop = pulihkan mode mini bila tersimpan
    if (isMobile()) app.classList.add('collapsed');
    else if (localStorage.getItem('sidebar') === 'mini') app.classList.add('mini');

    // tombol menu: desktop → ciutkan jadi rail ikon (mini); mobile → buka/tutup drawer
    if (menuBtn) menuBtn.addEventListener('click', () => {
      if (isMobile()) { app.classList.toggle('collapsed'); }
      else {
        app.classList.toggle('mini');
        try { localStorage.setItem('sidebar', app.classList.contains('mini') ? 'mini' : 'full'); } catch (e) {}
      }
    });
    if (backdrop) backdrop.addEventListener('click', () => app.classList.add('collapsed'));

    // grup menu buka/tutup (konsisten dgn .tree: pakai class .open)
    document.querySelectorAll('.nav-section').forEach(h =>
      h.addEventListener('click', () => {
        const open = h.closest('.nav-group').classList.toggle('open');
        h.setAttribute('aria-expanded', String(open));
      }));

    // multi-level tree
    document.querySelectorAll('.tree-toggle, .tree > .sub-item').forEach(t =>
      t.addEventListener('click', e => {
        e.stopPropagation();
        const open = t.closest('.tree').classList.toggle('open');
        t.setAttribute('aria-expanded', String(open));
      }));

    // menu profil
    if (trigger && profMenu) {
      const syncProf = () => trigger.setAttribute('aria-expanded', String(profMenu.classList.contains('open')));
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.addEventListener('click', e => { e.stopPropagation(); profMenu.classList.toggle('open'); syncProf(); });
      document.addEventListener('click', e => {
        if (!profMenu.contains(e.target) && !trigger.contains(e.target)) { profMenu.classList.remove('open'); syncProf(); }
      });
    }

    // dropdown notifikasi
    const notifBtn = document.getElementById('notifBtn');
    const notifPop = document.getElementById('notifPop');
    if (notifBtn && notifPop) {
      const setN = open => { notifPop.hidden = !open; notifBtn.setAttribute('aria-expanded', String(open)); };
      notifBtn.addEventListener('click', e => { e.stopPropagation(); setN(notifPop.hidden); });
      document.addEventListener('click', e => { if (!notifPop.contains(e.target) && !notifBtn.contains(e.target)) setN(false); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !notifPop.hidden) { setN(false); notifBtn.focus(); } });
      const readAll = notifPop.querySelector('.notif-readall');
      if (readAll) readAll.addEventListener('click', () => {
        notifPop.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
        const dot = notifBtn.querySelector('.ndot'); if (dot) dot.remove();
        notifBtn.setAttribute('aria-label', 'Notifikasi');
      });
    }

    // mobile: klik item menutup drawer
    document.querySelectorAll('.nav-item, .nav-sub, .sub-item').forEach(el =>
      el.addEventListener('click', () => { if (isMobile()) app.classList.add('collapsed'); }));

    // sesuaikan saat resize
    let wasMobile = isMobile();
    window.addEventListener('resize', () => {
      const now = isMobile();
      if (now !== wasMobile) { app.classList.toggle('collapsed', now); wasMobile = now; }
    });

    // tabs
    document.querySelectorAll('.tabs').forEach(tabs => {
      const panels = tabs.parentElement.querySelectorAll('.tab-panel');
      tabs.querySelectorAll('.tab').forEach((tab, i) => tab.addEventListener('click', () => {
        tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      }));
    });

    // toggle password (ikon mata)
    document.querySelectorAll('.toggle-eye').forEach(btn => btn.addEventListener('click', () => {
      const wrap = btn.closest('.input-password');
      const input = wrap.querySelector('.form-control');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      wrap.classList.toggle('show', show);
    }));

    // modal (dengan focus-trap + kembalikan fokus)
    const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    let modalReturn = null;
    const closeModal = m => {
      if (!m) return;
      m.classList.remove('open');
      if (modalReturn && modalReturn.focus) modalReturn.focus();
      modalReturn = null;
    };
    const openModal = m => {
      if (!m) return;
      modalReturn = document.activeElement;
      m.classList.add('open');
      const f = m.querySelector(FOCUSABLE); if (f) setTimeout(() => f.focus(), 30);
    };
    document.querySelectorAll('[data-modal-open]').forEach(btn =>
      btn.addEventListener('click', () => openModal(document.getElementById(btn.getAttribute('data-modal-open')))));
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov); });
      ov.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => closeModal(ov)));
      // focus-trap dalam modal
      ov.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const items = [...ov.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    });

    // accordion (FAQ)
    document.querySelectorAll('.acc-head').forEach(h =>
      h.addEventListener('click', () => h.closest('.acc-item').classList.toggle('open')));

    // star rating interaktif
    document.querySelectorAll('.rating:not(.readonly)').forEach(r => {
      const stars = [...r.children];
      stars.forEach((s, i) => s.addEventListener('click', () => {
        stars.forEach((x, j) => x.classList.toggle('on', j <= i));
        r.setAttribute('data-value', i + 1);
      }));
    });

    // code block: syntax highlight + nomor baris + salin
    document.querySelectorAll('.code-block').forEach(cb => {
      const code = cb.querySelector('code');
      if (!code) return;
      if (window.hljs && !code.dataset.hl) { try { hljs.highlightElement(code); } catch (e) {} code.dataset.hl = '1'; }
      const body = cb.querySelector('.cb-body');
      if (body && !cb.querySelector('.cb-gutter')) {
        const n = code.textContent.replace(/\n$/, '').split('\n').length;
        const g = document.createElement('div'); g.className = 'cb-gutter';
        let s = ''; for (let i = 1; i <= n; i++) s += i + (i < n ? '\n' : '');
        g.textContent = s; body.insertBefore(g, body.firstChild);
      }
      const copy = cb.querySelector('.copy');
      if (copy && !copy.dataset.b) {
        copy.dataset.b = '1';
        copy.addEventListener('click', () => {
          try { navigator.clipboard.writeText(code.textContent); } catch (e) {}
          const o = copy.innerHTML; copy.textContent = '✓'; setTimeout(() => { copy.innerHTML = o; }, 1200);
        });
      }
    });

    // color picker (generik): .color-field { input[type=color], .color-hex, .color-swatch[data-c] }
    document.querySelectorAll('.color-field').forEach(f => {
      const inp = f.querySelector('input[type="color"]'), hex = f.querySelector('.color-hex');
      if (inp && hex) inp.addEventListener('input', () => { hex.textContent = inp.value; });
      f.querySelectorAll('.color-swatch').forEach(s => s.addEventListener('click', () => {
        f.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        if (inp) inp.value = s.dataset.c;
        if (hex) hex.textContent = s.dataset.c;
      }));
    });

    // dropzone (generik): .dropzone berisi input[type=file], hasil ke .dz-list terdekat
    document.querySelectorAll('.dropzone').forEach(dz => {
      const input = dz.querySelector('input[type="file"]');
      const list = dz.parentElement.querySelector('.dz-list');
      if (!input) return;
      const human = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
      const add = files => {
        if (!list) return;
        [].forEach.call(files, f => {
          const el = document.createElement('div'); el.className = 'dz-file';
          el.innerHTML = '<i data-lucide="file"></i><span>' + f.name + '</span><span class="sz">' + human(f.size) + '</span><span class="rm"><i data-lucide="x"></i></span>';
          el.querySelector('.rm').addEventListener('click', () => el.remove());
          list.appendChild(el);
        });
        if (window.lucide) lucide.createIcons();
      };
      dz.addEventListener('click', () => input.click());
      input.addEventListener('change', () => add(input.files));
      ['dragover', 'dragenter'].forEach(e => dz.addEventListener(e, ev => { ev.preventDefault(); dz.classList.add('drag'); }));
      ['dragleave', 'drop'].forEach(e => dz.addEventListener(e, ev => { ev.preventDefault(); dz.classList.remove('drag'); }));
      dz.addEventListener('drop', ev => add(ev.dataTransfer.files));
    });

    // pagination: klik nomor halaman jadi aktif (prev/next pakai data-nav, dibiarkan)
    document.querySelectorAll('.pagination').forEach(p => {
      p.querySelectorAll('.page').forEach(pg => {
        if (pg.classList.contains('disabled')) return;
        pg.addEventListener('click', e => {
          e.preventDefault();
          if (pg.hasAttribute('data-nav')) return;
          p.querySelectorAll('.page').forEach(x => { if (!x.hasAttribute('data-nav')) x.classList.remove('active'); });
          pg.classList.add('active');
        });
      });
    });

    // demo tombol loading: <button data-loading-demo>
    document.querySelectorAll('[data-loading-demo]').forEach(btn => btn.addEventListener('click', () => {
      if (btn.classList.contains('loading')) return;
      btn.classList.add('loading');
      setTimeout(() => {
        btn.classList.remove('loading');
        if (window.toast) toast('Data berhasil disimpan.', { type: 'success', title: 'Tersimpan' });
      }, 2000);
    }));

    // tombol demo toast: <button data-toast="success" data-toast-title="..." data-toast-msg="...">
    document.querySelectorAll('[data-toast]').forEach(b => b.addEventListener('click', () => {
      toast(b.getAttribute('data-toast-msg') || 'Ini contoh notifikasi.', {
        type: b.getAttribute('data-toast') || 'info',
        title: b.getAttribute('data-toast-title') || undefined
      });
    }));

    // toggle tema terang/gelap
    const setTheme = next => {
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    };
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(dark ? 'light' : 'dark');
    });

    // form wizard (stepper): <div class="js-wizard"> … </div>
    document.querySelectorAll('.js-wizard').forEach(wz => {
      const steps = [...wz.querySelectorAll('.wiz-step')];
      const panes = [...wz.querySelectorAll('.wiz-pane')];
      const prev = wz.querySelector('[data-wiz="prev"]');
      const next = wz.querySelector('[data-wiz="next"]');
      const submit = wz.querySelector('[data-wiz="submit"]');
      let cur = 0;
      const show = i => {
        cur = Math.max(0, Math.min(i, panes.length - 1));
        panes.forEach((p, x) => p.classList.toggle('active', x === cur));
        steps.forEach((s, x) => { s.classList.toggle('active', x === cur); s.classList.toggle('done', x < cur); });
        if (prev) prev.disabled = cur === 0;
        const last = cur === panes.length - 1;
        if (next) next.hidden = last;
        if (submit) submit.hidden = !last;
      };
      if (prev) prev.addEventListener('click', () => show(cur - 1));
      if (next) next.addEventListener('click', () => show(cur + 1));
      steps.forEach((s, i) => s.addEventListener('click', () => { if (i <= cur) show(i); }));
      show(0);
    });

    initAvatarUpload();
    initInputMask();
    initCarousel();
    initCopyInput();
    initPopover();
    initAssertions();
    initCmdK(setTheme);
  }

  /* ---- Input salin: tombol .copy-btn menyalin nilai .form-control ---- */
  function initCopyInput() {
    document.querySelectorAll('.input-copy .copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.closest('.input-copy');
        var inp = wrap.querySelector('.form-control');
        if (!inp) return;
        var done = function () {
          wrap.classList.add('copied');
          if (window.toast) toast('Disalin ke papan klip.', { type: 'success' });
          setTimeout(function () { wrap.classList.remove('copied'); }, 1400);
        };
        try {
          navigator.clipboard.writeText(inp.value).then(done, function () { inp.select(); document.execCommand('copy'); done(); });
        } catch (e) { inp.select(); document.execCommand('copy'); done(); }
      });
    });
  }

  /* ---- Popover: [data-popover] membuka .popover terdekat ---- */
  function initPopover() {
    document.querySelectorAll('[data-popover]').forEach(function (trigger) {
      var pop = trigger.parentElement.querySelector('.popover');
      if (!pop) return;
      pop.hidden = true;
      var set = function (open) { pop.hidden = !open; trigger.setAttribute('aria-expanded', String(open)); };
      trigger.addEventListener('click', function (e) { e.stopPropagation(); set(pop.hidden); });
      document.addEventListener('click', function (e) { if (!pop.contains(e.target) && !trigger.contains(e.target)) set(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    });
  }

  /* ---- Assertions: tambah/hapus baris ---- */
  function initAssertions() {
    var host = document.getElementById('assertRows');
    if (!host) return;
    var SRC = ['Status code', 'JSON body', 'Response time', 'Headers', 'Cookies'];
    var CMP = ['Equals', 'Not equals', 'Has value', 'Contains', 'Less than', 'Greater than'];
    var opt = function (arr) { return arr.map(function (v) { return '<option>' + v + '</option>'; }).join(''); };
    var rowHtml = function () {
      return '<div class="assert-row">' +
        '<select class="form-control sm">' + opt(SRC) + '</select>' +
        '<input class="form-control sm" placeholder="properti…">' +
        '<select class="form-control sm">' + opt(CMP) + '</select>' +
        '<input class="form-control sm" placeholder="target…">' +
        '<button type="button" class="assert-del" data-assert-del aria-label="Hapus baris"><i data-lucide="trash-2"></i></button>' +
        '</div>';
    };
    var add = document.querySelector('[data-assert-add]');
    if (add) add.addEventListener('click', function () {
      host.insertAdjacentHTML('beforeend', rowHtml());
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    });
    host.addEventListener('click', function (e) {
      var del = e.target.closest('[data-assert-del]');
      if (del) del.closest('.assert-row').remove();
    });
  }

  /* ---- Input mask ringan (tanpa vendor) ----
     <input data-mask="99/99/9999">  token: 9=digit, a=huruf, *=alfanumerik,
     selain itu dianggap literal (mis. / ( ) - . spasi) dan disisipkan otomatis. */
  function initInputMask() {
    var tok = { '9': /\d/, 'a': /[a-zA-Z]/, '*': /[a-zA-Z0-9]/ };
    function format(val, mask) {
      var out = '', p = 0;
      for (var i = 0; i < mask.length && p < val.length;) {
        var mc = mask[i];
        if (tok[mc]) {
          if (tok[mc].test(val[p])) { out += val[p]; i++; p++; }
          else { p++; }                    // lewati karakter tak valid
        } else {
          out += mc; i++;                  // sisipkan literal
          if (val[p] === mc) p++;          // konsumsi bila user mengetik literal itu
        }
      }
      return out;
    }
    document.querySelectorAll('input[data-mask]').forEach(function (el) {
      var mask = el.getAttribute('data-mask');
      if (/^[9]/.test(mask.replace(/[^9a*]/g, '')[0] || '9')) el.setAttribute('inputmode', 'numeric');
      var run = function () {
        var s = el.selectionStart, before = el.value;
        el.value = format(el.value, mask);
        // pertahankan posisi kursor secara sederhana
        try { el.setSelectionRange(s + (el.value.length - before.length), s + (el.value.length - before.length)); } catch (e) {}
      };
      el.addEventListener('input', run);
    });
  }

  /* ---- Carousel ringan (tanpa vendor) ----
     <div class="carousel js-carousel" data-autoplay="5000"> .carousel-track > .carousel-slide … </div> */
  function initCarousel() {
    document.querySelectorAll('.js-carousel').forEach(function (c) {
      var track = c.querySelector('.carousel-track');
      var slides = [].slice.call(c.querySelectorAll('.carousel-slide'));
      if (!track || slides.length === 0) return;
      var dotsWrap = c.querySelector('.carousel-dots');
      var i = 0, timer = null, delay = parseInt(c.getAttribute('data-autoplay') || '0', 10);
      // hormati preferensi kurangi-gerak: matikan autoplay
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) delay = 0;

      if (dotsWrap) slides.forEach(function (s, idx) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        b.setAttribute('aria-label', 'Slide ' + (idx + 1));
        b.addEventListener('click', function () { go(idx); reset(); });
        dotsWrap.appendChild(b);
      });
      var dots = dotsWrap ? [].slice.call(dotsWrap.children) : [];

      function go(n) {
        i = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-i * 100) + '%)';
        dots.forEach(function (d, x) { d.classList.toggle('active', x === i); });
      }
      function next() { go(i + 1); }
      function prev() { go(i - 1); }
      function reset() { if (delay) { clearInterval(timer); timer = setInterval(next, delay); } }

      var pn = c.querySelector('[data-carousel="prev"]'), nx = c.querySelector('[data-carousel="next"]');
      if (pn) pn.addEventListener('click', function () { prev(); reset(); });
      if (nx) nx.addEventListener('click', function () { next(); reset(); });

      if (delay) {
        reset();
        c.addEventListener('mouseenter', function () { clearInterval(timer); });
        c.addEventListener('mouseleave', reset);
      }
      go(0);
    });
  }

  /* ---- Unggah avatar (foto profil) ----
     - tombol [data-avatar-pick] membuka dialog file (#avatarInput)
     - foto diterapkan ke semua .js-avatar (header, form, sidebar)
     - disimpan di localStorage agar bertahan saat halaman dimuat ulang
     - tombol [data-avatar-remove] mengembalikan ke inisial          */
  function initAvatarUpload() {
    const input = document.getElementById('avatarInput');
    const KEY = 'profileAvatar';
    const targets = () => document.querySelectorAll('.js-avatar');

    const apply = url => targets().forEach(el => {
      let img = el.querySelector('.av-img');
      if (url) {
        if (!img) { img = document.createElement('img'); img.className = 'av-img'; img.alt = 'Foto profil'; el.appendChild(img); }
        img.src = url; el.classList.add('has-img');
      } else { if (img) img.remove(); el.classList.remove('has-img'); }
    });

    // pulihkan foto tersimpan (berlaku di halaman mana pun yang punya .js-avatar)
    let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) apply(saved);

    if (!input) return; // halaman tanpa uploader: cukup memulihkan foto di atas

    document.querySelectorAll('[data-avatar-pick]').forEach(b => b.addEventListener('click', () => input.click()));

    input.addEventListener('change', () => {
      const f = input.files && input.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) { toast('Berkas harus berupa gambar (JPG, PNG, dll).', { type: 'danger', title: 'Format tidak didukung' }); input.value = ''; return; }
      if (f.size > 2 * 1024 * 1024) { toast('Ukuran maksimal 2 MB.', { type: 'danger', title: 'Berkas terlalu besar' }); input.value = ''; return; }
      const r = new FileReader();
      r.onload = () => {
        apply(r.result);
        try { localStorage.setItem(KEY, r.result); } catch (e) {}
        toast('Foto profil berhasil diperbarui.', { type: 'success', title: 'Tersimpan' });
      };
      r.readAsDataURL(f);
      input.value = '';
    });

    document.querySelectorAll('[data-avatar-remove]').forEach(b => b.addEventListener('click', () => {
      apply(null); try { localStorage.removeItem(KEY); } catch (e) {}
      toast('Foto profil dihapus, kembali ke inisial.', { type: 'info', title: 'Dihapus' });
    }));
  }

  /* ---- Command palette (pencarian ⌘K / Ctrl+K) ---- */
  function initCmdK(setTheme) {
    const cmdk = document.getElementById('cmdk');
    if (!cmdk) return;
    const input = document.getElementById('cmdkInput');
    const list  = document.getElementById('cmdkList');
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    // ganti simbol ⌘ menjadi Ctrl di non-Mac
    if (!isMac) document.querySelectorAll('.searchbar .kbd .mod').forEach(m => { m.textContent = 'Ctrl'; m.style.fontSize = 'var(--fs-xs)'; });

    const items = [
      { t: 'Dashboard',   s: 'Ringkasan & statistik', i: 'layout-dashboard', h: '/index.html', g: 'Halaman' },
      { t: 'Datatable',   s: 'Tabel data interaktif', i: 'table', h: '/pages/datatable.html', g: 'Halaman' },
      { t: 'Elements',    s: 'Form, komponen & UI',   i: 'layout-grid', h: '/pages/elements.html', g: 'Halaman' },
      { t: 'Charts',      s: 'Grafik & visualisasi',  i: 'pie-chart', h: '/pages/charts.html', g: 'Halaman' },
      { t: 'File Manager',s: 'Kelola berkas',         i: 'folder', h: '/pages/files.html', g: 'Halaman' },
      { t: 'HTML Parser', s: 'Alat parse HTML',       i: 'code-2', h: '/pages/html-parser.html', g: 'Halaman' },
      { t: 'Blog',        s: 'Artikel & tutorial',    i: 'newspaper', h: '/pages/blog.html', g: 'Halaman' },
      { t: 'Detail Artikel', s: 'Contoh halaman artikel', i: 'file-text', h: '/pages/blog-detail.html', g: 'Halaman' },
      { t: 'FAQ',         s: 'Pertanyaan umum',       i: 'help-circle', h: '/pages/elements.html', g: 'Halaman' },
      { t: 'Profil',      s: 'Pengaturan akun',       i: 'user', h: '/pages/profile.html', g: 'Halaman' },
      { t: 'Pengaturan',  s: 'Konfigurasi aplikasi',  i: 'settings', h: '/pages/settings.html', g: 'Halaman' },
      { t: 'Landing Page',s: 'Halaman publik',        i: 'globe', h: '/pages/landing.html', g: 'Halaman' },
      { t: 'Email',       s: 'Template email',        i: 'mail', h: '/pages/email.html', g: 'Halaman' },
      { t: 'Ganti tema terang/gelap', s: 'Perintah', i: 'sun-moon', g: 'Perintah',
        run: () => { const d = document.documentElement.getAttribute('data-theme') === 'dark'; setTheme(d ? 'light' : 'dark'); } },
    ];

    let view = [], sel = 0, lastFocus = null;
    const triggers = ['searchOpen', 'searchOpenSm'].map(id => document.getElementById(id)).filter(Boolean);
    const setExpanded = v => triggers.forEach(t => t.setAttribute('aria-expanded', String(v)));

    const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const render = () => {
      if (!view.length) { list.innerHTML = '<div class="cmdk-empty">Tidak ada hasil.</div>'; return; }
      let html = '', lastG = '';
      view.forEach((it, idx) => {
        if (it.g !== lastG) { html += '<div class="cmdk-group">' + esc(it.g) + '</div>'; lastG = it.g; }
        html += '<div class="cmdk-item' + (idx === sel ? ' active' : '') + '" data-i="' + idx + '">' +
          '<span class="ic"><i data-lucide="' + it.i + '"></i></span>' +
          '<span class="tx"><span class="tt">' + esc(it.t) + '</span><span class="sub">' + esc(it.s) + '</span></span>' +
          '<span class="go"><i data-lucide="corner-down-left"></i></span></div>';
      });
      list.innerHTML = html;
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
      const a = list.querySelector('.cmdk-item.active');
      if (a) a.scrollIntoView({ block: 'nearest' });
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      view = q ? items.filter(it => (it.t + ' ' + it.s).toLowerCase().includes(q)) : items.slice();
      sel = 0; render();
    };
    const go = it => {
      if (!it) return;
      close();
      if (it.run) it.run();
      else if (it.h) location.href = it.h;
    };
    const open = () => { lastFocus = document.activeElement; cmdk.hidden = false; setExpanded(true); input.value = ''; filter(); setTimeout(() => input.focus(), 30); };
    function close() {
      cmdk.hidden = true; setExpanded(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(b => b.addEventListener('click', open));
    // jaga fokus tetap di dalam palette (focus trap sederhana — hanya input yang fokusabel)
    cmdk.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); input.focus(); } });
    cmdk.querySelectorAll('[data-cmdk-close]').forEach(b => b.addEventListener('click', close));
    input.addEventListener('input', filter);
    list.addEventListener('mousemove', e => {
      const el = e.target.closest('.cmdk-item'); if (!el) return;
      const i = +el.dataset.i; if (i !== sel) { sel = i; render(); }
    });
    list.addEventListener('click', e => {
      const el = e.target.closest('.cmdk-item'); if (el) go(view[+el.dataset.i]);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, view.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(view[sel]); }
    });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.hidden ? open() : close(); }
      else if (e.key === 'Escape' && !cmdk.hidden) close();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // render ikon Lucide — stroke tipis agar senada
    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    initUI();

    // page loader: sembunyikan setelah siap
    const pl = document.querySelector('.page-loader');
    if (pl) setTimeout(() => pl.classList.add('hide'), 400);

    // cookie banner: tampil sampai disetujui
    let ck; try { ck = localStorage.getItem('cookieAccepted'); } catch (e) {}
    if (!ck) {
      const cb = document.createElement('div');
      cb.className = 'cookie-banner';
      cb.innerHTML = '<p>Kami menggunakan cookie untuk meningkatkan pengalaman Anda.</p>' +
        '<div class="ck-actions">' +
        '<button class="btn outline" id="ckDecline">Tolak</button>' +
        '<button class="btn primary" id="ckAccept">Terima</button>' +
        '</div>';
      document.body.appendChild(cb);
      const done = v => { try { localStorage.setItem('cookieAccepted', v); } catch (e) {} cb.remove(); };
      cb.querySelector('#ckAccept').onclick = () => done('yes');
      cb.querySelector('#ckDecline').onclick = () => done('no');
    }

    // beri tahu skrip halaman bahwa layout siap (mis. init DataTables/Select2)
    document.dispatchEvent(new CustomEvent('ui:ready'));
  });
})();
