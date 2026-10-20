export interface CompanyContact {
  name: string;
  role: string;
  phone: string;
  waNumber: string;
}

export interface ClientCompany {
  code: string;
  name: string;
  location: string;
  status: string;
}

export interface LegalCert {
  title: string;
  description: string;
  badge: string;
}

export const COMPANY_PROFILE = {
  name: "PT. Zahdan Kamal Sentosa",
  shortName: "ZKS Catering",
  tagline: "The Professional Catering Service",
  eyebrow: "Jasa Boga Profesional Sejak 2007",
  headline: "Solusi Catering Industri & Perusahaan yang Higienis, Bergizi, Halal & Tepat Waktu",
  description:
    "Mitra terpercaya penyedia makanan karyawan pabrik, kantor perusahaan, dan event korporat di kawasan industri Karawang (KIIC, Surya Cipta, KIM) dengan sertifikasi ISO 22000 dan Laik Hygiene Sanitasi.",
  address: "Perumahan Griya Indah Blok D1 No. 19, Desa Parung Mulya, Kec. Ciampel, Kab. Karawang 41361",
  mainWhatsApp: "6281295490067",
  contacts: [
    {
      name: "Didiet Santoso",
      role: "Komisaris",
      phone: "+62 812-9549-0067",
      waNumber: "6281295490067",
    },
    {
      name: "Nur Anisah",
      role: "Direktur Utama",
      phone: "+62 812-8858-3455",
      waNumber: "6281288583455",
    },
    {
      name: "Dedi Tumelap",
      role: "General Manager",
      phone: "+62 812-9549-0067",
      waNumber: "6281295490067",
    },
    {
      name: "Angellia",
      role: "Layanan Pelanggan",
      phone: "+62 878-8999-9338",
      waNumber: "6287889999338",
    },
  ] as CompanyContact[],
  legalCerts: [
    {
      title: "ISO 22000:2009",
      description: "Food Safety Management System tersertifikasi resmi (Register No. ZKS 221076 0001).",
      badge: "ISO 22000",
    },
    {
      title: "Sertifikasi Halal",
      description: "Menjamin seluruh bahan baku, peralatan, dan proses pengolahan memenuhi syariat halal.",
      badge: "Halal Resmi",
    },
    {
      title: "Laik Hygiene Sanitasi Gol. B",
      description: "Standar mutu kebersihan sanitasi jasa boga industri yang diverifikasi Dinas Kesehatan.",
      badge: "Dinkes Gol. B",
    },
    {
      title: "HACCP Certified",
      description: "Hazard Analysis Critical Control Point untuk pencegahan kontaminasi bahaya pangan.",
      badge: "HACCP",
    },
    {
      title: "Legalitas Usaha Lengkap",
      description: "NIB: 241121002398 | NPWP: 21.018.177.2-433.000 | Akta Pendirian 2007 & SK Kemenkumham.",
      badge: "NIB & Pajak Resmi",
    },
  ] as LegalCert[],
  clients: [
    {
      code: "FCC",
      name: "PT. FCC Indonesia",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
    {
      code: "IPT",
      name: "PT. Indo Plating Technology Industry",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
    {
      code: "DFI",
      name: "PT. Daesang Food Indonesia",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
    {
      code: "AT",
      name: "PT. AT Indonesia",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
    {
      code: "AFG",
      name: "PT. Asahimas Flat Glass",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
    {
      code: "ISI",
      name: "PT. Indosafety Sentosa Industry",
      location: "Kawasan Industri Karawang",
      status: "Klien Aktif",
    },
  ] as ClientCompany[],
  advantages: [
    {
      title: "Lokasi Strategis di Karawang",
      desc: "Dekat dengan kawasan industri KIIC, Surya Cipta, dan KIM, menjamin waktu tempuh pengantaran tetap singkat dan makanan tiba dalam kondisi hangat.",
    },
    {
      title: "Siap Pengiriman 24 Jam (Shift Pabrik)",
      desc: "Armada operasional mandiri siap melayani jadwal kerja shift pagi, siang, maupun malam untuk operasional pabrik yang berjalan non-stop.",
    },
    {
      title: "Sistem Air Higienis & Water Treatment",
      desc: "Menggunakan air bersih PDAM yang melalui instalasi filtrasi dan water treatment khusus dapur untuk pencucian bahan dan proses memasak.",
    },
    {
      title: "Juru Masak Berpengalaman & Rasa Konsisten",
      desc: "Standar gramasi ketat dan resep racikan khas agar cita rasa masakan sedap, higienis, dan tidak membosankan bagi karyawan harian.",
    },
    {
      title: "Protokol Kebersihan & APD Lengkap",
      desc: "Tim dapur mengenakan masker, penutup kepala, sarung tangan, serta rutin menjalani uji kesehatan berkala dan inspeksi pest control.",
    },
    {
      title: "Pembukuan & Faktur Pajak Resmi",
      desc: "Kemudahan administrasi keuangan perusahaan dengan dokumen penagihan, invoice resmi, dan kelengkapan pajak usaha.",
    },
  ],
};

export interface DailyMenuItem {
  day: string;
  variations: string[][];
}

export interface MenuPackage {
  id: string;
  price: number;
  name: string;
  description: string;
  idealFor: string;
  itemsSummary: string;
  schedule: Record<string, string[][]>;
}

export const MENU_PACKAGES: Record<number, MenuPackage> = {
  17000: {
    id: "pkg-17000",
    price: 17000,
    name: "Paket Hemat Industri",
    description: "Pilihan ekonomis dengan komposisi gizi seimbang harian untuk karyawan pabrik.",
    idealFor: "Karyawan Pabrik, Konsumsi Harian Shift, Nasi Box Ekonomis",
    itemsSummary: "Nasi Putih + 1 Lauk Utama + 1 Lauk Pendamping + 1 Sayur + Kerupuk + Sambal + Buah",
    schedule: {
      Senin: [
        ["Nasi Putih", "Ayam Pop", "Risol", "Orek Tempe", "Taoge Tahu", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Serundeng", "Tempe Goreng", "Bakwan", "Capcay Kuah", "Sambal", "Kerupuk", "Salak"],
        ["Nasi Putih", "Ikan Sarden", "Tempe Bacem", "Tumis Kentang", "Soto Segar", "Sambal", "Kerupuk", "Salak"],
        ["Nasi Putih", "Ayam Kare", "Risol", "Cah Tempe", "Sop Makaroni", "Sambal", "Kerupuk", "Salak"],
      ],
      Selasa: [
        ["Nasi Putih", "Ayam Goreng Mentega", "Tahu Semur", "Mie Goreng", "Capcay Kuah", "Sambal", "Kerupuk", "Salak"],
        ["Nasi Putih", "Ikan Balado", "Tahu Pong", "Cah Tahu", "Sop Oyong", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Ayam Rica-Rica", "Tahu Pong", "Mie Goreng", "Karedok", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Semur Telur", "Tahu Isi", "Bakwan", "Tumis Oyong", "Sambal", "Kerupuk", "Semangka"],
      ],
      Rabu: [
        ["Nasi Putih", "Bawal Pesmol", "Bihun Goreng", "Cah Tempe", "Sop Kaldu", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Kremes Gurih", "Kwetiau", "Mie Goreng", "Sop Makaroni", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ayam Goreng Mentega", "Mie Kuah", "Pangsit Goreng", "Capcay Goreng", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Sapi Lada Hitam", "Tempe Mendoan", "Mie Goreng", "Sop Sawi Jagung", "Sambal", "Kerupuk", "Melon"],
      ],
      Kamis: [
        ["Nasi Putih", "Telur Balado", "Tahu Goreng", "Gulai Pepaya", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Telur Semur", "Otak-Otak", "Pangsit Balado", "Sop Jagung Manis", "Sambal", "Kerupuk", "Salak"],
        ["Nasi Putih", "Pepes Jambal", "Cah Bakso", "Tahu Goreng", "Gulai Labu", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Telur Dadar Sayur", "Cah Tahu", "Bihun Kuah", "Mix Vegetable", "Sambal", "Kerupuk", "Jeruk"],
      ],
      Jumat: [
        ["Nasi Putih", "Ayam Singapore", "Tempe Goreng", "Sayur Asem Segar", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Bandeng Tauco", "Tahu Isi", "Bihun Goreng", "Urap-Urap", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Tongseng Daging", "Kentang Kecap", "Tempe Goreng", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Goreng Bumbu", "Teri Kacang", "Tahu Bacem", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
      ],
      Sabtu: [
        ["Nasi Putih", "Gulai Ikan", "Risol", "Tahu Kecap", "Cah Sayur", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ikan Bakar Bumbu", "Tempe Orek", "Mie Goreng", "Cah Taoge", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Goreng Spesial", "Telur Ceplok", "Bakwan Sayur", "Pangsit", "Sayur Lodeh", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Bacem", "Tempe Goreng", "Otak-Otak", "Cah Taoge", "Sambal", "Kerupuk", "Semangka"],
      ],
    },
  },
  20000: {
    id: "pkg-20000",
    price: 20000,
    name: "Paket Favorit Korporat",
    description: "Kombinasi 2 lauk utama (Ayam/Daging/Ikan) untuk asupan energi dan produktivitas maksimal.",
    idealFor: "Karyawan Shift Panjang, Staf Kantor, Meeting Internal",
    itemsSummary: "Nasi Putih + 2 Lauk Utama + 1 Lauk Pendamping + 1 Sayur + Kerupuk + Sambal + Buah",
    schedule: {
      Senin: [
        ["Nasi Putih", "Ayam Pop", "Ikan Sarden", "Risol", "Taoge Tahu", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Serundeng", "Ikan Sarden", "Tempe Goreng", "Capcay Kuah", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ikan Sarden", "Ayam Bumbu Balado", "Tempe Bacem", "Soto", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ayam Kare", "Cumi Saus Padang", "Risol", "Sop Makaroni", "Sambal", "Kerupuk", "Pisang"],
      ],
      Selasa: [
        ["Nasi Putih", "Ayam Goreng Mentega", "Ikan Balado", "Tahu Semur", "Capcay Kuah", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ikan Balado", "Ayam Rendang", "Tahu Pong", "Sop Oyong", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Ayam Rica-Rica", "Telur Asin", "Tahu Pong", "Karedok Segar", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Semur Telur", "Bandeng Presto", "Tahu Isi", "Tumis Oyong", "Sambal", "Kerupuk", "Melon"],
      ],
      Rabu: [
        ["Nasi Putih", "Bawal Pesmol", "Ayam Semur", "Bihun Goreng", "Sop Kaldu", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Kremes", "Ikan Asam Manis", "Kwetiau", "Sop Makaroni", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Goreng Mentega", "Ikan Bumbu Kecap", "Mie Kuah", "Capcay Goreng", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Sapi Lada Hitam", "Ikan Woku", "Tempe Mendoan", "Sop Sawi Jagung", "Sambal", "Kerupuk", "Semangka"],
      ],
      Kamis: [
        ["Nasi Putih", "Telur Balado", "Ayam Goreng", "Cah Tempe", "Gulai Pepaya", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Telur Semur", "Ayam Woku", "Otak-Otak", "Sop Jagung Manis", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Pepes Jambal", "Ayam Saus Thailand", "Cah Bakso", "Gulai Labu", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Telur Dadar", "Pepes Ayam", "Cah Tahu", "Mix Vegetable", "Sambal", "Kerupuk", "Jeruk"],
      ],
      Jumat: [
        ["Nasi Putih", "Ayam Singapore", "Gulai Daging", "Tahu Goreng", "Sayur Asem Segar", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Bandeng Tauco", "Ayam Kalasan", "Tahu Isi", "Urap-Urap", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Tongseng Daging", "Teri Balado", "Kentang Kecap", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Goreng Bumbu", "Telur Ceplok", "Teri Kacang", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
      ],
      Sabtu: [
        ["Nasi Putih", "Gulai Ikan", "Ayam Rica", "Mie Goreng", "Cah Sayur", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Ikan Bakar", "Ayam Gulung Telur", "Tempe Orek", "Cah Taoge", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Goreng Spesial", "Telur Ceplok", "Ayam Serundeng", "Bakwan Sayur", "Sayur Lodeh", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Bacem", "Ikan Makarel", "Tempe Goreng", "Cah Taoge", "Sambal", "Kerupuk", "Semangka"],
      ],
    },
  },
  25000: {
    id: "pkg-25000",
    price: 25000,
    name: "Paket Eksekutif & Event",
    description: "Sajian premium dengan lauk daging/seafood spesial, porsi ekstra, dan pilihan pendamping lengkap.",
    idealFor: "Rapat Direksi, Jamuan Tamu Perusahaan, Gathering & Event Spesial",
    itemsSummary: "Nasi Putih + 2 Lauk Premium + 2 Lauk Pendamping + 1 Sayur + Kerupuk + Sambal + Buah Pilihan",
    schedule: {
      Senin: [
        ["Nasi Putih", "Ayam Pop", "Ikan Sarden Bumbu", "Risol Daging", "Orek Tempe", "Taoge Tahu", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Serundeng", "Ikan Sarden", "Tempe Goreng", "Bakwan Udang", "Capcay Kuah", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ikan Sarden", "Ayam Fillet Bakar", "Tempe Bacem", "Tumis Kentang Daging", "Soto", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Kare", "Cumi Saus Padang", "Risol Daging", "Cah Tempe", "Sop Makaroni Bakso", "Sambal", "Kerupuk", "Jeruk"],
      ],
      Selasa: [
        ["Nasi Putih", "Ayam Goreng Mentega", "Ikan Balado", "Tahu Semur", "Mie Goreng Spesial", "Capcay Kuah", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ikan Balado", "Ayam Rendang Padang", "Tahu Pong", "Cah Tahu Bakso", "Sop Oyong Telur", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Ayam Rica Pedas", "Telur Asin Utuh", "Tahu Pong", "Mie Goreng", "Karedok Sunda", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Semur Telur", "Bandeng Presto Goreng", "Tahu Isi Sayur", "Bakwan Jagung", "Tumis Oyong", "Sambal", "Kerupuk", "Melon"],
      ],
      Rabu: [
        ["Nasi Putih", "Bawal Pesmol Bumbu Kuning", "Ayam Semur", "Bihun Goreng", "Tempe Goreng Tepung", "Sop Segar", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Ayam Kremes Spesial", "Ikan Asam Manis", "Kwetiau Goreng", "Mie Goreng", "Sop Makaroni", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ayam Goreng Mentega", "Ikan Bumbu Kecap", "Mie Kuah", "Pangsit Goreng Renyah", "Capcay Goreng", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Sapi Lada Hitam Empuk", "Ikan Woku", "Tempe Mendoan", "Mie Goreng", "Sop Sawi Jagung Manis", "Sambal", "Kerupuk", "Semangka"],
      ],
      Kamis: [
        ["Nasi Putih", "Telur Balado", "Ayam Goreng Kalasan", "Cah Tempe", "Risol Mayo", "Gulai Pepaya", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Telur Semur", "Ayam Woku Belanga", "Otak-Otak Ikan", "Pangsit Balado", "Sop Jagung Manis", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Pepes Jambal Roti", "Ayam Saus Thailand", "Cah Bakso Sosis", "Tahu Goreng", "Gulai Labu Kuning", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Telur Dadar Tebal", "Pepes Ayam Kemangi", "Cah Tahu Jamur", "Bihun Kuah", "Mix Vegetable", "Sambal", "Kerupuk", "Jeruk"],
      ],
      Jumat: [
        ["Nasi Putih", "Ayam Singapore", "Gulai Daging Sapi", "Tahu Goreng", "Tempe Goreng", "Sayur Asem Jakarta", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Bandeng Tauco", "Ayam Kalasan Legit", "Tahu Isi Bakso", "Bihun Goreng", "Urap-Urap Sayur", "Sambal", "Kerupuk", "Jeruk"],
        ["Nasi Putih", "Tongseng Daging Gurih", "Teri Balado Crispy", "Kentang Kecap", "Tempe Goreng", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
        ["Nasi Putih", "Ayam Goreng Bumbu Lengkuas", "Telur Ceplok Balado", "Teri Kacang", "Tahu Bacem", "Sayur Asem", "Sambal", "Kerupuk", "Pisang"],
      ],
      Sabtu: [
        ["Nasi Putih", "Gulai Ikan Kakap", "Ayam Rica", "Mie Goreng", "Tahu Kecap", "Cah Sayur Hijau", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Putih", "Ikan Bakar Madu", "Ayam Gulung Telur", "Tempe Orek Manis", "Mie Goreng", "Cah Taoge Ikan Asin", "Sambal", "Kerupuk", "Semangka"],
        ["Nasi Goreng Spesial ZKS", "Telur Ceplok", "Ayam Serundeng", "Bakwan Sayur", "Pangsit Goreng", "Sayur Lodeh", "Sambal", "Kerupuk", "Melon"],
        ["Nasi Putih", "Ayam Bacem Gurih", "Ikan Makarel Balado", "Tempe Goreng", "Otak-Otak Goreng", "Cah Taoge", "Sambal", "Kerupuk", "Melon"],
      ],
    },
  },
};
