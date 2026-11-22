/** Input validation for the supplier server action. Pure so it can be unit tested. */

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export interface SupplierInput {
  name: string;
  contactName: string | null;
  phone: string | null;
  area: string | null;
  paymentTerms: string | null;
  isActive: boolean;
}

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").replace(/\s+/g, " ").trim();
}

const PHONE = /^\+?[0-9][0-9 -]{5,18}$/;

export function parseSupplierInput(form: FormData): Result<SupplierInput> {
  const name = text(form, "name");
  const contactName = text(form, "contactName") || null;
  const phone = text(form, "phone") || null;
  const area = text(form, "area") || null;
  const paymentTerms = text(form, "paymentTerms") || null;
  const isActive = form.get("isActive") === "on";

  if (name.length < 2 || name.length > 80) return { ok: false, error: "Nama supplier 2–80 karakter." };
  if (contactName && contactName.length > 80) return { ok: false, error: "Nama kontak maksimal 80 karakter." };
  if (phone && !PHONE.test(phone)) return { ok: false, error: "Nomor telepon 6–19 digit, boleh diawali + (contoh 0812-3456-7890)." };
  if (area && area.length > 80) return { ok: false, error: "Area maksimal 80 karakter." };
  if (paymentTerms && paymentTerms.length > 80) return { ok: false, error: "Ketentuan pembayaran maksimal 80 karakter." };

  return { ok: true, value: { name, contactName, phone, area, paymentTerms, isActive } };
}
