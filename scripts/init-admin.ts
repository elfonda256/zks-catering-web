import "./load-env";
import { Writable } from "node:stream";
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

function askHiddenQuestion(query: string): Promise<string> {
  let muted = false;
  const mutableStdout = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) {
        process.stdout.write(chunk, encoding);
      }
      callback();
    },
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true,
  });

  return new Promise((resolve) => {
    process.stdout.write(query);
    muted = true;
    rl.question("", (answer) => {
      muted = false;
      process.stdout.write("\n");
      rl.close();
      resolve(answer);
    });
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

  const password = await askHiddenQuestion("Masukkan kata sandi (minimal 12 karakter): ");
  if (password.length < 12) {
    console.error("Galat: Panjang kata sandi minimal 12 karakter.");
    process.exit(1);
  }

  const confirmPassword = await askHiddenQuestion("Konfirmasi kata sandi: ");
  if (password !== confirmPassword) {
    console.error("Galat: Konfirmasi kata sandi tidak cocok.");
    process.exit(1);
  }

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
