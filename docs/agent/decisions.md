# Zahdan Kamal Sentosa: Catatan Keputusan Arsitektur & Bisnis Final (Fase 1)

Dokumen tata kelola keputusan arsitektur teknis dan aturan operasional bisnis untuk sistem katering Zahdan Kamal Sentosa.

## 1. Model Data, Pengguna, & Keamanan Akses
- **Tanpa Akun Pelanggan**: Pemesanan dilakukan sebagai tamu (*guest*). Tabel akun pengguna di database eksklusif hanya untuk Administrator (`Admin`).
- **Inisialisasi Admin Aman**: Kata sandi admin pertama wajib dibuat melalui perintah terminal interaktif satu kali (`npm run init-admin`) dengan input kata sandi yang disembunyikan di terminal (*masked/hidden input*). Dilarang menggunakan sandi bawaan atau membaca dari berkas `.env`. Parameter biaya scrypt (`N`, `r`, `p`, `maxmem`) ditentukan secara eksplisit dan diverifikasi terhadap rekomendasi keamanan terkini (seperti rekomendasi OWASP / RFC 7914) sebelum diterapkan.
- **Perlindungan Token Pesanan**: URL publik menggunakan token acak panjang 64 heksadesimal (`rawToken`). Basis data hanya menyimpan nilai hash satu arah SHA-256 (`accessTokenHash`).
- **Pencegahan Kebocoran URL**: Seluruh halaman pesanan menyertakan header keamanan HTTP `Referrer-Policy: no-referrer`. Log server diatur untuk menyamarkan nilai token.
- **Fitur Buat Ulang Tautan**: Admin dapat memicu pembuatan token baru jika pelanggan kehilangan tautan; token lama otomatis tidak berlaku seketika.
- **Perlindungan Spam**: Menerapkan kolom Honeypot, validasi waktu pengisian form, dan pembatasan laju (*Rate Limiting*) berbasis tabel PostgreSQL `RateLimitAttempt`.
- **Keamanan Data Rate Limiting**: `RateLimitAttempt` menyimpan HMAC dari alamat IP (bukan IP polos) menggunakan kunci rahasia internal, dengan mitigasi ambang batas bertingkat agar tidak salah memblokir pengguna pada jaringan IP bersama (seperti CGNAT operator seluler). Baris rate limit dihapus secara berkala dari basis data (rentang 24 sampai 72 jam).

## 2. Parameter & Alur Pemesanan Katering
- **Jeda Minimum Pemesanan (Zona Waktu Asia/Jakarta)**:
  - Total < 500 pcs: minimal 1 hari sebelum acara (H-1).
  - Total >= 500 pcs: minimal 3 hari sebelum acara (H-3).
  - Dihitung secara konsisten dari tanggal dan jam acara (`eventDate`).
- **Validasi Harga & Ongkos Kirim**:
  - Harga makanan dihitung murni di server berdasarkan tabel `MenuItem`.
  - Pesanan awal berstatus `WAITING_ADMIN_CONFIRMATION` tanpa total final dan dilarang membuat link bayar.
  - Ongkos kirim diinput langsung oleh admin, baru kemudian total tagihan dikunci.
  - Batas waktu H-1 pukul 23.59.59 WIB selalu dihitung langsung dari tanggal acara (`eventDate`), bukan dari kolom yang dapat bernilai null, dan dilarang membandingkan tanggal dengan null.
  - Admin dilarang mengunci total jika batas waktu H-1 pukul 23.59.59 WIB dari `eventDate` telah terlewat. Jika pesanan tidak dikonfirmasi admin hingga batas H-1 23.59.59 WIB terlampaui, status otomatis berubah menjadi `EXPIRED_UNCONFIRMED_BY_ADMIN`.
- **Skema Uang Muka (DP) & Pelunasan**:
  - Persentase DP bernilai 20% dari total pesanan di luar ongkir, disimpan di tabel `Setting` (dinamis).
  - Nominal DP dibulatkan ke atas ke rupiah penuh (`Math.ceil`).
  - Opsi DP hanya muncul jika total dikunci admin paling lambat H-2 tanggal acara. Jika dikunci pada H-1, hanya ada opsi bayar lunas 100%.
  - Batas bayar awal: `min(confirmedAt + 24 jam, batas H-1 23.59.59 WIB dari eventDate)`. Admin diberi peringatan visual jika sisa waktu < 3 jam saat mengunci.
  - Batas waktu pelunasan: Pukul 23.59.59 WIB pada H-1 tanggal acara (sisa makanan + seluruh ongkir dibayar saat pelunasan).
- **Notifikasi Awal**: Dilakukan secara manual oleh admin melalui WhatsApp.

## 3. Jalur Pembatalan & Pengembalian Dana
- **Jalur (a) - Ditolak Admin di Awal**: Status `REJECTED_BY_ADMIN` (tanpa biaya).
- **Jalur (b) - Batal Sepihak oleh Admin Pasca-Bayar**: Status `CANCELLED_BY_ADMIN_REFUND_REQ` -> `REFUNDED` (uang pelanggan 100% dikembalikan penuh karena kendala operasional katering).
- **Jalur (c) - Batal oleh Pelanggan Pra-Bayar**: Status `CANCELLED_BY_CUSTOMER` (pesanan ditutup tanpa denda).
- **Jalur (d) - Batal oleh Pelanggan Pasca-DP / Lewat Batas H-1 23.59 WIB**: Status `CANCELLED_DP_FORFEITED` (Uang Muka/DP hangus sesuai syarat yang disetujui).
- **Jalur (e) - Batal oleh Pelanggan Pasca-Lunas Penuh**: Status `CANCELLED_FULL_REFUND_PENDING` -> `REFUNDED` (Nilai setara DP 20% hangus, sisa 80% dan ongkos kirim dikembalikan kepada pelanggan).

## 4. Keamanan Transaksi, Webhook Netral, & Mekanisme Batas Waktu
- **Referensi Gateway Unik per Percobaan Bayar**: Nilai `paymentRef` wajib unik per setiap percobaan pembayaran (menggunakan format `orderCode-JENIS-ATTEMPT` atau akhiran unik acak), bukan hanya per pesanan atau per jenis pembayaran.
- **Anti Tagihan Ganda**: Maksimal satu record `Payment` berstatus `PENDING` per tahap per pesanan. Pembuatan sesi baru otomatis membatalkan sesi pending sebelumnya.
- **Pengaman Mock Gateway**: `MockPaymentAdapter` dilarang keras aktif pada `NODE_ENV === 'production'`.
- **Verifikasi Webhook**: Netral terhadap penyedia melalui `PaymentGatewayAdapter`, mencocokkan nominal (`receivedAmount == payment.amount`), idempoten, dan memvalidasi stempel waktu resmi penyedia (`settledAt`).
- **Mekanisme Waktu Otomatis & Masa Tenggang**:
  - Menggunakan pola Hibrida: evaluasi aman saat akses berbalut transaksi database PostgreSQL idempoten, ditambah penyapu berkala.
  - Sebelum menghanguskan DP atau mengedaluwarsakan pesanan karena batas waktu, sistem WAJIB memeriksa terlebih dahulu apakah ada pembayaran `PENDING` dan memeriksa status resminya ke gateway (API server) menggunakan `settledAt`.
  - Diberikan masa tenggang (*grace period*) sebelum menetapkan status akhir; dilarang menghanguskan atau mengedaluwarsakan transaksi hanya karena waktu sistem lokal melewati batas.
- **Retensi Data Pribadi & Penonaktifan Token**:
  - Data pribadi pelanggan (Nama, Telepon, Alamat, Email) disamarkan di database setelah 90 hari terhitung sejak tanggal acara (`eventDate`) atau sejak status akhir tercapai (`REJECTED_BY_ADMIN`, `CANCELLED_*`, `EXPIRED*`, `COMPLETED`), mana yang berlaku.
  - Data keuangan (nominal, tanggal transaksi, status pembayaran) dipertahankan permanen untuk keperluan pembukuan dan akuntansi.
  - Token akses publik (`accessTokenHash`) dinonaktifkan pada saat yang bersamaan dengan penyamaran data pribadi.

## 5. Strategi Pengujian (Testing Strategy)
- **Logika Bisnis Murni Terisolasi**: Seluruh logika bisnis murni (perhitungan harga, pembulatan DP, validasi batas waktu acara, formula jeda pemesanan) dipisahkan ke dalam modul mandiri dengan impor relatif saja (`./` atau `../`), tanpa alias `@/` dan tanpa ketergantungan pada runtime Next.js.
- **Alias `@/`**: Tidak digunakan pada impor Node.js murni untuk menghindari masalah resolusi modul subpath.
- **Percobaan `node:test` TypeScript**: Percobaan kecil `node:test` pada TypeScript dilakukan di awal Fase 2 atau 3 dan ditandai belum terbukti (*unverified*) sampai berhasil dijalankan dan diverifikasi pada fase tersebut.

## 6. Daftar Keputusan yang Ditunda dan Fasenya
Keputusan teknologi berikut secara sengaja ditunda dan akan diputuskan bersama pengguna pada fase masing-masing:
1. **Cara Menjalankan PostgreSQL Lokal (Dev)**: Diputuskan **sebelum Fase 3** (Opsi: Docker Compose vs Native Homebrew vs Cloud DB).
2. **Versi Prisma (v7 GA vs v8 RC)**: Diputuskan pada **Fase 3**.
3. **Versi NextAuth / Auth.js (v4 GA vs v5 Beta)**: Diputuskan pada **Fase 4**.
4. **Penyedia Pembayaran (Midtrans vs Xendit vs TriPay)**: Diputuskan **sebelum Fase 7C**.
5. **Penyedia Hosting & Cron Scheduler (Vercel vs VPS vs PaaS)**: Diputuskan **sebelum Fase 8**.

---
## 7. Hasil Fase 2 dan Temuan yang Diketahui (2026-10-12)
- Scaffold dibuat di folder sementara, lalu disalin ke proyek tanpa menyalin AGENTS.md buatan
  generator. `npm ci` memasang 364 paket. `npm run lint` dan `npm run build` keduanya exit code 0.
- Opsi bawaan template `cacheComponents` dan `partialPrefetching` di next.config.ts aktif dan build
  berhasil dengan keduanya. Keputusan memakainya atau tidak ditunda ke Fase 5 setelah membaca
  dokumentasi bawaan di node_modules/next/dist/docs/.
- Temuan: npm memperingatkan bahwa eslint 9.39.5 "no longer supported". Perlu dicek ulang sebelum rilis.
- Temuan: `npm audit` melaporkan 5 kerentanan severity high dalam satu rantai dependensi
  (eslint-config-next, @next/eslint-plugin-next, fast-glob, micromatch, braces) yang menurut
  laporan audit berada pada alat pengembangan. Penilaian risiko praktisnya rendah dan belum diuji.
  Jangan menjalankan `npm audit fix --force`, karena akan menurunkan eslint-config-next ke 14.2.35.
  Cek ulang `npm audit` sebelum rilis.
- Paket @tailwindcss/turbopack dipasang template; metadata registry menunjukkan repositori
  tailwindlabs/tailwindcss.
- Jeda minimum pemesanan dihitung per hari
  kalender (pesanan masuk paling lambat pukul 23.59 WIB pada hari batas), bukan per 24 jam dari jam acara.
- Penyamaran data pribadi ditunda selama refund
  atau sengketa pembayaran untuk pesanan itu belum selesai.

## 8. Database Pengembangan (2026-10-12)
- Dipilih: Postgres.app (PostgreSQL 18.6, Apple Silicon) untuk database lokal. Homebrew dan Docker
  tidak terpasang di Mac pengguna.
- Server mendengarkan hanya di 127.0.0.1:5432 dan [::1]:5432 (diverifikasi dengan lsof). Jika terlihat
  *:5432, berhenti dan laporkan.
- Database proyek: zks_catering_dev. Hanya data palsu; dilarang menaruh data pelanggan asli.
- Postgres.app tidak ditambahkan ke PATH sistem. Gunakan jalur penuh
  /Applications/Postgres.app/Contents/Versions/latest/bin/ untuk psql dan createdb.
- Kecocokan PostgreSQL 18 dengan Prisma belum diverifikasi; diputuskan di Fase 3 bersama versi Prisma.
- Alamat koneksi database tidak boleh ditulis di repositori; hanya di file .env* yang diabaikan git
  (dibuat di Fase 3).

*Fase 2 selesai (lint dan build lolos). Database pengembangan siap. Fase 3 menunggu keputusan versi
Prisma dan persetujuan eksplisit.*
