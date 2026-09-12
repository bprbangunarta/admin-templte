# Menu → Folder & File Mapping

Pemetaan struktur menu dari **`indexku.html`** (menu final pilihan user) ke folder & file.
Referensi cadangan menu lama: **`index-old.html`**. Dokumen ini = **rencana pemetaan** (belum eksekusi/migrasi).

Legenda status:
- ✅ **reuse** — file sudah ada, tinggal dipindah/di-rename ke path target
- 🆕 **new** — belum ada, perlu dibuat
- ⚠️ **decision** — perlu keputusan user (duplikat/ambigu)

Konvensi path: root = `index.html`; halaman anak di `pages/…`.
Kedalaman path menentukan prefix aset: depth-1 `../`, depth-2 `../../`, depth-3 `../../../`.

---

## MAIN (tanpa header seksi)

| Menu | Level | Path target | Status | Sumber (reuse dari) |
|---|---|---|---|---|
| Dashboard | L1 | `index.html` | ✅ | `index.html` (final; draft = `indexku.html`) |
| Calendar | L1 | `pages/calendar.html` | ✅ | `pages/calendar.html` |
| Charts | L1 | `pages/charts.html` | ✅ | `pages/charts.html` |
| **Elements** ▸ | L1 (tree) | `pages/elements/` (folder) | — | — |
| — Assertions | L2 | `pages/elements/assertions.html` | ✅ | `pages/assertions.html` |
| — Buttons | L2 | `pages/elements/buttons.html` | ✅ | `pages/ui-buttons.html` |
| — Cards | L2 | `pages/elements/cards.html` | ✅ | `pages/ui-cards.html` |
| — Components | L2 | `pages/elements/components.html` | ✅ | `pages/ui-components.html` |
| — Icons | L2 | `pages/elements/icons.html` | ✅ | `pages/ui-icons.html` |
| — Loaders | L2 | `pages/elements/loaders.html` | ✅ | `pages/ui-loaders.html` |
| — Maps | L2 | `pages/elements/maps.html` | ✅ | `pages/maps.html` |
| — Media | L2 | `pages/elements/media.html` | ✅ | `pages/ui-media.html` |
| — Modals | L2 | `pages/elements/modals.html` | ✅ | `pages/ui-modals.html` (kini "Modals & Toasts") |
| — Pricing | L2 | `pages/elements/pricing.html` | ⚠️ | `pages/pricing.html` — duplikat dgn "Pricing" di MAIN |
| — Progress | L2 | `pages/elements/progress.html` | 🆕 | pisah dari `ui-loaders.html` (ada komponen Progress) |
| — Toasts | L2 | `pages/elements/toasts.html` | 🆕 | pisah dari `ui-modals.html` (ada Toast) |
| — Typography | L2 | `pages/elements/typography.html` | ✅ | `pages/ui-typography.html` |
| **Forms** ▸ | L1 (tree) | `pages/forms/` (folder) | — | — |
| — Basic | L2 | `pages/forms/basic.html` | ✅ | `pages/form-elements.html` |
| — Advanced | L2 | `pages/forms/advanced.html` | ✅ | `pages/form-advanced.html` |
| — Editor | L2 | `pages/forms/editor.html` | ✅ | `pages/form-editor.html` |
| — Wizard | L2 | `pages/forms/wizard.html` | ✅ | `pages/wizard.html` |
| Invoice | L1 | `pages/invoice.html` | ✅ | `pages/invoice.html` |
| Mailbox `(4)` | L1 | `pages/mailbox.html` | ✅ | `pages/mailbox.html` |
| Pricing | L1 | `pages/pricing.html` | ⚠️ | `pages/pricing.html` — lihat catatan duplikat Pricing |
| **Tables** ▸ | L1 (tree) | `pages/tables/` (folder) | — | — |
| — Basic Tables | L2 | `pages/tables/basic.html` | ✅ | `pages/tables-basic.html` |
| — DataTable | L2 | `pages/tables/datatable.html` | ✅ | `pages/datatable.html` |

---

## SAMPLE PAGE (seksi)

| Menu | Level | Path target | Status | Sumber (reuse dari) |
|---|---|---|---|---|
| **Auth** ▸ | L1 (tree) | `pages/auth/` (folder) | — | — |
| — Login | L2 | `pages/auth/login.html` | ✅ | ada |
| — Register | L2 | `pages/auth/register.html` | ✅ | ada |
| — Forgot Password | L2 | `pages/auth/forgot-password.html` | ✅ | ada |
| — Reset Password | L2 | `pages/auth/reset-password.html` | ✅ | ada |
| Email | L1 (lead) | `pages/email.html` | ✅ | `pages/email.html` (galeri template) |
| **Error** ▸ | L1 (tree) | `pages/error/` (folder) | — | — |
| — Error 404 | L2 | `pages/error/404.html` | ✅ | ada |
| — Error 500 | L2 | `pages/error/500.html` | ✅ | ada |
| — Maintenance | L2 | `pages/error/maintenance.html` | ✅ | ada (perbaiki ejaan: "Maintanance" → "Maintenance") |
| **Landing** ▸ | L1 (tree) | `pages/landing/` (folder) | — | — |
| — Articles | L2 | `pages/landing/articles.html` | ⚠️ | `pages/blog.html` (+ `blog-detail.html` sbg detail) |
| — Marketing | L2 | `pages/landing/marketing.html` | ✅ | `pages/landing.html` |

---

## SAMPLE MENU (seksi — peraga tipe/level menu)

| Menu | Level | Path target | Status | Sumber |
|---|---|---|---|---|
| Level One | L1 (lead, single) | `pages/sample/level-one.html` | 🆕 | placeholder (mis. dari `blank.html`) |
| **Level One** ▸ | L1 (tree) | `pages/sample/level-one/` (folder) | — | — |
| — Level Two | L2 | `pages/sample/level-one/level-two.html` | 🆕 | placeholder |
| Multi Menu | L1 (lead) | `pages/sample/multi-menu.html` | 🆕 | reuse `pages/sub-menu-1.html` |

> Catatan: ada dua item berlabel **"Level One"** (satu single, satu tree). Ini sengaja untuk memperagakan tipe menu; path dibedakan seperti di atas.

---

## Struktur folder target (ringkas)

```
index.html                      (Dashboard)
pages/
  calendar.html
  charts.html
  invoice.html
  mailbox.html
  pricing.html
  email.html
  elements/
    assertions.html  buttons.html  cards.html  components.html
    icons.html  loaders.html  maps.html  media.html  modals.html
    pricing.html  progress.html  toasts.html  typography.html
  forms/
    basic.html  advanced.html  editor.html  wizard.html
  tables/
    basic.html  datatable.html
  auth/
    login.html  register.html  forgot-password.html  reset-password.html
  error/
    404.html  500.html  maintenance.html
  landing/
    articles.html  marketing.html   (+ article-detail.html?)
  sample/
    level-one.html  multi-menu.html
    level-one/
      level-two.html
```

---

## Keputusan yang perlu ditetapkan user

1. **Duplikat "Pricing"** — ada di MAIN (halaman produk) dan di Elements (komponen tabel harga).
   Dipertahankan keduanya (path beda) atau salah satu saja?
2. **Elements ▸ Maps vs Charts** — "Maps" ada di dalam Elements, sementara "Charts" berdiri sendiri di MAIN. Biarkan begitu?
3. **Split baru** — `Progress` & `Toasts` jadi halaman terpisah (🆕), atau tetap gabung di Loaders/Modals?
4. **Landing ▸ Articles/Marketing** — Articles = `blog.html` (frontend), Marketing = `landing.html` (frontend). Halaman ini publik (tanpa sidebar admin) — tetap ditaut dari sidebar admin, atau buka tab baru?
5. **Reorganisasi folder** — setuju memindah file `ui-*`, `form-*`, `tables-basic`, dll ke subfolder (`elements/`, `forms/`, `tables/`)? Ini mengubah banyak path & perlu update tautan sidebar di semua halaman.

Setelah keputusan di atas, langkah berikut: scaffold folder+file (pindah/rename yang reuse, buat yang 🆕), lalu terapkan menu `indexku.html` ke `index.html` + semua halaman dengan path yang benar.
