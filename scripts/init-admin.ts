import "./load-env";
import readline from "node:readline";
import { hashPassword } from "../src/lib/password";
import { prisma } from "../src/lib/prisma";

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Membaca kata sandi secara interaktif dari terminal:
 * - Menampilkan satu tanda '*' per karakter yang diketik
 * - Menangani Backspace ('\b \b') untuk menghapus karakter terakhir
 * - Menangani Ctrl+C untuk membatalkan proses dengan rapi
 * - Mendukung fallback jika dijalankan di lingkungan non-TTY
 */
function askPasswordWithMask(query: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return askQuestion(query);
  }

  return new Promise((resolve) => {
    process.stdout.write(query);

    let password = "";

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const onKeypress = (
      str: string | undefined,
      key: { name?: string; ctrl?: boolean; meta?: boolean } | undefined
    ) => {
      // 1. Tangani Ctrl+C (pembatalan oleh pengguna)
      if ((key?.ctrl && key?.name === "c") || str === "\u0003") {
        cleanup();
        process.stdout.write("\nProses dibatalkan.\n");
        process.exit(130);
      }

      // 2. Tangani Enter / Return (selesai memasukkan kata sandi)
      if (key?.name === "return" || key?.name === "enter" || str === "\r" || str === "\n") {
        cleanup();
        process.stdout.write("\n");
        resolve(password);
        return;
      }

      // 3. Tangani Backspace (0x08, 0x7f / DEL)
      if (
        key?.name === "backspace" ||
        str === "\b" ||
        str === "\x7f" ||
        str === "\u007f"
      ) {
        if (password.length > 0) {
          password = password.slice(0, -1);
          // Gerakkan kursor mundur 1 spasi, tulis spasi untuk menghapus '*', gerakkan kursor mundur lagi
          process.stdout.write("\b \b");
        }
        return;
      }

      // 4. Abaikan tombol navigasi, escape sequence, atau shortcut fungsi lain
      if (key?.ctrl || key?.meta || (str && str.includes("\x1b"))) {
        return;
      }

      // 5. Tangani karakter yang dapat dicetak (printable characters)
      if (str && str.length > 0) {
        const printable = str.replace(/[\x00-\x1f\x7f]/g, "");
        if (printable.length > 0) {
          password += printable;
          process.stdout.write("*".repeat(printable.length));
        }
      }
    };

    function cleanup() {
      process.stdin.off("keypress", onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    }

    process.stdin.on("keypress", onKeypress);
    process.stdin.resume();
  });
}

async function main() {
  console.log("==========================================");
  console.log(" Inisialisasi Akun Admin (ZKS Catering)   ");
  console.log("==========================================");

  const username = await askQuestion("Masukkan nama pengguna (username): ");
  if (!username) {
    console.error("Galat: Nama pengguna tidak boleh kosong.");
    process.exit(1);
  }

  // Periksa apakah username sudah ada di database
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.error(`Galat: Nama pengguna '${username}' sudah terdaftar.`);
    process.exit(1);
  }

  const password = await askPasswordWithMask("Masukkan kata sandi (minimal 12 karakter): ");
  console.log(`(${password.length} karakter diterima)`);

  if (password.length < 12) {
    console.error("Galat: Panjang kata sandi minimal 12 karakter.");
    process.exit(1);
  }

  const confirmPassword = await askPasswordWithMask("Konfirmasi kata sandi: ");
  console.log(`(${confirmPassword.length} karakter diterima)`);

  if (password !== confirmPassword) {
    console.error("Status konfirmasi: Kata sandi tidak cocok. Kedua entri berbeda.");
    process.exit(1);
  }
  console.log("Status konfirmasi: Kata sandi cocok.");

  console.log("Menghitung hash scrypt...");
  const passwordHash = await hashPassword(password);

  await prisma.admin.create({
    data: {
      username,
      passwordHash,
    },
  });

  console.log("Akun admin berhasil dibuat.");
}

main()
  .catch((err) => {
    console.error("Terjadi galat saat membuat admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
