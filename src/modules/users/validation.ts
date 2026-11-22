/** Validation for admin accounts. Pure, so it can be unit tested. */

export const MIN_PASSWORD_LENGTH = 12;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function validateUsername(raw: string): Result<string> {
  // Login matches usernames exactly, so case is kept as typed.
  const username = raw.trim();
  if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) {
    return { ok: false, error: "Username 3–32 karakter: huruf, angka, titik, garis bawah, atau tanda hubung, tanpa spasi." };
  }
  return { ok: true, value: username };
}

export function validateNewPassword(password: string, confirmation: string): Result<string> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }
  if (password.length > 128) return { ok: false, error: "Kata sandi maksimal 128 karakter." };
  if (password !== confirmation) return { ok: false, error: "Konfirmasi kata sandi tidak sama." };
  return { ok: true, value: password };
}

/** An admin may not delete their own account or the last remaining one. */
export function canDeleteAdmin(targetId: number, currentAdminId: number, adminCount: number): Result<true> {
  if (targetId === currentAdminId) return { ok: false, error: "Anda tidak bisa menghapus akun yang sedang dipakai." };
  if (adminCount <= 1) return { ok: false, error: "Minimal harus ada satu admin." };
  return { ok: true, value: true };
}
