# CHAPTER 12 — ENTERPRISE PREMIUM DESIGN LANGUAGE
## Sprint 01 — Enterprise UI Foundation | PT. Zahdan Kamal Sentosa Catering ERP

**Document Class**: Enterprise Design System & Visual Ergonomics Specification  
**Inspirations**: Linear, Stripe Dashboard, Vercel, Raycast, Microsoft 365 Admin Center, Apple HIG  
**Anti-Patterns Ban**: AdminLTE, Bootstrap 3/4 dashboards, Dribbble AI Slop, purposeless gradients, equal-sized KPI card arrays.

---

## 1. DESIGN DNA & ERGONOMIC PURPOSE

Aplikasi ERP katering industri ZKS bukan sekadar dashboard statistik; ini adalah **perangkat kerja operasional harian** yang digunakan oleh tim dapur, purchasing, gudang, dan logistik selama **8–10 jam per hari**.

Prinsip Utama:
- **Single Font Family**: Menggunakan SATU keluarga font (`Inter` / Apple / Stripe / Linear style) di seluruh Public Website dan ERP Admin. Tidak ada pencampuran font.
- **Low Fatigue**: Mengurangi kelelahan mata operator melalui palet 95% monokrom netral (Slate) dan kontras tajam.
- **Scannable Information**: Data numerik dan status dapat diidentifikasi dalam hitungan detik dengan tabular numbers (`font-mono tabular-nums`).
- **Zero Decoration**: Tidak ada ilustrasi kartun, gradien pelangi, atau border radius acak.
- **Predictable Geometry**: Mengikuti 8pt grid matematis, border radius 8px (kontrol) / 12px (kontainer), dan elevasi berbasis border hairlines.

---

## 2. ENTERPRISE TYPOGRAPHY SYSTEM

Satu keluarga font (`Inter`) digunakan secara konsisten di seluruh aplikasi dengan hirarki standar:

| Token Name | Font Size | Line Height | Weight | Tracking | Usage & Rules |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Display** | `36px` | `44px` | `700` (Bold) | `-0.025em` | Primary Hero KPI Metric (`tabular-nums font-mono`) |
| **H1** | `28px` | `36px` | `600` (SemiBold) | `-0.02em` | Judul Utama Halaman / Modul |
| **H2** | `22px` | `28px` | `600` (SemiBold) | `-0.015em` | Sub-Seksi & Panel Utama |
| **H3** | `18px` | `24px` | `600` (SemiBold) | `-0.01em` | Judul Kartu / Modal / Tabel Operasional |
| **Body Large** | `16px` | `24px` | `400` (Regular) | `normal` | Teks Pengantar / Hero Description |
| **Body** | `14px` | `20px` | `400` (Regular) | `normal` | Teks Data, Deskripsi, Form Input |
| **Caption** | `12px` | `16px` | `400` (Regular) | `normal` | Metadata, Subtitle, Helper Text |
| **Label** | `11px` | `14px` | `600` (SemiBold) | `+0.05em` | Label Kolom Tabel & Micro-Tags (`uppercase`) |

> [!IMPORTANT]
> Seluruh angka finansial (Rupiah), kuantitas stok (kg, liter, porsi), SKU, dan persentase **wajib menggunakan angka tabular (`font-mono tabular-nums`)** agar angka sejajar secara vertikal dan tidak bergeser saat diperbarui.

---

## 3. SPACING SYSTEM (8pt Grid)

Hanya nilai-nilai kelipatan 8 (dengan toleransi half-step 4px untuk elemen mikro) yang diperbolehkan di seluruh antarmuka:

- `4px` (`gap-1`, `p-1`) — Jarak micro-badge, dot status, tag.
- `8px` (`gap-2`, `p-2`) — Jarak inline button, icon-to-label, padding tombol kecil.
- `12px` (`gap-3`, `p-3`) — Padding vertikal sel tabel, padding input teks.
- `16px` (`gap-4`, `p-4`) — Padding internal kartu compact, form field spacing.
- `24px` (`gap-6`, `p-6`) — Padding standar kartu operasional, gap antar kartu.
- `32px` (`gap-8`, `p-8`) — Pemisah antar seksi fungsional modul.
- `40px` (`gap-10`, `p-10`) — Spacer pemisah panel sekunder.
- `48px` (`gap-12`, `p-12`) — Jarak vertikal mayor view pacing.
- `64px` (`gap-16`, `p-16`) — Margin luar kanvas utama ke tepi layar.

---

## 4. COLOR SYSTEM (95% Monochrome + 5% Semantic Accent)

### 95% Monochrome Palette (Low Eye Strain):
- **Canvas / Background**: White (`#FFFFFF`) & Slate-50 (`#F8FAFC`)
- **Card Surface**: White (`#FFFFFF`)
- **Border**: Slate-200 (`#E2E8F0`) hairline border
- **Subtle Border**: Slate-100 (`#F1F5F9`)
- **Text Primary**: Slate-900 (`#0F172A`)
- **Text Secondary**: Slate-600 (`#475569`)
- **Text Muted**: Slate-500 (`#64748B`)

### 5% Semantic Accents Only:
- **Primary Action**: Blue-600 (`#2563EB`, hover `#1D4ED8`)
- **Success / Healthy**: Emerald-700 (`#15803D`, bg `#F0FDF4`, border `#BBF7D0`)
- **Warning / Review**: Amber-700 (`#B45309`, bg `#FFFBEB`, border `#FDE68A`)
- **Danger / Critical**: Red-700 (`#B91C1C`, bg `#FEF2F2`, border `#FECACA`)

---

## 5. ENTERPRISE CHART DESIGN SYSTEM

Seluruh visualisasi data wajib mematuhi standar desain industri catering:
1. **Ultra-thin Grid**: Garis panduan horisontal tipis `border-b border-slate-100` dengan label angka di sebelah kiri.
2. **Rounded Bar Caps**: Bar grafik memiliki sudut melengkung 4px di bagian atas (`rounded-t-[4px]`).
3. **Restrained Color**: Warna default bar adalah Slate-400 netral, berubah menjadi Blue-600 hanya saat di-hover oleh kursor.
4. **Interactive Floating Tooltips**: Tooltip hitam minimalis (`bg-slate-900 text-white text-[11px]`) muncul presisi di atas bar dengan data `tabular-nums`.
5. **Purposeful Metrics**: Setiap grafik wajib menjawab pertanyaan operasional nyata:
   - *Berapa persen kapasitas kompor dan oven dapur sentral yang terpakai hari ini?*
   - *Berapa rasio pengiriman bahan baku on-time vendor bulan ini?*

---

## 6. MOTION DESIGN SYSTEM

Animasi hanya diizinkan untuk memberikan **umpan balik fisika dan kejelasan fungsional**, bukan dekorasi:
- **Rentang Durasi**: `150ms` s/d `250ms` (maksimal).
- **Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy enterprise deceleration).
- **Interaksi Mikro yang Didukung**:
  1. *Sidebar Collapse/Expand*: `200ms ease-in-out`
  2. *Card Hover*: `transition-all duration-200 ease-out hover:border-slate-300`
  3. *Button Press*: `150ms ease-out active:scale-[0.98]`
  4. *Table Row Hover*: `150ms ease-out bg-slate-50/70`
  5. *Live Status Dot*: `animate-pulse` lembut untuk pesanan baru / bukti transfer
  6. *Skeleton Shimmer*: `animate-pulse` monokrom Slate-100 pengganti spinner liar
  7. *Modal & Dialog Fade*: `150ms ease-out animate-in fade-in zoom-in-95`

---

## 7. CARD SYSTEM

- **Radius Tunggal**: `12px` (`rounded-[12px]`) seragam di seluruh card, modal, input, tabel, dan tombol.
- **Border-First Elevation**:
  - `Level 0`: `border border-slate-200/80` (flat, no shadow)
  - `Level 1`: `border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]` (card standar)
  - `Level 2`: `border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.06)]` (modal & popover)
- **Struktur Konten**:
  - `CardHeader`: Judul 16px font-medium + action slot terpisah oleh garis tipis `border-slate-100`.
  - `CardContent`: Padding 24px (`p-6`) atau compact 16px (`p-4`).
  - `CardFooter`: Garis pemisah bawah tipis dengan tombol aksi di pojok kanan.

---

## 8. TABLE EXPERIENCE

Tabel adalah komponen inti ERP yang paling sering dipandang operator:
1. **Sticky Header**: `sticky top-0 bg-slate-50 z-10 border-b border-slate-200` menjamin judul kolom tetap terlihat saat scroll panjang.
2. **Tabular Alignment**:
   - Teks deskriptif $\rightarrow$ Rata Kiri (`text-left`)
   - Tanggal & Status $\rightarrow$ Rata Tengah (`text-center`)
   - Angka stok, berat kg, harga Rp $\rightarrow$ Rata Kanan (`text-right font-mono tabular-nums`)
3. **Hover Experience**: Background baris berubah halus ke `bg-slate-50/70` dengan cursor pointer jika baris dapat diklik.
4. **Clean Sorting Indicators**: Indikator panah sorting (`▲`, `▼`, `⇅`) berwarna Slate-400 yang rapi.
5. **Integrated Empty & Loading Rows**: `TableLoadingRow` dengan skeleton loading dan `TableEmptyRow` dengan pesan panduan operasional.

---

## 9. SIDEBAR REFINEMENT

- **Iconography**: Seluruh ikon menggunakan SVG seragam `18x18px` dengan ketebalan garis `strokeWidth 1.75`.
- **Active State**: Item aktif ditandai dengan latar `bg-blue-50 text-blue-700 font-semibold border border-blue-200/80` pada mode expanded, dan indikator garis biru vertikal pada mode collapsed.
- **Section Headers**: Teks kategori huruf kapital `text-[10px] uppercase tracking-wider text-slate-400` dengan accordion chevron yang dapat dilipat.
- **Memory Persistence**: Status lipatan disimpan secara instan di `localStorage` menggunakan hook `useSyncExternalStore` tanpa hydration flicker.

---

## 10. ACCESSIBILITY & ERGONOMICS (WCAG 2.2 AA/AAA)

- **Contrast Ratio**: Seluruh teks memenuhi rasio kontras $\ge 4.5:1$ untuk teks normal dan $\ge 3:1$ untuk teks display.
- **Focus States**: Setiap elemen interaktif memiliki `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
- **Screen Reader Support**: Tag semantic HTML (`<aside>`, `<header>`, `<main>`, `<table>`, `<thead >`, `<tbody>`, `<button>`).
- **Keyboard Shortcuts**:
  - `⌘K` / `Ctrl+K`: Membuka pencarian global seluruh entitas.
  - `⌘B` / `Ctrl+B`: Membuka / menutup sidebar.
  - `Escape`: Menutup modal atau dropdown.

---

## 11. BUSINESS TERMINOLOGY MATRIX (CATERING ERP DOMAIN)

Rekomendasi pembaruan terminologi status untuk modul-modul mendatang:

| Istilah Lama | Rekomendasi Industri Katering | Alasan Bisnis & Operasional |
| :--- | :--- | :--- |
| `Active` (Supplier) | **`Approved Vendor`** | Menandakan vendor telah lolos kurasi legalitas, sertifikasi halal BPJPH, uji higienitas, dan syarat pembayaran term net. |
| `Preferred` (Supplier) | **`Preferred Partner (Tier-1)`** | Vendor prioritas dengan SLA pengiriman kargo pagi terjamin dan diskon kuota volume besar. |
| `Probation` (Supplier) | **`Trial Period (30 Days)`** | "Probation" adalah istilah HR (karyawan). Untuk vendor bahan baku makanan, istilah standarnya adalah masa uji coba pasokan 30 hari. |
| `Review` (Supplier) | **`Under Audit / Review`** | Vendor yang memerlukan audit ulang karena adanya keluhan mutu, keterlambatan pengiriman $> 10\%$, atau sertifikasi kedaluwarsa. |
| `Inactive` (Supplier) | **`Dormant / Inactive`** | Vendor terdaftar resmi namun tidak memiliki transaksi PO aktif dalam 6 bulan terakhir. |
| `Suspended` (Supplier) | **`Suspended (Safety Hold)`** | Penghentian sementara rilis PO karena pelanggaran suhu cold-chain atau ketidaksesuaian mutu pangan kritis. |
| `Expired` (Inventory) | **`Expired (Disposal Hold)`** | Bahan baku melewati batas Best Before Date (BBD), dikarantina terpisah menunggu Berita Acara Pemusnahan Barang (BAPB). |
| `Quarantine` (Receiving) | **`QC Hold / Quarantine`** | Bahan segar yang baru tiba di dermaga loading dock sedang menunggu hasil uji sampel laboratorium / swab probe suhu. |
| `Reserved` (Inventory) | **`Allocated / Committed`** | Stok yang sudah dialokasikan ke Surat Perintah Kerja (SPK) masak dapur hari ini dan tidak boleh dialihkan ke pesanan lain. |
