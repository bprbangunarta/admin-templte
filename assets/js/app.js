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
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status);
        node.outerHTML = await res.text();
      } catch (e) {
        console.error('Gagal memuat partial:', url, e);
      }
    }));
  }

  /* Judul topbar dari <body data-title>, lalu tandai menu aktif dari URL saat ini.
     Menu aktif dicocokkan URL halaman ⇄ href menu — setara request()->routeIs()
     di Laravel. Di Blade cukup ganti baris .active ini dgn
     @class(['active' => request()->routeIs('...')]) pada tiap item. */
  function applyState() {
    const b = document.body;
    if (b.dataset.title) {
      const h = document.querySelector('.topbar h1');
      if (h) h.textContent = b.dataset.title;
    }

    // path dinormalkan: buang trailing slash & /index.html agar "/" == "/index.html"
    const norm = p => (p || '').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
    const here = norm(location.pathname);

    document.querySelectorAll('.nav-item, .nav-sub, .sub-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item[href], .nav-sub[href], .sub-item[href]').forEach(a => {
      if (a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      if (norm(new URL(href, location.href).pathname) === here) a.classList.add('active');
    });

    // buka otomatis semua grup/tree induk dari item yang aktif
    document.querySelectorAll('.nav-item.active, .nav-sub.active, .sub-item.active').forEach(el => {
      let node = el.parentElement;
      while (node) {
        if (node.classList.contains('tree')) {
          node.classList.add('open');
          const tog = node.querySelector(':scope > .tree-toggle, :scope > .sub-item');
          if (tog) tog.setAttribute('aria-expanded', 'true');
        }
        if (node.classList.contains('nav-group')) {
          node.classList.remove('collapsed');
          const sec = node.querySelector(':scope > .nav-section');
          if (sec) sec.setAttribute('aria-expanded', 'true');
        }
        node = node.parentElement;
      }
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
      h.addEventListener('click', () => {
        const collapsed = h.closest('.nav-group').classList.toggle('collapsed');
        h.setAttribute('aria-expanded', String(!collapsed));
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
