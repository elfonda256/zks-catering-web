import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { SettingsView } from "@/modules/settings/components/SettingsView";
import { getBankAccounts } from "@/modules/settings/services/settings.repository";

export const metadata: Metadata = {
  title: "Pengaturan usaha | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

async function Content() {
  return <SettingsView accounts={await getBankAccounts()} />;
}

export default function Page() {
  return (
    <AdminPage title="Pengaturan usaha" description="Data usaha yang dipakai di halaman pelanggan dan pesan WhatsApp.">
      <Content />
    </AdminPage>
  );
}
