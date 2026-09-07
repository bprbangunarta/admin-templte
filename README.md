# Admin Template

Template admin HTML statis — gaya bersih/compact terinspirasi UI Claude
(warm near-white, aksen clay). Ringan, tanpa build step, mudah dipetakan ke Laravel Blade.

## Struktur folder

```
admin-template/
├── index.html                 # Dashboard (entry point)
├── pages/                     # Halaman-halaman
│   ├── datatable.html         # Contoh DataTables (jQuery)
│   ├── elements.html          # Katalog komponen (form, tombol, grid, modal, validasi, toast, dll)
│   ├── profile.html           # Profil pengguna (header + tabs + form)
│   ├── settings.html          # Pengaturan (umum, notifikasi, keamanan)
│   ├── wizard.html            # Form wizard multi-langkah (stepper)
│   ├── detail.html            # Halaman detail/show record (desc-list + timeline)
│   ├── charts.html            # Galeri chart (ApexCharts): area, line, bar, donut, radial
│   ├── html-parser.html       # Alat escape HTML (untuk code block/Blogger)
│   ├── files.html             # File manager (folder & file grid)
│   ├── landing.html           # Landing page frontend (hero, fitur, harga, footer)
│   ├── email.html             # Template email siap kirim (inline-styled)
│   ├── auth/                  # Login, Register, Lupa/Reset Password (layar penuh)
│   │   ├── login.html  register.html  forgot-password.html  reset-password.html
│   └── error/                 # 404, 500, Maintenance
│       ├── 404.html  500.html  maintenance.html
├── partials/                  # Potongan HTML reusable (di-include via JS)
│   ├── sidebar.html           # Sidebar utama + menu profil
│   ├── topbar.html            # Header atas
│   └── submenu.html           # Sub-sidebar (dual sidebar)
├── assets/
│   ├── css/app.css            # Design system (satu sumber gaya)
│   ├── js/app.js              # Loader partial + interaksi (menu, modal, tabs, dll)
│   ├── img/                   # Gambar / logo
│   └── vendor/                # Library pihak ketiga (di-host lokal, bukan CDN)
│       ├── jquery/  datatables/  select2/  lucide/
└── README.md
```

## Cara menjalankan

Karena partial dimuat via `fetch()`, jalankan lewat HTTP server (bukan `file://`):

```bash
python3 -m http.server 8777
# buka http://localhost:8777/
```

## Konsep penting

- **DRY** — sidebar/topbar/submenu ditulis sekali di `partials/`, dimuat di tiap halaman
  lewat `<div data-include="/partials/sidebar.html"></div>` (ditangani `app.js`).
- **Menu aktif & judul** diatur dari atribut `<body>`:
  `data-title`, `data-nav` (menu utama aktif), `data-sub` (sub-menu aktif).
  Cocokkan dengan `data-key` pada item menu di partial.
- **Ikon** memakai [Lucide](https://lucide.dev/icons/):
  cukup `<i data-lucide="nama-ikon"></i>` (dirender otomatis oleh `app.js`).
- **Sidebar mini** (desktop): tombol menu di topbar menciutkan sidebar jadi *rail* ikon;
  arahkan kursor untuk mengembang sementara. Tersimpan di `localStorage`. Di mobile tetap drawer.
- **Vector map** ([jsVectorMap](https://jvm.web.id/)) tersedia di dashboard (`#vmap`) —
  SVG, tanpa API key, warna & marker mengikuti design system + otomatis menyesuaikan dark mode.
- **Design tokens** (warna, ukuran font, spacing) ada di `:root` pada `app.css` —
  ubah di satu tempat untuk mengubah seluruh tampilan.

## Mengubah warna primary (rebrand)

Semua warna diatur lewat CSS variable di blok `:root` pada
[`assets/css/app.css`](assets/css/app.css). Warna utama/aksen ada di **dua variabel**:

```css
:root {
  --accent:      #d97757;  /* warna primary (tombol, menu aktif, link, focus, dll) */
  --accent-soft: #f2e7e1;  /* versi lembut/tint dari primary (badge, bg lembut, ring) */
}
```

Cukup ganti kedua nilai itu — otomatis berlaku ke seluruh komponen (tombol `.btn.primary`,
menu aktif, `.link`, focus input, `.bg-primary`, `.bg-primary-soft`, dll). Contoh ganti ke biru:

```css
:root {
  --accent:      #2f6fed;
  --accent-soft: #e7ecfb;
}
```

> Tips: `--accent-soft` sebaiknya versi sangat muda dari `--accent` (opacity ±10–12% di atas putih)
> agar teks primary tetap terbaca di atasnya.

Variabel warna lain yang bisa disesuaikan di `:root`:

| Variabel          | Fungsi                                  |
|-------------------|------------------------------------------|
| `--bg-content`    | Latar area konten                        |
| `--bg-sidebar`    | Latar sidebar                            |
| `--bg-active`     | Latar item menu aktif                    |
| `--text` / `--text-muted` / `--text-faint` | Warna teks (utama/sekunder/samar) |
| `--border`        | Garis pembatas                           |
| `--green` / `--amber` / `--red` / `--blue` | Warna status (success/warning/danger/info) |

## Dark mode

Template mendukung tema **terang & gelap** (warm dark + aksen clay), mengikuti design system.

- Toggle: ikon **matahari/bulan** di topbar (kanan atas).
- Tersimpan otomatis di `localStorage`; default mengikuti preferensi sistem (`prefers-color-scheme`).
- Anti-flicker: skrip kecil di `<head>` tiap halaman menetapkan tema **sebelum** render.
- Diaktifkan via atribut `<html data-theme="dark">`. Palet gelap didefinisikan di
  `:root[data-theme="dark"]` pada `app.css` — cukup ubah di sana untuk menyetel warna gelap.

## Komponen tersedia (lihat `pages/elements.html`)

Form (input, textarea, select, **Select2**, checkbox, radio, switch, input group,
password + ikon mata), **validasi form** (`.is-invalid`/`.is-valid` + feedback),
tombol (varian + ukuran + ikon + state hover/active/disabled), alert, **breadcrumb**,
tabs, **modal** (sm/default/lg), **toast** (`toast('pesan',{type})`), **grid** 12 kolom,
utilitas warna (`.bg-*`, `.text-*`, `.bg-*-soft`), **DataTables** (`pages/datatable.html`),
**vector map** (dashboard), dan **charts** (ApexCharts: area/line/bar/donut/radial — `pages/charts.html`).
Chart & map **theme-aware**: warnanya dibaca dari CSS variable dan otomatis dibangun ulang saat dark mode.

Tambahan: **command palette** pencarian (⌘K / Ctrl+K), **dropdown notifikasi** (lonceng + badge),
**tombol loading** (`.btn.loading`), **empty state** (`.empty-state`), **skeleton**, **timeline** (`.track`),
**form wizard** (`.js-wizard` — `pages/wizard.html`), dan **halaman detail** (`.desc-list` — `pages/detail.html`).
Aksesibilitas: toggle memakai `<button>` + `aria-expanded`, focus-trap pada palette & modal,
`:focus-visible`, serta menghormati `prefers-reduced-motion`.

**Toast** dipanggil dari mana saja: `toast('Tersimpan', { type:'success', title:'Berhasil' })`
atau lewat atribut `data-toast="success" data-toast-msg="..."` pada tombol.

**Code block** (syntax highlight + nomor baris + salin): muat `assets/vendor/highlightjs/highlight-11.9.0.min.js`,
lalu tulis kode yang **sudah di-escape** (`&lt;`, `&gt;`, `&amp;`) di dalam `<code class="language-xxx">`:

```html
<div class="code-block" data-lang="html">
  <div class="cb-head"><div class="cb-dots"><span></span><span></span><span></span></div><span class="cb-lang">html</span></div>
  <button class="copy" title="Salin"><i data-lucide="copy"></i></button>
  <div class="cb-body"><pre><code class="language-html">&lt;blockquote&gt;…&lt;/blockquote&gt;</code></pre></div>
</div>
```
`app.js` otomatis melakukan highlight, menambah nomor baris, dan mengaktifkan tombol salin.

### Utility classes (gaya Bootstrap/Tailwind)

Tersedia di `app.css` untuk mengurangi inline-style — skala spasi `0=0, 1=4px, 2=8px, 3=12px, 4=16px, 5=24px`:

- **Teks**: `.text-center` `.text-end` `.text-justify` `.text-nowrap` `.text-truncate` `.text-uppercase` `.fw-medium` `.fw-semibold` `.fs-sm…fs-xl`
- **Spasi**: `.mt-3` `.mb-4` `.mx-auto` `.p-3` `.px-4` `.py-2` (dan `ms/me/pt/pb/ps/pe`)
- **Display/Flex**: `.d-flex` `.d-none` `.d-grid` `.flex-wrap` `.items-center` `.justify-between` `.gap-2`
- **Lain**: `.w-100` `.rounded` `.rounded-pill` `.border` `.cursor-pointer`

## Library pihak ketiga (di-host lokal — `assets/vendor/`)

Semua vendor disimpan di dalam proyek (bukan CDN) agar berjalan offline dan versinya jelas.

| Library        | Versi        | File                                                        |
|----------------|--------------|-------------------------------------------------------------|
| jQuery         | 3.7.1        | `assets/vendor/jquery/jquery-3.7.1.min.js`                   |
| DataTables     | 1.13.8       | `assets/vendor/datatables/jquery.dataTables-1.13.8.min.js`  |
| Select2        | 4.1.0-rc.0   | `assets/vendor/select2/select2-4.1.0-rc.0.min.{css,js}`     |
| Lucide (ikon)  | 0.294.0      | `assets/vendor/lucide/lucide-0.294.0.min.js`                |
| jsVectorMap    | 1.5.3        | `assets/vendor/jsvectormap/` (css, js, `world.js`)          |
| ApexCharts     | 3.45.2       | `assets/vendor/apexcharts/apexcharts-3.45.2.min.js`         |
| flatpickr      | 4.6.13       | `assets/vendor/flatpickr/` (date picker single & range)     |
| Leaflet + OSM  | 1.9.4        | `assets/vendor/leaflet/` (peta interaktif, tanpa API key)   |
| signature_pad  | 4.1.7        | `assets/vendor/signature_pad/`                              |
| GLightbox      | 3.3.0        | `assets/vendor/glightbox/`                                  |
| Quill (WYSIWYG)| 1.3.7        | `assets/vendor/quill/`                                      |
| highlight.js   | 11.9.0       | `assets/vendor/highlightjs/` (syntax highlight code block)  |
| Inter (font)   | 5.0.16       | `assets/vendor/inter/` (woff2 400/500/600, `@font-face`)    |

> Font **Inter** kini di-host lokal (`@font-face` di `app.css`) — 100% offline,
> tanpa dependensi Google Fonts.

### Cara update versi

1. Unduh file baru ke folder vendor terkait, mis. versi baru DataTables:
   ```bash
   curl -sSL -o assets/vendor/datatables/jquery.dataTables-1.13.9.min.js \
     https://cdn.datatables.net/1.13.9/js/jquery.dataTables.min.js
   ```
2. Perbarui tautan `<script>`/`<link>` di halaman yang memakainya (mis. `pages/datatable.html`).
3. Perbarui nomor versi di tabel ini.
4. Hapus file versi lama.

### Ikon (Lucide)

Panggil ikon cukup dengan atribut — tidak perlu SVG panjang:
```html
<i data-lucide="house"></i>
<i data-lucide="user"></i>
```
`app.js` otomatis menjalankan `lucide.createIcons()` setelah layout dimuat.
Daftar nama ikon: https://lucide.dev/icons/

## Migrasi ke Laravel (Blade)

Struktur ini memetakan 1:1:

| Statis                    | Laravel                              |
|---------------------------|--------------------------------------|
| `assets/`                 | `public/assets/`                     |
| `partials/*.html`         | `resources/views/partials/*.blade.php` (`@include`) |
| `pages/*.html`            | `resources/views/*.blade.php` (`@extends`) |
| `data-include`            | `@include('partials.sidebar')`       |
| path `/assets/...`        | `{{ asset('assets/...') }}`          |
