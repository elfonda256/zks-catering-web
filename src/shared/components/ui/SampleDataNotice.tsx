/** Shown on admin modules that still run on sample data, so nobody mistakes it for real stock or orders. */
export function SampleDataNotice() {
  return (
    <p className="rounded-[12px] border border-amber-200 bg-amber-50/70 px-4 py-3 text-[13px] text-amber-950">
      <strong className="font-semibold">Data contoh.</strong> Modul ini belum tersambung ke database.
      <span className="hidden sm:inline">
        {" "}
        Angka di halaman ini hanya ilustrasi alur kerja, bukan stok atau transaksi ZKS yang sebenarnya.
      </span>
    </p>
  );
}
