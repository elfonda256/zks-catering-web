"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { MAX_BANK_ACCOUNTS, validateBankAccounts } from "@/modules/settings/bank-accounts";
import { saveBankAccounts } from "@/modules/settings/services/settings.repository";

export interface SettingsActionResult {
  error?: string;
  success?: boolean;
}

export async function saveBankAccountsAction(form: FormData): Promise<SettingsActionResult> {
  try {
    await requireAdmin();
    const rows = Array.from({ length: MAX_BANK_ACCOUNTS }, (_, i) => ({
      bank: String(form.get(`bank-${i}`) ?? ""),
      number: String(form.get(`number-${i}`) ?? ""),
      holder: String(form.get(`holder-${i}`) ?? ""),
    }));
    const result = validateBankAccounts(rows);
    if (!result.ok) return { error: result.error };

    await saveBankAccounts(result.value);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan rekening:", err);
    return { error: "Rekening belum tersimpan karena kendala sistem." };
  }
}
