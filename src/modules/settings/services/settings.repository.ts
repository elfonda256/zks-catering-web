/** Business settings stored in the Setting table. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { BANK_ACCOUNTS_SETTING, parseBankAccounts, type BankAccount } from "../bank-accounts";

export async function getBankAccounts(): Promise<BankAccount[]> {
  const setting = await prisma.setting.findUnique({ where: { key: BANK_ACCOUNTS_SETTING } });
  return parseBankAccounts(setting?.value);
}

export async function saveBankAccounts(accounts: BankAccount[]): Promise<void> {
  const value = JSON.stringify(accounts);
  await prisma.setting.upsert({
    where: { key: BANK_ACCOUNTS_SETTING },
    update: { value },
    create: { key: BANK_ACCOUNTS_SETTING, value, description: "Rekening tujuan transfer pelanggan" },
  });
}
