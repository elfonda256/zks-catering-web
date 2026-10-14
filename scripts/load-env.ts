/**
 * scripts/load-env.ts
 *
 * Memuat variabel lingkungan dari berkas .env sebelum modul lain dievaluasi.
 * Modul ini harus diimpor paling awal pada skrip CLI lokal.
 */
try {
  process.loadEnvFile();
} catch {
  // Biarkan berlanjut jika .env tidak ditemukan atau sudah dimuat oleh runner
}
