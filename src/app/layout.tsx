import type { Metadata } from "next";
import "./globals.css";
import { adminMonoFont, adminSansFont, bodyFont, headingFont } from "./fonts";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZKS Catering | Katering Industri Karawang - PT. Zahdan Kamal Sentosa",
    template: "%s | ZKS Catering Karawang",
  },
  description:
    "Dapur sentral katering industri di Karawang. Ribuan porsi per hari untuk pabrik dan perusahaan, bersertifikat ISO 22000 dan Halal, diantar tepat waktu lintas shift.",
  applicationName: "ZKS Catering",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ZKS Catering",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${headingFont.variable} ${bodyFont.variable} ${adminSansFont.variable} ${adminMonoFont.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink selection:bg-brand-500/20 selection:text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
