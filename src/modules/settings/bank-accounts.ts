/** Company bank accounts shown to customers for transfers. Pure helpers, unit tested. */

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
}

export const BANK_ACCOUNTS_SETTING = "bank_accounts";
export const MAX_BANK_ACCOUNTS = 4;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/** Reads the stored JSON; anything malformed counts as "not set up yet" rather than crashing checkout. */
export function parseBankAccounts(stored: string | null | undefined): BankAccount[] {
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is BankAccount =>
        !!a && typeof a.bank === "string" && typeof a.number === "string" && typeof a.holder === "string"
    );
  } catch {
    return [];
  }
}

/** Validates rows from the settings form; fully empty rows are ignored. */
export function validateBankAccounts(rows: { bank: string; number: string; holder: string }[]): Result<BankAccount[]> {
  const accounts: BankAccount[] = [];
  for (const [index, row] of rows.entries()) {
    const bank = row.bank.trim();
    const number = row.number.trim();
    const holder = row.holder.trim();
    if (!bank && !number && !holder) continue;
    const label = `Rekening ${index + 1}`;
    if (bank.length < 2 || bank.length > 40) return { ok: false, error: `${label}: nama bank 2–40 karakter.` };
    if (!/^[0-9][0-9 .-]{4,30}[0-9]$/.test(number)) return { ok: false, error: `${label}: nomor rekening hanya angka (boleh spasi atau tanda hubung).` };
    if (holder.length < 3 || holder.length > 80) return { ok: false, error: `${label}: nama pemilik 3–80 karakter.` };
    accounts.push({ bank, number, holder });
  }
  if (accounts.length > MAX_BANK_ACCOUNTS) return { ok: false, error: `Maksimal ${MAX_BANK_ACCOUNTS} rekening.` };
  return { ok: true, value: accounts };
}

/** Lines for the WhatsApp bill; tells the customer to wait when no account is set up. */
export function bankAccountsForWhatsApp(accounts: BankAccount[]): string {
  if (accounts.length === 0) return "• Nomor rekening akan dikirim admin melalui WhatsApp.\n";
  return accounts.map((a) => `• ${a.bank} : ${a.number} a.n. ${a.holder}\n`).join("");
}
