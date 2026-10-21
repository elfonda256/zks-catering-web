/**
 * Runtime validation schemas for Supplier Relationship Management (SRM)
 */

export interface SupplierValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSupplierForm(data: {
  name: string;
  category: string;
  picName: string;
  phone: string;
  email: string;
  npwp: string;
  city: string;
}): SupplierValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Nama perusahaan supplier minimal 3 karakter.";
  }
  if (!data.category || data.category.trim().length === 0) {
    errors.category = "Kategori komoditas wajib dipilih.";
  }
  if (!data.picName || data.picName.trim().length < 3) {
    errors.picName = "Nama PIC wajib diisi minimal 3 karakter.";
  }
  if (!data.phone || data.phone.trim().length < 8) {
    errors.phone = "Nomor telepon PIC tidak valid (minimal 8 digit).";
  }
  if (!data.email || !data.email.includes("@")) {
    errors.email = "Alamat email resmi tidak valid.";
  }
  if (!data.npwp || data.npwp.trim().length < 15) {
    errors.npwp = "Nomor Pokok Wajib Pajak (NPWP) minimal 15 digit format resmi.";
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = "Kota domisili operasional wajib diisi.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCommunicationLog(subject: string, notes: string): { isValid: boolean; error?: string } {
  if (!subject || subject.trim().length < 4) {
    return { isValid: false, error: "Subjek komunikasi minimal 4 karakter." };
  }
  if (!notes || notes.trim().length < 10) {
    return { isValid: false, error: "Catatan interaksi minimal 10 karakter." };
  }
  return { isValid: true };
}
