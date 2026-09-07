// ============================================================
// Admin Template — loader partial + interaksi bersama
// ============================================================
(function () {

  /* Muat semua <div data-include="..."></div> lalu ganti dgn isi partial */
  async function loadIncludes() {
    const nodes = document.querySelectorAll('[data-include]');
    await Promise.all([...nodes].map(async node => {
      const url = node.getAttribute('data-include');
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        node.outerHTML = await res.text();
      } catch (e) {
        console.error('Gagal memuat partial:', url, e);
      }
    }));
  }

  /* Set judul topbar & tandai menu aktif dari atribut <body> */
  function applyState() {
    const b = document.body;
    if (b.dataset.title) {
      const h = document.querySelector('.topbar h1');
      if (h) h.textContent = b.dataset.title;
    }
    document.querySelectorAll('[data-key]').forEach(el => el.classList.remove('active'));
    [b.dataset.nav, b.dataset.sub].filter(Boolean).forEach(key => {
      document.querySelectorAll('[data-key="' + key + '"]').forEach(el => el.classList.add('active'));
    });
  }

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

    // grup menu collapse
    document.querySelectorAll('.nav-section').forEach(h =>
      h.addEventListener('click', () => h.closest('.nav-group').classList.toggle('collapsed')));

    // multi-level tree
    document.querySelectorAll('.tree-toggle, .tree > .sub-item').forEach(t =>
      t.addEventListener('click', e => { e.stopPropagation(); t.closest('.tree').classList.toggle('open'); }));

    // menu profil
    if (trigger && profMenu) {
      trigger.addEventListener('click', e => { e.stopPropagation(); profMenu.classList.toggle('open'); });
      document.addEventListener('click', e => {
        if (!profMenu.contains(e.target) && !trigger.contains(e.target)) profMenu.classList.remove('open');
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

    // modal
    const closeModal = m => m && m.classList.remove('open');
    document.querySelectorAll('[data-modal-open]').forEach(btn =>
      btn.addEventListener('click', () => {
        const m = document.getElementById(btn.getAttribute('data-modal-open'));
        if (m) m.classList.add('open');
      }));
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov); });
      ov.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => closeModal(ov)));
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

    initCmdK(setTheme);
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
      { t: 'FAQ',         s: 'Pertanyaan umum',       i: 'help-circle', h: '/pages/elements.html', g: 'Halaman' },
      { t: 'Profil',      s: 'Pengaturan akun',       i: 'user', h: '/pages/profile.html', g: 'Halaman' },
      { t: 'Pengaturan',  s: 'Konfigurasi aplikasi',  i: 'settings', h: '/pages/settings.html', g: 'Halaman' },
      { t: 'Landing Page',s: 'Halaman publik',        i: 'globe', h: '/pages/landing.html', g: 'Halaman' },
      { t: 'Email',       s: 'Template email',        i: 'mail', h: '/pages/email.html', g: 'Halaman' },
      { t: 'Ganti tema terang/gelap', s: 'Perintah', i: 'sun-moon', g: 'Perintah',
        run: () => { const d = document.documentElement.getAttribute('data-theme') === 'dark'; setTheme(d ? 'light' : 'dark'); } },
    ];

    let view = [], sel = 0;

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
    const open = () => { cmdk.hidden = false; input.value = ''; filter(); setTimeout(() => input.focus(), 30); };
    function close() { cmdk.hidden = true; }

    ['searchOpen', 'searchOpenSm'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.addEventListener('click', open);
    });
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

  document.addEventListener('DOMContentLoaded', async () => {
    await loadIncludes();
    applyState();
    // render ikon Lucide (termasuk yang ada di partial) — stroke tipis agar senada
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
