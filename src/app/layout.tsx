import type { Metadata } from "next";
import "./globals.css";
import { bodyFont, headingFont } from "./fonts";
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
      className={`${headingFont.variable} ${bodyFont.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413] font-sans">
        {children}
      </body>
    </html>
  );
}
