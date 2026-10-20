import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PT. Zahdan Kamal Sentosa | Catering Profesional Karawang",
  description:
    "Jasa catering profesional untuk perusahaan, pabrik, event, dan jasa boga di kawasan industri Karawang. Bersertifikasi ISO 22000 dan Halal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413]">{children}</body>
    </html>
  );
}
