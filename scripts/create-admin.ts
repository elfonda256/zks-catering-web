import { hashPassword } from "../src/lib/password";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Galat: Variabel DATABASE_URL wajib disediakan.");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  const username = (process.argv[2] || "admin").trim();
  const password = process.argv[3] || "AdminZKS2026!";

  console.log(`Menyiapkan akun admin '${username}' ke database...`);
  const passwordHash = await hashPassword(password);

  await prisma.admin.upsert({
    where: { username },
    create: {
      username,
      passwordHash,
    },
    update: {
      passwordHash,
    },
  });

  console.log("=======================================================");
  console.log(`✓ SUKSES: Akun admin '${username}' berhasil disimpan di database!`);
  console.log(`  Username : ${username}`);
  console.log(`  Password : ${password}`);
  console.log("=======================================================");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Gagal memproses akun admin:", err);
  process.exit(1);
});
