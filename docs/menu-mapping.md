# Menu → Folder & File Mapping

Maps the final menu structure from **`indexku.html`** (user-authored) to folders & files.
Backup of the old menu: **`index-old.html`**. This is the **plan**; execution is staged.

Status: ✅ reuse (move/rename existing) · 🆕 new (create) · ❌ removed
Path convention: root = `index.html`; children under `pages/…`. Asset prefix by depth: depth-1 `../`, depth-2 `../../`, depth-3 `../../../`.
**File names follow the menu label** (kebab-case).

---

## MAIN (no section header)

| Menu | Level | Target path | Status | Reuse from |
|---|---|---|---|---|
| Dashboard | L1 | `index.html` | ✅ | `index.html` (final; draft is `indexku.html`) |
| Calendar | L1 | `pages/calendar.html` | ✅ | `pages/calendar.html` |
| Charts | L1 | `pages/charts.html` | ✅ | `pages/charts.html` |
| **Elements** ▸ | L1 tree | `pages/elements/` | — | — |
| — Assertions | L2 | `pages/elements/assertions.html` | ✅ | `pages/assertions.html` |
| — Buttons | L2 | `pages/elements/buttons.html` | ✅ | `pages/ui-buttons.html` |
| — Cards | L2 | `pages/elements/cards.html` | ✅ | `pages/ui-cards.html` |
| — Code Block | L2 | `pages/elements/code-block.html` | 🆕 | split from `elements.html` "Code Block (syntax highlight)" (highlight.js) |
| — Components | L2 | `pages/elements/components.html` | ✅ | `pages/ui-components.html` |
| — Icons | L2 | `pages/elements/icons.html` | ✅ | `pages/ui-icons.html` |
| — Loaders | L2 | `pages/elements/loaders.html` | ✅ | `pages/ui-loaders.html` |
| — Maps | L2 | `pages/elements/maps.html` | ✅ | `pages/maps.html` |
| — Media | L2 | `pages/elements/media.html` | ✅ | `pages/ui-media.html` |
| — Modals | L2 | `pages/elements/modals.html` | ✅ | `pages/ui-modals.html` (Modals part only) |
| — Pricing | L2 | `pages/elements/pricing.html` | ✅ | `pages/pricing.html` (only Pricing; removed from MAIN) |
| — Progress | L2 | `pages/elements/progress.html` | 🆕 | split from `ui-loaders.html` |
| — Toasts | L2 | `pages/elements/toasts.html` | 🆕 | split from `ui-modals.html` |
| — Typography | L2 | `pages/elements/typography.html` | ✅ | `pages/ui-typography.html` |
| **Forms** ▸ | L1 tree | `pages/forms/` | — | — |
| — Basic | L2 | `pages/forms/basic.html` | ✅ | `pages/form-elements.html` |
| — Advanced | L2 | `pages/forms/advanced.html` | ✅ | `pages/form-advanced.html` |
| — Editor | L2 | `pages/forms/editor.html` | ✅ | `pages/form-editor.html` |
| — Wizard | L2 | `pages/forms/wizard.html` | ✅ | `pages/wizard.html` |
| Invoice | L1 | `pages/invoice.html` | ✅ | `pages/invoice.html` |
| Mailbox `(4)` | L1 | `pages/mailbox.html` | ✅ | `pages/mailbox.html` |
| **Tables** ▸ | L1 tree | `pages/tables/` | — | — |
| — Basic Tables | L2 | `pages/tables/basic-tables.html` | ✅ | `pages/tables-basic.html` |
| — DataTable | L2 | `pages/tables/datatable.html` | ✅ | `pages/datatable.html` |
| ~~Pricing~~ | — | — | ❌ | removed from MAIN → moved to Elements ▸ Pricing |

---

## SAMPLE PAGE (section)

Order in `indexku.html`: **Auth**, **Blank**, **Email**, **Error**, **Landing**.
Standalone/frontend links (**Auth**, **Error**, **Landing**) open in a **new tab** (`target="_blank"`). Admin pages (**Blank**, **Email**) open in the same tab.

| Menu | Level | Target path | Status | Reuse from | Tab |
|---|---|---|---|---|---|
| **Auth** ▸ | L1 tree | `pages/auth/` | — | — | new |
| — Login | L2 | `pages/auth/login.html` | ✅ | exists | new |
| — Register | L2 | `pages/auth/register.html` | ✅ | exists | new |
| — Forgot Password | L2 | `pages/auth/forgot-password.html` | ✅ | exists | new |
| — Reset Password | L2 | `pages/auth/reset-password.html` | ✅ | exists | new |
| Blank | L1 lead | `pages/blank.html` | ✅ | `pages/blank.html` | same |
| Email | L1 lead | `pages/email.html` | ✅ | `pages/email.html` (admin gallery) | same |
| **Error** ▸ | L1 tree | `pages/error/` | — | — | new |
| — Error 404 | L2 | `pages/error/404.html` | ✅ | exists | new |
| — Error 500 | L2 | `pages/error/500.html` | ✅ | exists | new |
| — Maintenance | L2 | `pages/error/maintenance.html` | ✅ | exists (fix label typo "Maintanance"→"Maintenance") | new |
| **Landing** ▸ | L1 tree | `pages/landing/` | — | — | new |
| — Articles | L2 | `pages/landing/articles.html` | ✅ | `pages/blog.html` (+ `blog-detail.html`) | new |
| — Marketing | L2 | `pages/landing/marketing.html` | ✅ | `pages/landing.html` | new |

---

## SAMPLE MENU (section — menu-type/level demo)

| Menu | Level | Target path | Status | Reuse from |
|---|---|---|---|---|
| Level One | L1 lead | `pages/sample/level-one.html` | 🆕 | placeholder (from `blank.html`) |
| **Level One** ▸ | L1 tree | `pages/sample/level-one/` | — | — |
| — Level Two | L2 | `pages/sample/level-one/level-two.html` | 🆕 | placeholder |
| Multi Menu | L1 lead | `pages/sample/multi-menu.html` | 🆕 | reuse `pages/sub-menu-1.html` |

> Two items are intentionally labeled **"Level One"** (one single, one tree) to demo menu types; paths differ as above.

---

## Target folder tree

```
index.html                          (Dashboard)
pages/
  calendar.html  charts.html  invoice.html  mailbox.html  email.html  blank.html
  elements/
    assertions.html buttons.html cards.html code-block.html components.html
    icons.html loaders.html maps.html media.html modals.html pricing.html
    progress.html toasts.html typography.html
  forms/     basic.html advanced.html editor.html wizard.html
  tables/    basic-tables.html datatable.html
  auth/      login.html register.html forgot-password.html reset-password.html
  error/     404.html 500.html maintenance.html
  landing/   articles.html marketing.html   (+ article detail)
  sample/    level-one.html multi-menu.html
    level-one/ level-two.html
```

---

## Decisions (LOCKED — 13 Sep 2026)
1. Duplicate **Pricing** → removed from MAIN; kept only as `Elements ▸ Pricing`.
2. **Progress** & **Toasts** → separate new pages.
3. **Auth / Error / Landing** → open in a **new tab**; **Blank** & **Email** same tab.
4. **Reorganize** files into subfolders → **YES**.
5. **All page content in English** for consistency.
6. **File names match menu labels** (kebab-case).

## Staged execution
- **Stage 1** ✅ this mapping (English, incl. Blank).
- **Stage 2** — create subfolders; `git mv` reuse files to targets; fix moved files' asset/link depth (`../` → `../../`).
- **Stage 3** — create new pages (`elements/progress`, `elements/toasts`, `sample/*`) + `landing/`, `tables/` names; English content.
- **Stage 4** — new sidebar builder from `indexku.html` (labels + hrefs + `target="_blank"` for Auth/Error/Landing); regenerate drawer across **all pages** with correct depth prefixes.
- **Stage 5** — apply the menu to `index.html` (from `indexku.html`); ensure English content; verify links + `<div>` balance; commit.
